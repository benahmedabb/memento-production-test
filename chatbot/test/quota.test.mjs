import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../package.json', import.meta.url));
const { Miniflare, convertV4MiniflareOptions } = require('miniflare');
const { build } = require('esbuild');

test('SQLite Durable Object enforces concurrency, daily counts, settlement and deletion', async t => {
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
  const attempts = await Promise.all(Array.from({ length: 12 }, () => call('admit', [client])));
  assert.equal(attempts.filter(Boolean).length, 3);
  for (let count = 3; count < 20; count++) {
    await call('clearMinute');
    assert.equal(await call('admit', [client]), true);
  }
  await call('clearMinute');
  assert.equal(await call('admit', [client]), false);
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
