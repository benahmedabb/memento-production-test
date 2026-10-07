import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { catalogPages, catalogHubs, catalogChildren } from '../src/app/core/service-catalog.ts';
import { catalogLinks } from '../src/app/core/service-navigation.ts';
import { serviceRedirects } from '../src/app/core/service-redirects.ts';
import { siteConfig, serviceEntries } from '../src/app/core/site.config.ts';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [sitemap, htaccess] = await Promise.all([read('../public/sitemap.xml'), read('../public/.htaccess')]);
assert.deepEqual(
  catalogLinks,
  catalogPages.map(({ path, category, kind, label }) => ({ path, category, kind, label })),
  'Navigation and editorial catalog differ',
);
const paths = new Set(catalogPages.map((page) => page.path));
const canonical = new Set([
  ...paths,
  '/',
  '/agenzia',
  '/servizi',
  '/google-meta-ads',
  '/portfolio',
  '/recensioni',
  '/contatti',
  '/privacy-policy',
]);
const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
for (const field of ['path', 'title', 'description', 'heading']) {
  assert.equal(new Set(catalogPages.map((page) => page[field])).size, catalogPages.length, `Duplicate ${field}`);
}
assert.equal(catalogHubs.length, 5);
assert.equal(catalogPages.filter((page) => page.kind === 'detail').length, 19);
assert.equal(listed.length, new Set(listed).size, 'Duplicate sitemap URL');
assert.deepEqual(new Set(listed), new Set([...canonical].map((path) => siteConfig.origin + path)));
for (const page of catalogPages) {
  assert.match(page.path, /^\/[a-z0-9-]+(?:\/[a-z0-9-]+)?$/);
  assert(page.intro && page.claim && page.sections.length && page.faqs.length, `Incomplete page: ${page.path}`);
  assert(
    !/\[\s*(?:CONFERMA|NUMERI REALI|TODO)|DA INSERIRE|https?:\/\/drive\.google/i.test(JSON.stringify(page)),
    `Editorial note exposed: ${page.path}`,
  );
  for (const related of page.related) assert(canonical.has(related), `Unknown related URL: ${related}`);
  for (const slug of page.projectSlugs)
    assert(
      siteConfig.portfolio.some((project) => project.slug === slug),
      `Unknown project: ${slug}`,
    );
  if (page.kind === 'detail')
    assert(
      catalogHubs.some((hub) => hub.category === page.category && catalogChildren(hub.path).includes(page)),
      `Orphan: ${page.path}`,
    );
}
for (const { path } of serviceEntries) assert(canonical.has(path), `Unknown directory URL: ${path}`);
const rules = [...htaccess.matchAll(/^RewriteRule\s+(\S+)\s+(\/\S+)\s+\[([^\]]+)\]/gm)];
for (const { from, to } of serviceRedirects) {
  assert(paths.has(to), `Redirect destination is not canonical: ${to}`);
  assert(!listed.includes(siteConfig.origin + from), `Old address in sitemap: ${from}`);
  for (const path of [from.slice(1), from.slice(1) + '/']) {
    const rule = rules.find(([, pattern]) => new RegExp(pattern).test(path));
    assert(rule, `Missing Apache redirect: ${path}`);
    assert.equal(rule[2], to, `Wrong redirect destination: ${path}`);
    assert(rule[3].includes('R=301'), `Non-permanent redirect: ${path}`);
  }
}
console.log(
  `Catalog OK: ${catalogHubs.length} hubs, ${catalogPages.length - catalogHubs.length} details, ${listed.length} canonical sitemap URLs, ${serviceRedirects.length} permanent redirects.`,
);
