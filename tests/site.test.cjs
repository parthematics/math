'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..', 'dist');

test('the portable lab includes its scripts and styles without sibling requests', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.ok(html.includes('<style>'));
  assert.ok(html.includes('function circle('));
  assert.ok(html.includes('function render()'));
  assert.doesNotMatch(html, /<script[^>]+src=|<link[^>]+rel="stylesheet"/i);
  assert.doesNotMatch(html, /href="[^"]+\.md"/);
});

test('published learning pages render mathematics and all local links resolve', () => {
  for (const filename of ['index.html', 'curriculum.html', 'lesson-1.html', 'placement.html']) {
    const html = fs.readFileSync(path.join(root, filename), 'utf8');
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const href = match[1];
      if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(href)) continue;
      assert.ok(fs.existsSync(path.resolve(root, href.split('#')[0])), filename + ' → ' + href);
    }
    if (filename !== 'index.html') {
      assert.ok(html.includes('class="katex'), filename + ' should render its equations');
      assert.doesNotMatch(html, /katex-error/);
    }
  }
  const css = fs.readFileSync(path.join(root, 'assets/katex.min.css'), 'utf8');
  for (const [, font] of css.matchAll(/url\(([^)]+)\)/g)) {
    assert.ok(fs.existsSync(path.join(root, 'assets', font)), 'Missing math font: ' + font);
  }
});

test('the published artifact excludes personal learning records and development files', () => {
  assert.deepEqual(fs.readdirSync(root).sort(), [
    '.nojekyll', 'assets', 'curriculum.html', 'index.html', 'lesson-1.html', 'placement.html',
  ]);
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /GH_TOKEN|GITHUB_TOKEN|LEARNING_PROFILE\.md|PROGRESS\.md/);
});
