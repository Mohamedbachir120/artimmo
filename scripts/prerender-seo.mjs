// After `vite build`: write one HTML file per route with that route's own
// <title>, meta description, canonical and a plain-text summary inside #root.
// Search engines then see the right title and text without running JavaScript;
// React replaces the summary as soon as the app mounts.
//
// Output: docs/index.html (home) and docs/_seo/<route>.html for every other
// route. public/.htaccess serves /_seo/<route>.html for /<route>.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'docs')
const SITE = 'https://artimmo.dz'
const BRAND = 'ARTIMMO Promotion'

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Load the data modules through Vite so their image imports resolve.
const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { projectsData } = await vite.ssrLoadModule('/src/data/projects.js')
const { localPages } = await vite.ssrLoadModule('/src/data/localPages.js')
await vite.close()

// Title and description of the static pages, read from the page components
// so they stay in one place.
async function pageMeta(file) {
  const src = await readFile(join(root, 'src/pages', file), 'utf8')
  const title = src.match(/title:\s*"([^"]+)"/)?.[1]
  const description = src.match(/description:\s*"([^"]+)"/)?.[1]
  if (!title || !description) throw new Error(`No title/description found in ${file}`)
  return { title: `${title} | ${BRAND}`, description }
}

const links = [
  ['/', 'Accueil'],
  ['/nos-signatures', 'Nos signatures'],
  ...projectsData.map((p) => [`/nos-signatures/${p.slug}`, p.name]),
  ...localPages.map((p) => [`/${p.slug}`, p.h1]),
  ['/artimmo', 'ARTIMMO'],
  ['/parlons-en', 'Parlons-en'],
]
const nav = `<nav><ul>${links.map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`).join('')}</ul></nav>`
const block = (h1, paragraphs) =>
  `<div class="max-w-3xl mx-auto px-4 pt-28 pb-20 text-white"><h1>${esc(h1)}</h1>${paragraphs
    .map((p) => `<p>${esc(p)}</p>`)
    .join('')}${nav}</div>`

const residencesText = projectsData.map(
  (p) => `${p.name} (${p.city}) : ${p.projectInfo.totalLogements} logements ${p.projectInfo.types.join(', ')}, ${p.projectInfo.surfaces}.`
)

const routes = [
  {
    path: '/',
    h1: 'Promotion immobilière à Alger',
    body: [localPages[0].intro[0], ...residencesText],
  },
  {
    path: '/nos-signatures',
    ...(await pageMeta('ProjectsPage.jsx')),
    h1: 'Nos résidences haut standing à Alger',
    body: residencesText,
  },
  ...projectsData.map((p) => ({
    path: `/nos-signatures/${p.slug}`,
    title: `${p.seo.title} | ${BRAND}`,
    description: p.seo.metaDescription,
    h1: p.seo.h1,
    body: [p.description, ...p.features],
  })),
  ...localPages.map((p) => ({
    path: `/${p.slug}`,
    title: `${p.title} | ${BRAND}`,
    description: p.description,
    h1: p.h1,
    body: p.intro,
  })),
  { path: '/artimmo', ...(await pageMeta('AboutPage.jsx')), h1: 'ARTIMMO Promotion, promoteur immobilier à Alger', body: [] },
  { path: '/parlons-en', ...(await pageMeta('ContactPage.jsx')), h1: 'Contactez ARTIMMO Promotion', body: [] },
]

const template = await readFile(join(outDir, 'index.html'), 'utf8')

function replaceOnce(html, re, value, label) {
  if (!re.test(html)) throw new Error(`prerender-seo: ${label} not found in docs/index.html`)
  return html.replace(re, value)
}

for (const r of routes) {
  const url = `${SITE}${r.path}`
  let html = template
  if (r.title) {
    html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${esc(r.title)}</title>`, '<title>')
    html = replaceOnce(html, /(<meta property="og:title" content=")[^"]*/, `$1${esc(r.title)}`, 'og:title')
    html = replaceOnce(html, /(<meta name="twitter:title" content=")[^"]*/, `$1${esc(r.title)}`, 'twitter:title')
  }
  if (r.description) {
    html = replaceOnce(html, /(<meta name="description" content=")[^"]*/, `$1${esc(r.description)}`, 'description')
    html = replaceOnce(html, /(<meta property="og:description" content=")[^"]*/, `$1${esc(r.description)}`, 'og:description')
    html = replaceOnce(html, /(<meta name="twitter:description" content=")[^"]*/, `$1${esc(r.description)}`, 'twitter:description')
  }
  html = replaceOnce(html, /(<link rel="canonical" href=")[^"]*/, `$1${url}`, 'canonical')
  html = replaceOnce(html, /(<meta property="og:url" content=")[^"]*/, `$1${url}`, 'og:url')
  html = replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">${block(r.h1, r.body)}</div>`, '#root')

  const file = r.path === '/' ? join(outDir, 'index.html') : join(outDir, '_seo', `${r.path.slice(1)}.html`)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html)
}

console.log(`prerender-seo: wrote ${routes.length} pages`)
