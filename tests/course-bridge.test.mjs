import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = path => readFile(new URL(path, import.meta.url), "utf8");

test("post-table course bridge prioritizes Chemistry Zenit and keeps Skool secondary", async () => {
  const [app, config] = await Promise.all([read("../src/App.jsx"), read("../src/config.js")]);
  assert.match(config, /export const chemistryCourseUrl = "https:\/\/quimica\.sistemazenit\.com\/"/);
  assert.match(config, /export const communityUrl = "https:\/\/www\.skool\.com\//);
  assert.match(app, /import \{ chemistryCourseUrl, communityUrl \} from "\.\/config\.js"/);

  const afterTable = app.indexOf('className="table-community-cta course-bridge"');
  const sectionEnd = app.indexOf("</aside>", afterTable);
  const tableEnd = app.indexOf('</section>', app.indexOf('id="tabla-periodica"'));
  const nextSection = app.indexOf('className="learning-mode"', sectionEnd);
  assert.ok(afterTable > tableEnd && sectionEnd > afterTable && nextSection > sectionEnd);

  const bridge = app.slice(afterTable, sectionEnd);
  assert.match(bridge, /href=\{chemistryCourseUrl\}/);
  assert.match(bridge, /href=\{communityUrl\}/);
  assert.match(bridge, /Explorar el curso de Química Zenit/);
  assert.match(bridge, /Ir directamente a Skool/);
  assert.ok(bridge.indexOf('href={chemistryCourseUrl}') < bridge.indexOf('href={communityUrl}'));
  assert.match(bridge, /data-cta-placement="after-table-course"/);
  assert.match(bridge, /data-cta-placement="after-table-skool"/);
  assert.equal((bridge.match(/target="_blank"/g) || []).length, 2);
  assert.equal((bridge.match(/rel="noopener noreferrer"/g) || []).length, 2);
});

test("post-table course bridge stacks its CTAs on mobile and supports dark mode", async () => {
  const css = await read("../src/styles.css");
  assert.match(css, /\.table-community-cta\.course-bridge\s*\{/);
  assert.match(css, /\.course-bridge-primary\s*\{/);
  assert.match(css, /\.course-bridge-secondary\s*\{/);
  assert.match(css, /\[data-theme="dark"\] \.course-bridge-secondary/);
  assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*?\.course-bridge-actions\s*\{/);
  assert.match(css, /\.course-bridge-actions a:focus-visible/);
});


test("Chemistry course is discoverable before scrolling past the periodic table", async () => {
  const [app, css] = await Promise.all([read("../src/App.jsx"), read("../src/styles.css")]);
  const top = app.indexOf('className="top-authority-bar"');
  const shortcuts = app.indexOf('className="home-shortcuts"');
  const table = app.indexOf('id="tabla-periodica"');
  const afterTable = app.indexOf('className="table-community-cta course-bridge"');

  assert.ok(top >= 0 && shortcuts > top && table > shortcuts && afterTable > table);
  const topbar = app.slice(top, shortcuts);
  const nav = app.slice(shortcuts, table);
  assert.match(topbar, /data-cta-placement="top-course"/);
  assert.match(topbar, /href=\{chemistryCourseUrl\}/);
  assert.match(topbar, /Explorar Química Zenit/);
  assert.match(nav, /className="download-community chemistry-shortcut"/);
  assert.match(nav, /href=\{chemistryCourseUrl\}/);
  assert.match(nav, /data-cta-placement="before-table-course"/);
  assert.match(nav, /Conocer Química Zenit/);
  assert.match(css, /\.home-shortcuts \.chemistry-shortcut\s*\{/);
  assert.match(css, /\.home-shortcuts \.chemistry-shortcut a\.chemistry-shortcut-link\s*\{/);
  assert.match(css, /\[data-theme="dark"\] \.home-shortcuts \.chemistry-shortcut/);
  assert.match(css, /@media \(max-width: 700px\)\s*\{\s*\.home-shortcuts \.chemistry-shortcut\s*\{/);
});
