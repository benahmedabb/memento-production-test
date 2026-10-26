export interface Source { title: string; path: string }
export interface Entry extends Source {
  id: string;
  text: string;
  questions: string[];
  terms: string[];
}
export interface Knowledge {
  version: string;
  entries: Entry[];
}
export interface ChatRequest {
  message: string;
  page?: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  turnstileToken?: string;
}
export interface ChatReply {
  text: string;
  sources: Source[];
  version: string;
  mode: 'faq' | 'ai' | 'clarification' | 'fallback';
  error?: { code: ChatError; retryAfterSeconds?: number };
}
export const ERROR_TEXT = {
  invalid_request: 'Non riesco a leggere questo messaggio. Prova a inviarlo di nuovo.',
  access_denied: 'La chat non è abilitata su questa pagina.',
  verification_failed: 'La verifica di sicurezza non è riuscita. Riprova a inviare il messaggio.',
  rate_limit: 'Sono arrivati diversi messaggi in poco tempo. Attendi un minuto e riprova.',
  daily_limit: 'È stato raggiunto il limite giornaliero della chat per questa connessione. Puoi continuare con il team su WhatsApp o tramite i contatti.',
  budget_exhausted: 'La chat ha esaurito la disponibilità IA di oggi. Puoi continuare con il team su WhatsApp o tramite i contatti.',
  unavailable: 'Il servizio di chat è temporaneamente indisponibile. Riprova più tardi oppure contatta il team.',
  timeout: 'La risposta sta impiegando troppo tempo. Riprova tra poco oppure contatta il team.',
  invalid_model_response: 'Non sono riuscito a formulare una risposta valida. Puoi riprovare oppure contattare il team.',
  personal_data: 'Per la tua privacy, invia il messaggio senza email o numeri di telefono. Puoi condividere i recapiti direttamente con il team tramite i contatti.',
  network_error: 'Non riesco a collegarmi al servizio di chat. Controlla la connessione e riprova.',
} as const;
export type ChatError = keyof typeof ERROR_TEXT;
export function errorReply(code: ChatError, version = 'unavailable', retryAfterSeconds?: number): ChatReply {
  return { text: ERROR_TEXT[code], sources: [{ title: 'Contatti', path: '/contatti' }], mode: 'fallback', version,
    error: { code, ...(retryAfterSeconds === undefined ? {} : { retryAfterSeconds }) } };
}
export const MAX_MESSAGE = 800;
export function normalize(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}
const STOP = new Set('a ad al alla alle anche che chi ci come con cosa da dal dalla dei del della delle di e ed gli ha hai i il in io la le lo ma mi nel nella noi o per piu quali quale quanto quanti se si siete sono su sul un una uno vi voi vorrei posso potete fate avete vostro vostra vostri vostre realizzate realizzare fare costruire progettate occupa lavorato organizzate preparate definite presentare'.split(' '));
const ALIASES: Record<string, string> = { montare: 'montaggio', montate: 'montaggio', montiamo: 'montaggio', montaggi: 'montaggio' };
export function terms(value: string): string[] {
  // Light singular/plural matching, shared by the generated index and query lookup.
  return [...new Set(normalize(value).split(' ').filter(word => word.length > 2 && !STOP.has(word)).map(word => ALIASES[word] ?? word).map(word => word.length > 4 ? word.replace(/[aeio]$/, '') : word))];
}
export function replyFrom(entries: Entry[], version: string, mode: 'faq' | 'ai'): ChatReply {
  const sources = [...new Map(entries.map(entry => [`${entry.path}:${entry.title}`, { title: entry.title, path: entry.path }])).values()];
  return { text: entries.map(entry => entry.title.startsWith('Recensione ·') ? `${entry.title}: «${entry.text}»` : entry.text).join('\n\n'), sources, mode, version };
}
export function exactAnswer(kb: Knowledge, message: string, page?: string): ChatReply | null {
  const query = normalize(message);
  const found = kb.entries.filter(entry => entry.questions.some(question => normalize(question) === query));
  const contextual = found.filter(entry => entry.path === page);
  const matches = contextual.length ? contextual : found;
  if (!matches.length) return null;
  if (new Set(matches.map(entry => entry.text)).size > 1) {
    return { text: 'A quale servizio ti riferisci? Puoi specificare fotografia, video, social, grafica oppure web.', sources: [], mode: 'clarification', version: kb.version };
  }
  return replyFrom([matches[0]], kb.version, 'faq');
}
export function retrieve(kb: Knowledge, message: string, page?: string): Entry[] {
  const query = terms(message);
  if (!query.length) return [];
  // Index is generated once at build time. No embeddings, network fetches or crawling.
  // Rare names and service terms carry more weight than common words such as "progetto".
  const weights = new Map(query.map(term => [term, Math.log(1 + kb.entries.length / (1 + kb.entries.filter(entry => entry.terms.includes(term)).length))]));
  const availableWeight = query.reduce((sum, term) => sum + weights.get(term)!, 0);
  const ranked = kb.entries.map(entry => {
    const hits = query.filter(term => entry.terms.includes(term));
    const titleTerms = terms(entry.title);
    const relevance = hits.reduce((sum, term) => sum + weights.get(term)!, 0);
    const titleBoost = hits.reduce((sum, term) => sum + (titleTerms.includes(term) ? weights.get(term)! * 0.6 : 0), 0);
    return { entry, hits: hits.length, coverage: relevance / availableWeight, score: relevance + titleBoost + (entry.path === page ? 1 : 0) };
  }).filter(result => result.hits > 0 && result.coverage >= 0.2)
    .sort((a, b) => b.score - a.score);
  return ranked.slice(0, 3).map(result => result.entry);
}
