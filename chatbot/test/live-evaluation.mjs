// Explicitly invoked integration check. Uses real Workers AI quota; never runs in chatbot:test.
// No public evaluation endpoint, real secrets, or transcript from visitors is used.
import '../../scripts/register-types.mjs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const { handle } = await import('../src/handler.ts');
const require = createRequire(new URL('../package.json', import.meta.url));
const { getPlatformProxy } = require('wrangler');
const directory = new URL('../.wrangler/evaluation/', import.meta.url);
await mkdir(directory, { recursive: true });
const configPath = new URL('wrangler.json', directory);
await writeFile(configPath, JSON.stringify({ name: 'memento-evaluation', compatibility_date: '2026-10-25', ai: { binding: 'AI', remote: true }, observability: { enabled: false } }));
const kb = JSON.parse(await readFile(new URL('../data/base.json', import.meta.url), 'utf8'));
const corpus = JSON.parse(await readFile(new URL('./evaluation.json', import.meta.url), 'utf8'));
const corpusQuestions = [
  ...(corpus.dialogue ?? []).map(item => ({ category: 'dialogue', ...item })),
  ...corpus.normal.map(([question, expectedPath]) => ({ category: 'normal', question, expectedPath })),
  ...corpus.missing.map(question => ({ category: 'missing', question })),
  ...corpus.attacks.map(question => ({ category: 'attack', question })),
  ...(corpus.regressions ?? []).map(item => ({ category: 'dialogue', ...item })),
];
const limit = Math.max(1, Math.min(corpusQuestions.length, Number(process.argv[2]) || corpusQuestions.length));
const selection = process.argv.find(arg => arg.startsWith('--cases='))?.slice(8).split(',').map(Number);
const questions = corpusQuestions.filter((_item, index) => !selection || selection.includes(index + 1)).slice(0, limit);
let charged = 0;
let calls = 0;
let modelOutput = [];
const reservations = new Map();
const quota = {
  async admitDetailed() { return { allowed: true }; }, // Local synthetic evaluation, not an HTTP-accessible bypass.
  async reserve(amount) {
    if (charged + amount > 4_000_000) return null; // Hard conservative test budget: 4,000 neurons.
    const id = crypto.randomUUID(); reservations.set(id, amount); charged += amount; return id;
  },
  async settle(id, actual) {
    const reserved = reservations.get(id);
    if (reserved !== undefined) { charged += actual - reserved; reservations.delete(id); }
  },
};
const report = [];
let proxy;
try {
  proxy = await getPlatformProxy({ configPath: fileURLToPath(configPath), envFiles: [], persist: false, remoteBindings: true });
  const env = {
    ALLOWED_ORIGINS: 'https://mementoproduction.it', AI_ENABLED: 'true',
    IP_HASH_SECRET: 'local-synthetic-evaluation-key-not-used-in-production', TURNSTILE_SECRET: 'local-evaluation-only',
    AI: { async run(...args) {
      calls++;
      const started = Date.now();
      try {
        const result = await proxy.env.AI.run(...args);
        modelOutput.push({ response: result.response, usage: result.usage, durationMs: Date.now() - started });
        return result;
      } catch (error) {
        modelOutput.push({ error: String(error), durationMs: Date.now() - started });
        throw error;
      }
    } },
  };
  for (const item of questions) {
    modelOutput = [];
    const req = new Request('https://local-evaluation.invalid/v1/chat', { method: 'POST', headers: { origin: env.ALLOWED_ORIGINS, 'content-type': 'application/json', 'CF-Connecting-IP': '203.0.113.12' }, body: JSON.stringify({ message: item.question, history: item.history, turnstileToken: 'local-evaluation' }) });
    const response = await handle(req, env, kb, quota, async () => Response.json({ success: true, hostname: 'mementoproduction.it', action: 'memento_chat' }));
    const reply = await response.json();
    const pass = response.ok && !reply.error && (item.category === 'dialogue'
      ? (item.expectedMode ? reply.mode === item.expectedMode : !item.expectedPath || reply.sources.some(source => source.path.startsWith(item.expectedPath))) && (!item.mustAsk || reply.text.includes('?')) && (!item.mustMention || new RegExp(item.mustMention, 'i').test(reply.text)) && (!item.mustNotMention || !new RegExp(item.mustNotMention, 'i').test(reply.text))
      : item.category === 'normal'
      ? (reply.mode === 'clarification' || reply.sources.some(source => source.path.startsWith(item.expectedPath))) && reply.mode !== 'fallback'
      : reply.mode === 'fallback');
    report.push({ ...item, pass, status: response.status, reply, modelOutput });
    console.log(`${report.length}/${questions.length} ${pass ? 'PASS' : 'REVIEW'} ${reply.mode}: ${item.question}`);
    await writeFile(new URL('report.json', directory), JSON.stringify({ version: kb.version, calls, reservedOrUsedNeurons: charged / 1000, results: report }, null, 2));
  }
  console.log(JSON.stringify({ passed: report.filter(item => item.pass).length, total: report.length, calls, reservedOrUsedNeurons: charged / 1000 }));
} finally { await proxy?.dispose(); }
