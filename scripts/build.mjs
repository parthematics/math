import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import texmath from 'markdown-it-texmath';
import katex from 'katex';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
const documents = [
  { source: 'CURRICULUM.md', output: 'curriculum.html', title: 'Your learning path' },
  { source: 'lessons/01-same-circle-different-clock.md', output: 'lesson-1.html', title: 'Lesson 1 · Same circle, different clock' },
  { source: 'lessons/00-placement.md', output: 'placement.html', title: 'A small placement check' },
];
const routes = new Map(documents.map(doc => [path.resolve(root, doc.source), doc.output]));
routes.set(path.resolve(root, 'index.html'), 'index.html');

function publicLink(href, source) {
  if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(href)) return href;
  const [pathname, fragment] = href.split('#');
  const destination = routes.get(path.resolve(root, path.dirname(source), pathname));
  if (!destination) throw new Error('Unlisted public document link: ' + source + ' → ' + href);
  return destination + (fragment ? '#' + fragment : '');
}

const css = await readFile(path.join(root, 'styles.css'), 'utf8');
const readerCss = await readFile(path.join(root, 'reader.css'), 'utf8');
const source = await readFile(path.join(root, 'index.html'), 'utf8');
const geometry = await readFile(path.join(root, 'geometry.js'), 'utf8');
const practice = await readFile(path.join(root, 'practice.js'), 'utf8');
const app = await readFile(path.join(root, 'app.js'), 'utf8');
let index = source.replace('<link rel="stylesheet" href="styles.css">', () => '<style>\n' + css + '\n</style>');
index = index.replace(/^\s*<script src="(?:geometry|practice|app)\.js" defer><\/script>\s*$/gm, '');
index = index.replace(/href="([^"]+\.md(?:#[^"]*)?)"/g, (_, href) => 'href="' + publicLink(href, 'index.html') + '"');
const inline = (geometry + '\n' + practice + '\n' + app).replace(/<\/script/gi, '<\\/script');
index = index.replace('</body>', () => '<script>\n' + inline + '\n</script>\n</body>');
if (/<script[^>]+src=|<link[^>]+rel="stylesheet"/i.test(index)) {
  throw new Error('The portable lab must not depend on separate scripts or stylesheets.');
}

await mkdir(out, { recursive: true });
// Explicit publication list: learning profile, progress log, tests, and repository
// metadata are never copied into the website.
await writeFile(path.join(out, 'index.html'), index);

const md = new MarkdownIt({ html: true, typographer: true })
  .use(texmath, {
    engine: katex,
    delimiters: 'dollars',
    katexOptions: { throwOnError: true, trust: false, strict: 'error' },
  });
const defaultLink = md.renderer.rules.link_open || ((tokens, i, options, env, self) => self.renderToken(tokens, i, options));
md.renderer.rules.link_open = (tokens, i, options, env, self) => {
  tokens[i].attrSet('href', publicLink(tokens[i].attrGet('href'), env.source));
  return defaultLink(tokens, i, options, env, self);
};

for (const doc of documents) {
  const body = md.render(await readFile(path.join(root, doc.source), 'utf8'), { source: doc.source });
  if (body.includes('katex-error')) throw new Error('Math failed to render in ' + doc.source);
  const page = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>' + doc.title + ' · Math</title>' +
    '<meta name="theme-color" content="#ffffff">' +
    '<link rel="stylesheet" href="assets/katex.min.css">' +
    '<style>' + readerCss + '</style></head><body>' +
    '<header class="reader-header"><a href="index.html#learn">← Back to the lesson</a>' +
    '<nav aria-label="Reading navigation"><a href="lesson-1.html">Lesson 1</a>' +
    '<a href="curriculum.html">Curriculum</a><a href="placement.html">Placement</a></nav></header>' +
    '<main class="reader">' + body + '</main></body></html>\n';
  await writeFile(path.join(out, doc.output), page);
}
await mkdir(path.join(out, 'assets'), { recursive: true });
await cp(path.join(root, 'node_modules/katex/dist/katex.min.css'), path.join(out, 'assets/katex.min.css'));
await cp(path.join(root, 'node_modules/katex/dist/fonts'), path.join(out, 'assets/fonts'), { recursive: true });
await cp(path.join(root, 'node_modules/katex/LICENSE'), path.join(out, 'assets/KATEX-LICENSE.txt'));
await writeFile(path.join(out, '.nojekyll'), '');
console.log('Built dist/: portable lab + curriculum, lesson, and placement pages with local math fonts.');
