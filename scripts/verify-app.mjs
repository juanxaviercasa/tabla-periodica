import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = fileURLToPath(new URL("../", import.meta.url));
const bank = JSON.parse(await readFile(new URL("../banco-preguntas-quiz.json", import.meta.url), "utf8"));
const port = process.env.REVIEW_PORT ?? "5189";
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", port, "--strictPort"], { cwd: root, stdio: "pipe" });
process.on("exit", () => server.kill());
let browser;
const results = [];
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Preview did not start")), 15000);
    server.stdout.on("data", data => { if (String(data).includes(port)) { clearTimeout(timeout); resolve(); } });
    server.on("error", reject);
    server.on("exit", code => reject(new Error(`Preview exited: ${code}`)));
  });
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const output = new URL("../.review-output/", import.meta.url);
  await mkdir(output, { recursive: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error" && /GlobalErrorBoundary|TypeError|ReferenceError/.test(message.text())) errors.push(message.text()); });
  async function check(name, work) {
    if (process.env.REVIEW_FILTER && !name.includes(process.env.REVIEW_FILTER)) return;
    try {
      await work();
    } catch (error) {
      console.error(JSON.stringify({ name, errors, dialogs: await page.locator('[role="dialog"]').evaluateAll(items => items.map(e => ({ label: e.getAttribute('aria-labelledby'), text: e.innerText.slice(0, 200) }))), body: (await page.locator('body').innerText()).slice(-1000) }, null, 2));
      await page.screenshot({ path: fileURLToPath(new URL("failure.png", output)), fullPage: true });
      throw error;
    }
    assert.deepEqual(errors.splice(0), [], name);
    results.push({ name, passed: true });
    console.log(`PASS ${name}`);
  }
  async function visit(route) {
    await page.goto(origin + route);
    await page.locator("h1").first().waitFor();
    assert.equal(await page.getByText("Algo inesperado ocurrió", { exact: true }).count(), 0);
  }

  await check("mobile routes, hydrogen and real catalog groups", async () => {
    for (const route of ["/", "/diagnostico", "/docentes", "/laboratorio", "/elemento/h", "/elemento/he", "/elemento/ne", "/elemento/fe", "/elemento/k", "/quiz/los-38"]) {
      await visit(route);
      const widths = await page.evaluate(() => [innerWidth, document.documentElement.scrollWidth]);
      assert.ok(widths[1] <= widths[0], `${route}: overflow ${widths}`);
      if (route.startsWith("/elemento/")) {
        await page.locator(".jump-diagnosis-card").waitFor();
        const group = { "/elemento/h": 1, "/elemento/he": 18, "/elemento/ne": 18, "/elemento/fe": 8, "/elemento/k": 1 }[route];
        assert.ok((await page.locator(".jump-diagnosis-card").innerText()).includes(`Grupo ${group} (IUPAC)`));
      }
    }
  });
  await check("quick mobile access focuses the table and sources cover element properties", async () => {
    await visit("/");
    await page.getByRole("link", { name: "Ver tabla periódica", exact: true }).click();
    await page.waitForFunction(() => document.activeElement.id === "tabla-periodica");
    assert.ok(page.url().endsWith("#tabla-periodica"));
    await visit("/elemento/og");
    await page.locator(".catalog-sources").waitFor();
    assert.equal(await page.locator(".catalog-sources dl a").count(), 5);
    assert.match(await page.locator(".catalog-sources").innerText(), /predichas o desconocidas/);
  });
  await check("ionization aliases and calculator validates data and scope", async () => {
    for (const tab of ["jump", "ionizations", "ionization"]) {
      await visit(`/laboratorio?tab=${tab}&sym=H`);
      await page.locator(".ionization-mode .quantum-jump-widget").waitFor();
      assert.ok((await page.locator(".diagnosis-text").innerText()).includes("al menos dos"));
    }
    await page.getByRole("button", { name: "Calculadora", exact: true }).click();
    await page.locator("#jump-calc-input").fill("578, 1817, 2745, 11577");
    assert.equal(await page.locator(".calc-diagnosis-banner .jump-predictions-row").count(), 0);
    await page.locator(".calc-scope-label input").check();
    assert.ok((await page.locator(".calc-diagnosis-banner").innerText()).includes("Grupo 13"));
    for (const input of ["578", "invalid, 1817", "100, 90", "0, 100"]) {
      await page.locator("#jump-calc-input").fill(input);
      await page.locator(".calc-empty-note").waitFor();
      assert.equal(await page.locator(".calc-diagnosis-banner").count(), 0);
    }
  });
  await check("builder uses K ground state, Fe3+ and recorded C13 stability", async () => {
    await visit("/laboratorio?sym=K");
    assert.equal(await page.locator(".nuclide-specs-list code").innerText(), "[2, 8, 8, 1]");
    await visit("/laboratorio?sym=Fe");
    for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Quitar electrón", exact: true }).click();
    assert.equal(await page.locator(".nuclide-specs-list code").innerText(), "[2, 8, 13]");
    await visit("/laboratorio?sym=C");
    await page.getByRole("button", { name: "Añadir neutrón", exact: true }).click();
    assert.ok((await page.locator(".nuclear-stability-card").innerText()).includes("Carbono-13: isótopo estable"));
    await page.getByRole("button", { name: "Añadir neutrón", exact: true }).click();
    assert.ok((await page.locator(".nuclear-stability-card").innerText()).includes("Carbono-14: isótopo radiactivo"));
    await page.screenshot({ path: fileURLToPath(new URL("mobile-lab.png", output)), fullPage: true });
  });
  await check("empty review, error recovery and scheduled reviews preserve the quiz score", async () => {
    await visit("/quiz/los-38?mode=mistakes");
    assert.equal(await page.getByRole("heading", { name: "No hay errores pendientes" }).count(), 1);
    await visit("/quiz/los-38");
    await page.getByRole("button", { name: "Entendido, practicar" }).click();
    const questions = bank["elementos-38"].preguntas;
    async function answerQuestions(correct) {
      for (let i = 0; i < questions.length; i++) {
        const answer = "abcd".indexOf(questions[i].correcta);
        await page.locator(".options button").nth(correct ? answer : (answer + 1) % 4).click();
        await page.getByRole("button", { name: i === questions.length - 1 ? "Ver resultado" : "Siguiente", exact: true }).click();
      }
      await page.locator(".result").waitFor();
    }
    await answerQuestions(false);
    await visit("/quiz/los-38?mode=mistakes");
    await page.getByRole("button", { name: "Empezar repaso" }).click();
    await answerQuestions(true);
    const progress = await page.evaluate(() => JSON.parse(localStorage.getItem("quimica-preuni-progress")));
    assert.deepEqual(progress.mistakes["los-38"], []);
    assert.deepEqual(progress.scores["los-38"], { score: 0, total: 8 });
    assert.equal(progress.mastery["los-38"].e1.attempts, 2);
    await page.getByRole("button", { name: "Repetir repaso" }).click();
    await page.getByRole("heading", { name: "No hay errores pendientes" }).waitFor();
    await page.evaluate(() => {
      const p = JSON.parse(localStorage.getItem("quimica-preuni-progress"));
      for (const question of Object.values(p.mastery["los-38"])) question.nextReview = new Date(Date.now() - 1000).toISOString();
      localStorage.setItem("quimica-preuni-progress", JSON.stringify(p));
    });
    await visit("/");
    await page.getByRole("link", { name: "Repasar ahora", exact: true }).click();
    assert.ok(page.url().includes("mode=review"));
    await page.getByRole("button", { name: "Empezar repaso" }).click();
    await answerQuestions(true);
    const after = await page.evaluate(() => JSON.parse(localStorage.getItem("quimica-preuni-progress")));
    assert.equal(after.scores["los-38"].score, 0);
    assert.ok(new Date(after.mastery["los-38"].e1.nextReview).getTime() > Date.now());
  });
  await check("guide traps focus, restores it and opens ionization from its action", async () => {
    await visit("/");
    const trigger = page.locator(".floating-guide-trigger");
    await trigger.click();
    await page.locator(".guide-modal-backdrop").waitFor({ timeout: 10000 });
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press(i % 2 ? "Shift+Tab" : "Tab");
      assert.ok(await page.evaluate(() => Boolean(document.activeElement.closest('[role="dialog"]'))));
    }
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => document.activeElement.classList.contains("floating-guide-trigger"));
    await trigger.click();
    await page.locator(".guide-nav-list button").filter({ hasText: "Salto Cuántico" }).click();
    await page.locator(".guide-action-btn.primary").click();
    await page.locator(".ionization-mode").waitFor();
    assert.ok(page.url().includes("tab=ionization"));
  });
  await check("diagnostic completes and responsive images and share metadata exist", async () => {
    await visit("/diagnostico");
    for (let i = 0; i < 6; i++) {
      await page.locator(".options button").first().click();
      await page.getByRole("button", { name: i === 5 ? "Ver mi mapa" : "Siguiente", exact: true }).click();
    }
    await page.locator(".diagnostic-result").waitFor();
    assert.equal(await page.locator('meta[property="og:image"]').getAttribute("content"), "https://tablaperiodica.sistemazenit.com/visuals/hero-periodic-map.jpg");
    await visit("/");
    assert.ok((await page.locator(".hero-img").first().getAttribute("srcset")).includes("webp"));
    await page.screenshot({ path: fileURLToPath(new URL("mobile-home.png", output)), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({ path: fileURLToPath(new URL("desktop-home.png", output)), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
  });
  await check("additional dialogs open, keep keyboard focus and close cleanly", async () => {
    await visit("/");
    await page.getByRole("button", { name: "Abrir Deletreo Químico", exact: true }).click();
    await page.locator(".speller-modal-overlay").waitFor();
    assert.match(await page.locator(".speller-modal-overlay").innerText(), /suma de masas atómicas/i);
    await page.keyboard.press("Shift+Tab");
    assert.ok(await page.evaluate(() => Boolean(document.activeElement.closest('.speller-modal-overlay'))));
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => document.activeElement.classList.contains('speller-nav-btn'));
    await visit("/laboratorio");
    await page.getByRole("button", { name: "Ir a descargar Láminas de Estudio Gratis" }).click();
    await page.locator(".laminas-modal-overlay").waitFor();
    await page.keyboard.press("ArrowRight");
    assert.ok((await page.locator(".laminas-modal-overlay").innerText()).includes("Fotos Reales"));
    await page.keyboard.press("Escape");
    await page.locator(".lab-topbar-guide-btn").click();
    await page.locator(".misconceptions-modal-overlay").waitFor();
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => document.activeElement.classList.contains('lab-topbar-guide-btn'));
  });
  await check("cold mobile load measures performance under simulated network and CPU", async () => {
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await mobile.addInitScript(() => {
      window.reviewLcp = 0;
      new PerformanceObserver(list => { window.reviewLcp = list.getEntries().at(-1).startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    const mobilePage = await mobile.newPage();
    const client = await mobile.newCDPSession(mobilePage);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 75000 });
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await mobilePage.goto(origin, { waitUntil: 'load', timeout: 60000 });
    await mobilePage.locator('h1').waitFor();
    await mobilePage.waitForFunction(() => window.reviewLcp > 0);
    const metrics = await mobilePage.evaluate(() => ({ lcp_ms: Math.round(window.reviewLcp), navigation_ms: Math.round(performance.getEntriesByType('navigation')[0].loadEventEnd), table_top_px: Math.round(document.querySelector('.periodic-board-container').getBoundingClientRect().top + scrollY), local_transfer_bytes: performance.getEntriesByType('resource').filter(r => r.name.startsWith(location.origin)).reduce((sum, r) => sum + r.transferSize, 0), webp_images: performance.getEntriesByType('resource').filter(r => r.name.includes('.webp')).length }));
    results.push({ name: 'mobile performance sample', ...metrics, network: '1.6 Mbps / 150 ms', cpu_slowdown: 4 });
    console.log(JSON.stringify(metrics));
    await mobile.close();
  });
  await check("blocked localStorage does not crash studying or saving a quiz", async () => {
    const isolated = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await isolated.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } }));
    const blocked = await isolated.newPage();
    const blockedErrors = [];
    blocked.on("pageerror", error => blockedErrors.push(error.message));
    await blocked.goto(origin);
    await blocked.locator("h1").waitFor();
    await blocked.goto(origin + "/elemento/h");
    await blocked.locator(".jump-diagnosis-card").waitFor();
    await blocked.goto(origin + "/quiz/los-38");
    await blocked.getByRole("button", { name: "Entendido, practicar" }).click();
    for (let i = 0; i < 8; i++) {
      await blocked.locator(".options button").first().click();
      await blocked.getByRole("button", { name: i === 7 ? "Ver resultado" : "Siguiente", exact: true }).click();
    }
    await blocked.locator(".result").waitFor();
    assert.ok((await blocked.locator(".storage-notice").innerText()).includes("durante esta sesión"));
    assert.deepEqual(blockedErrors, []);
    await isolated.close();
  });
  await writeFile(new URL("browser-results.json", output), JSON.stringify(results, null, 2));
  console.log(`${results.filter(result => result.passed).length} browser checks passed; evidence: .review-output/`);
} finally {
  await browser?.close();
  server.kill();
}
