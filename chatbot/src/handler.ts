import { exactAnswer, errorReply, MAX_MESSAGE, normalize, retrieve } from '../shared/protocol';
import type { ChatRequest, ChatReply, ChatError, Entry, Knowledge } from '../shared/protocol';
import { ANSWER, answerSchema, generatedReply, parsePlan, PLAN_SCHEMA, UNDERSTAND } from './dialogue';

export type Admission = { allowed: true } | { allowed: false; code: 'rate_limit' | 'daily_limit' | 'invalid_request'; retryAfterSeconds?: number };
export interface Quota {
  admitDetailed(client: string): Promise<Admission>;
  reserve(amount: number): Promise<string | null>;
  settle(id: string, actual: number): Promise<void>;
}
interface ModelResult { response?: unknown; usage?: { prompt_tokens?: number; completion_tokens?: number } }
export interface Environment {
  AI_ENABLED: string;
  ALLOWED_ORIGINS: string;
  TURNSTILE_SECRET?: string;
  IP_HASH_SECRET?: string;
  AI?: { run(model: string, input: { messages: { role: string; content: string }[]; max_tokens: number; temperature: number; stream: false; response_format: { type: 'json_schema'; json_schema: object } }): Promise<ModelResult> };
}
export const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const encoder = new TextEncoder();
const MAX_BODY = 16_384;

export function validateInput(value: unknown, kb: Knowledge): ChatRequest | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (Object.keys(input).some(key => !['message', 'history', 'page', 'turnstileToken'].includes(key))) return null;
  if (typeof input['message'] !== 'string' || !input['message'].trim() || input['message'].length > MAX_MESSAGE) return null;
  if (input['turnstileToken'] !== undefined && (typeof input['turnstileToken'] !== 'string' || input['turnstileToken'].length > 2048)) return null;
  if (input['page'] !== undefined && (typeof input['page'] !== 'string' || input['page'].length > 180)) return null;
  if (input['history'] !== undefined) {
    if (!Array.isArray(input['history']) || input['history'].length > 4) return null;
    if (input['history'].some(item => !item || !['user', 'assistant'].includes(item.role) || typeof item.content !== 'string' || item.content.length > MAX_MESSAGE || Object.keys(item).some(key => key !== 'role' && key !== 'content'))) return null;
  }
  const page = typeof input['page'] === 'string' && kb.entries.some(entry => entry.path === input['page']) ? input['page'] : undefined;
  return { message: input['message'].trim(), page, history: input['history'] as ChatRequest['history'], turnstileToken: input['turnstileToken'] as string | undefined };
}

async function readBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > MAX_BODY || !request.body) throw new Error('body');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await within(reader.read(), 3000);
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY) throw new Error('body');
      chunks.push(value);
    }
  } catch (error) { await reader.cancel(); throw error; }
  const all = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { all.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true, ignoreBOM: false }).decode(all));
}

export async function clientHash(ip: string, secret: string, day = new Date().toISOString().slice(0, 10)): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(`${day}:${ip}`));
  return Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
}

export function milliNeurons(inputTokens: number, outputTokens: number): number {
  return Math.ceil((inputTokens * 26668 + outputTokens * 204805) / 1000);
}

class BudgetExceeded extends Error {}
class ServiceTimeout extends Error {}

async function infer(env: Environment, quota: Quota, messages: { role: string; content: string }[], maxTokens: number, timeout: number, schema: object): Promise<unknown> {
  const bytes = encoder.encode(JSON.stringify(messages)).length;
  if (bytes > 9500) throw new Error('context');
  // Each stage reserves independently before inference. Timeouts retain their reservation.
  const reservation = await within(quota.reserve(milliNeurons(bytes + encoder.encode(JSON.stringify(schema)).length + 256, maxTokens)), 2000);
  if (!reservation) throw new BudgetExceeded();
  const result = await within(env.AI!.run(MODEL, { messages, max_tokens: maxTokens, temperature: 0, stream: false, response_format: { type: 'json_schema', json_schema: schema } }), timeout);
  const usage = result.usage;
  if (Number.isSafeInteger(usage?.prompt_tokens) && Number.isSafeInteger(usage?.completion_tokens) && usage!.prompt_tokens! > 0 && usage!.completion_tokens! >= 0) {
    await within(quota.settle(reservation, milliNeurons(usage!.prompt_tokens!, usage!.completion_tokens!)), 2000);
  }
  return result.response;
}

async function within<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try { return await Promise.race([promise, new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new ServiceTimeout()), ms); })]); }
  finally { if (timer !== undefined) clearTimeout(timer); }
}

export async function handle(request: Request, env: Environment, kb: Knowledge, quota: Quota, verifyFetch: typeof fetch = fetch): Promise<Response> {
  const origin = request.headers.get('origin') ?? '';
  const allowed = env.ALLOWED_ORIGINS.split(',').map(value => value.trim()).filter(Boolean);
  const cors = allowed.includes(origin);
  const headers: Record<string, string> = {
    'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff',
    'vary': 'Origin', ...(cors ? { 'access-control-allow-origin': origin } : {}),
  };
  const send = (body: ChatReply, status = 200) => new Response(JSON.stringify(body), { status, headers: {
    ...headers, ...(body.error?.retryAfterSeconds ? { 'retry-after': String(body.error.retryAfterSeconds), 'access-control-expose-headers': 'Retry-After' } : {}),
  } });
  const fail = (code: ChatError, status: number, retryAfterSeconds?: number) => send(errorReply(code, kb.version, retryAfterSeconds), status);
  if (new URL(request.url).pathname !== '/v1/chat') return fail('invalid_request', 404);
  if (!cors) return fail('access_denied', 403);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'access-control-allow-methods': 'POST', 'access-control-allow-headers': 'Content-Type', 'access-control-max-age': '600' } });
  if (request.method !== 'POST') return fail('invalid_request', 405);
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return fail('invalid_request', 415);
  let input: ChatRequest | null;
  try { input = validateInput(await within(readBody(request), 3000), kb); } catch { return fail('invalid_request', 400); }
  if (!input) return fail('invalid_request', 400);
  const exact = exactAnswer(kb, input.message, input.page);
  if (exact) return send(exact);
  if (env.AI_ENABLED !== 'true' || !env.AI || !env.TURNSTILE_SECRET || !env.IP_HASH_SECRET || env.IP_HASH_SECRET.length < 32) return fail('unavailable', 503);
  // Browser origin is not authentication. Turnstile + trusted edge IP + atomic quotas are independent checks.
  const ip = request.headers.get('CF-Connecting-IP');
  if (!ip || !input.turnstileToken) return fail('verification_failed', 403);
  try {
    const admission = await within(quota.admitDetailed(await clientHash(ip, env.IP_HASH_SECRET)), 2000);
    if (!admission.allowed) return fail(admission.code, admission.code === 'invalid_request' ? 400 : 429, admission.retryAfterSeconds);
    const verification = await verifyFetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: input.turnstileToken, remoteip: ip }),
      signal: AbortSignal.timeout(4000),
    });
    if (!verification.ok) return fail('verification_failed', 403);
    const verdict = await verification.json() as { success?: boolean; hostname?: string; action?: string };
    if (verdict.success !== true || verdict.hostname !== new URL(origin).hostname || verdict.action !== 'memento_chat') return fail('verification_failed', 403);
    // Minimise accidental personal information sent to the model. This is a heuristic, not a DLP system.
    const history = (input.history ?? []).slice(-4).map(item => ({ role: item.role, content: item.content.slice(0, 400) }));
    if (/[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?\d[\s().-]*){9,}/i.test([input.message, ...history.filter(item => item.role === 'user').map(item => item.content)].join(' '))) return fail('personal_data', 422);
    const plan = parsePlan(await infer(env, quota, [
      { role: 'system', content: UNDERSTAND },
      { role: 'user', content: JSON.stringify({ messaggio: input.message, cronologia: history, pagina: input.page }) },
    ], 220, 10_000, PLAN_SCHEMA));
    if (!plan) return fail('invalid_model_response', 502);
    // Sensitive commercial/account requests still go to the team after interpretation.
    if (/\b(?:scont\w*|prezz\w*|costa|costano|garant\w*|prenot\w*|disponibil\w*|privat\w*|password|fatturato)\b/.test(normalize(input.message))) {
      plan.intent = 'handoff';
      plan.queries = [];
    }
    const ranked = new Map<string, { entry: Entry; score: number }>();
    // Preserve original names/wording as well as the model's semantic reformulations.
    const queries = ['information', 'needs'].includes(plan.intent) ? [...new Set([input.message, ...plan.queries])] : [];
    for (const query of queries) {
      retrieve(kb, query, input.page).forEach((entry, rank) => {
        if (entry.text.length <= 900) ranked.set(entry.id, { entry, score: (ranked.get(entry.id)?.score ?? 0) + 1 / (rank + 1) });
      });
    }
    const candidates = [...ranked.values()].sort((a, b) => b.score - a.score).slice(0, 3).map(item => item.entry);
    const messages = [
      { role: 'system', content: ANSWER },
      { role: 'user', content: JSON.stringify({ messaggio: input.message, cronologia: history, interpretazione: plan.intent, fonti: candidates.map(({ id, title, text }) => ({ id, title, text })) }) },
    ];
    // An empty retrieval does not prevent a greeting or a useful clarifying question.
    const reply = generatedReply(await infer(env, quota, messages, 350, 15_000, answerSchema(candidates)), candidates, kb, plan);
    return send(reply, reply.error ? 502 : 200);
  } catch (error) {
    if (error instanceof BudgetExceeded) return fail('budget_exhausted', 429, Math.ceil((86_400_000 - Date.now() % 86_400_000) / 1000));
    if (error instanceof ServiceTimeout) return fail('timeout', 504);
    return fail('unavailable', 503);
  }
}
