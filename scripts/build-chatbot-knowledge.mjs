import './register-types.mjs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

const { siteConfig: site, pageMetadata } = await import('../src/app/core/site.config.ts');
const { aiServiceEnabled } = await import('../src/app/core/ai-service-availability.ts');
const { catalogPages } = await import('../src/app/core/service-catalog.ts');
const { portfolioCaseStudies } = await import('../src/app/core/portfolio-case-studies.ts');
const { terms } = await import('../chatbot/shared/protocol.ts');
const entries = [];
const clean = text => text.replace(/\s+/g, ' ').trim();
function add(title, path, text, questions = []) {
  text = clean(text);
  if (!text || text.includes('{{')) return;
  if (!path.startsWith('/') || path.startsWith('//')) throw new Error(`Invalid source: ${path}`);
  entries.push({ id: `s${entries.length + 1}`, title, path, text, questions, terms: terms(`${title} ${text} ${questions.join(' ')}`) });
}
add('Contatti · sede', '/contatti', `La sede di Memento Production è in ${site.contact.address}.`, ['Dove siete?', 'Dove vi trovate?', 'Qual è il vostro indirizzo?']);
add('Contatti · telefono', '/contatti', `Puoi chiamare Memento Production al ${site.contact.phoneDisplay} oppure scrivere su WhatsApp allo stesso numero.`, ['Come posso contattarvi?', 'Qual è il numero di telefono?', 'Avete WhatsApp?']);
add('Contatti · email', '/contatti', `L’indirizzo email di Memento Production è ${site.contact.email}.`, ['Qual è la vostra email?', 'Come vi scrivo via email?']);
add('Memento Production', '/contatti', `${site.contact.legalName}. Partita IVA ${site.contact.vatNumber}.`, ['Qual è la partita IVA?']);
add('Servizi', '/servizi', [...Object.values(site.services).map(service => service.shortTitle), ...(aiServiceEnabled ? ['Soluzioni IA'] : [])].join(', ') + '.', ['Quali servizi offrite?', 'Di cosa vi occupate?']);
for (const page of catalogPages) {
  add(page.label, page.path, page.intro);
  for (const part of page.deliverables) add(`${page.label} · ${part.title}`, page.path, `${part.title}: ${part.text}`);
  for (const section of page.sections) for (const paragraph of section.paragraphs) add(`${page.label} · ${section.title}`, page.path, paragraph);
  for (const step of page.process) add(`${page.label} · ${step.title}`, page.path, `${step.title}: ${step.text}`);
  for (const faq of page.faqs) add(`${page.label} · ${faq.question}`, page.path, faq.answer, [faq.question]);
}
const ads = site.services.ads;
add(ads.shortTitle, pageMetadata.ads.path, [ads.description, ...ads.deliverables, ...ads.approach].join(' '));
// Only visible editorial copy from explicitly approved templates. No source-wide crawl,
// no bindings, scripts, images, configuration objects or private source documents.
for (const relative of ['src/app/pages/agency-page.component.ts', 'src/app/shared/agency-team.component.ts']) {
  const source = await readFile(new URL(`../${relative}`, import.meta.url), 'utf8');
  const ast = ts.createSourceFile(relative, source, ts.ScriptTarget.Latest, true);
  function visit(node) {
    if (ts.isPropertyAssignment(node) && node.name.getText(ast) === 'template' && ts.isNoSubstitutionTemplateLiteral(node.initializer)) {
      const dom = new JSDOM(node.initializer.text);
      for (const element of dom.window.document.querySelectorAll('p')) {
        if (element.classList.contains('eyebrow')) continue;
        const value = clean(element.textContent);
        if (value.length > 70 && !value.includes('{{')) add('Agenzia · Memento Production', '/agenzia', value);
      }
      dom.window.close();
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
}
// The timeline is a literal data array; read only its public descriptions via the TS AST.
const timeline = await readFile(new URL('../src/app/shared/agency-process-timeline.component.ts', import.meta.url), 'utf8');
const timelineAst = ts.createSourceFile('timeline.ts', timeline, ts.ScriptTarget.Latest, true);
function visitStages(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(timelineAst) === 'stages' && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
    for (const stage of node.initializer.elements) {
      const data = {};
      if (!ts.isObjectLiteralExpression(stage)) continue;
      for (const property of stage.properties) {
        if (ts.isPropertyAssignment(property) && ts.isStringLiteral(property.initializer)) data[property.name.getText(timelineAst)] = property.initializer.text;
      }
      if (data.title && data.description) add(`Metodo · ${data.title}`, '/agenzia#metodo', data.description);
    }
  }
  ts.forEachChild(node, visitStages);
}
visitStages(timelineAst);
for (const project of portfolioCaseStudies) {
  const path = `/portfolio#${project.slug}`;
  add(`Portfolio · ${project.client}`, path, project.summary);
  for (const text of project.paragraphs) add(`Portfolio · ${project.client}`, path, text);
  if (project.results) add(`Risultati · ${project.client}`, path, `${project.results.context}${project.results.period ? ` (${project.results.period})` : ''}: ${project.results.metrics.map(metric => `${metric.displayValue} ${metric.label}`).join('; ')}. Risultati di questo progetto, non una garanzia per altri progetti.`);
}
for (const review of site.reviews) add(`Recensione · ${review.person}`, '/recensioni', review.content);
if (aiServiceEnabled) {
  add('Soluzioni IA · assistenti per aziende', pageMetadata.aiSolutions.path,
    'Memento progetta soluzioni di intelligenza artificiale per siti aziendali, in particolare assistenti IA, chiamati anche agenti IA. Usano informazioni approvate dall’azienda per rispondere a domande su servizi, processo e contatti, aiutano i visitatori a orientarsi e indirizzano al team le richieste che richiedono una persona. Possono offrire un primo orientamento anche fuori orario quando il servizio è disponibile.',
    ['Fate assistenti IA per siti web?', 'Offrite chatbot per aziende?', 'Avete soluzioni IA per rispondere ai clienti?', 'Vi occupate di intelligenza artificiale?', 'Fate soluzioni di intelligenza artificiale per aziende?', 'Come possono essere utili gli agenti IA per il mio sito?']);
  add('Soluzioni IA · come si progetta', pageMetadata.aiSolutions.path,
    'Il progetto parte dalle domande ricorrenti e dai contenuti affidabili dell’azienda. Si definiscono tono di voce, limiti di risposta e casi da passare al team; poi l’assistente viene provato anche con domande incomplete o ambigue.',
    ['Come progettate un assistente IA?', 'L’assistente può rispondere con le informazioni della mia azienda?']);
  add('Soluzioni IA · limiti', pageMetadata.aiSolutions.path,
    'Un assistente IA può sbagliare. Per ridurre risposte non pertinenti Memento lavora su fonti selezionate, limiti di risposta, test e aggiornamenti. Le scelte tecniche e privacy dipendono dal progetto e vengono concordate prima della pubblicazione.',
    ['L’assistente IA può inventare risposte?', 'Come gestite la privacy delle conversazioni?']);
}
if (entries.length < 100 || !entries.some(entry => entry.text.includes('2022'))) throw new Error('Incomplete knowledge extraction');
const version = createHash('sha256').update(JSON.stringify(entries)).digest('hex').slice(0, 16);
const payload = JSON.stringify({ version, entries }, null, 2) + '\n';
const target = new URL('../chatbot/data/base.json', import.meta.url);
const faqTarget = new URL('../public/chatbot/faq.json', import.meta.url);
const faqPayload = JSON.stringify({ version, entries: entries.filter(entry => entry.questions.length) }) + '\n';
for (const [url, content] of [[target, payload], [faqTarget, faqPayload]]) {
  if (process.argv.includes('--check')) {
    if (await readFile(url, 'utf8') !== content) throw new Error(`Regenerate ${fileURLToPath(url)} with npm run chatbot:knowledge`);
  } else {
    await mkdir(new URL('.', url), { recursive: true });
    await writeFile(url, content);
  }
}
console.log(`Knowledge ${version}: ${entries.length} approved excerpts, ${entries.filter(entry => entry.questions.length).length} FAQ. No model requests.`);
