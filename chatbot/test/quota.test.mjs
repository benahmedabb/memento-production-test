import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../package.json', import.meta.url));
const { Miniflare, convertV4MiniflareOptions } = require('miniflare');
const { build } = require('esbuild');

test('SQLite Durable Object allows more than 20 daily attempts while enforcing burst and shared budget limits', async t => {
  const result = await build({
    stdin: { contents: `
      import { ChatQuota } from './src/quota.ts';
      export class TestQuota extends ChatQuota {
        async clearMinute() { this.ctx.storage.sql.exec("UPDATE clients SET recent = '[]'"); }
        async yesterday() {
          this.ctx.storage.sql.exec('UPDATE clients SET day = day - 1');
          this.ctx.storage.sql.exec('UPDATE reservations SET day = day - 1');
          this.ctx.storage.sql.exec('UPDATE budgets SET day = day - 1');
          await this.alarm();
        }
        async counts() { return ['clients','budgets','reservations'].map(table => this.ctx.storage.sql.exec('SELECT count(*) as n FROM ' + table).one().n); }
      }
      export default { async fetch(req, env) {
        const { method, args, object = 'test' } = await req.json();
        return Response.json(await env.QUOTA.getByName(object)[method](...args) ?? null);
      } };
    `, resolveDir: fileURLToPath(new URL('..', import.meta.url)), sourcefile: 'test-worker.ts', loader: 'ts' },
    bundle: true, write: false, format: 'esm', platform: 'browser', external: ['cloudflare:workers'],
  });
  const mf = new Miniflare(convertV4MiniflareOptions({ workers: [{ name: 'quota-test', modules: true, script: result.outputFiles[0].text, compatibilityDate: '2026-10-25', durableObjects: { QUOTA: { className: 'TestQuota', useSQLite: true } } }] }));
  t.after(() => mf.dispose());
  const call = async (method, args = [], object = 'test') => {
    const res = await mf.dispatchFetch('https://local.test/', { method: 'POST', body: JSON.stringify({ method, args, object }) });
    assert.equal(res.status, 200); return res.json();
  };
  const client = 'a'.repeat(64);
  assert.deepEqual(await call('admitDetailed', ['invalid']), { allowed: false, code: 'invalid_request' });
  const attempts = await Promise.all(Array.from({ length: 12 }, () => call('admitDetailed', [client])));
  assert.equal(attempts.filter(result => result.allowed).length, 10);
  assert.ok(attempts.filter(result => !result.allowed).every(result => result.code === 'rate_limit' && result.retryAfterSeconds > 0 && result.retryAfterSeconds <= 60));
  assert.equal(await call('admit', [client]), false, 'older Worker RPC remains fail-closed');
  // Keep the same persisted client row: previously exhausted clients also regain access.
  for (let count = 10; count < 40; count++) {
    await call('clearMinute');
    assert.equal(await call('admit', [client]), true);
  }
  await call('clearMinute');
  for (let count = 0; count < 10; count++) assert.deepEqual(await call('admitDetailed', [client]), { allowed: true });
  assert.equal((await call('admitDetailed', [client])).code, 'rate_limit');
  const reservations = await Promise.all(Array.from({ length: 12 }, () => call('reserve', [1_000_000])));
  assert.equal(reservations.filter(Boolean).length, 8);
  await call('settle', [reservations.find(Boolean), 500_000]);
  await call('settle', [reservations.find(Boolean), 0]); // duplicate settlement must do nothing
  assert.equal(await call('reserve', [500_001]), null);
  assert.ok(await call('reserve', [500_000]));
  await call('yesterday');
  assert.deepEqual(await call('counts'), [0, 0, 0]);
  assert.equal(await call('admit', [client]), true);
  assert.ok(await call('reserve', [8_000_000]));
});
