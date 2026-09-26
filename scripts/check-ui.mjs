import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

const errors = [];
page.on("console", (msg) => {
  if (msg.type() !== "error") return;
  const text = msg.text();
  if (text.includes("Download the React DevTools")) return;
  errors.push(text.slice(0, 3000));
});
page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));

async function go(url) {
  await page.goto(`http://localhost:3000${url}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
}

// Chargements initiaux
for (const p of ["/", "/login", "/?q=azul", "/?letter=A", "/mot/6ab6a67257f9cb71821d6c2a", "/mot/inexistant"]) {
  await go(p);
}

// Login via l'interface
await go("/login");
await page.fill("#username", "admin");
await page.fill("#password", "Admin123!");
await page.click('button[type="submit"]');
await page.waitForURL("**/admin", { timeout: 10000 }).catch(() => {});

// Naviguations SPA (sans rechargement)
await page.click('a[href="/admin/nouveau"]');
await page.waitForTimeout(500);
await page.click('a[href="/admin"]');
await page.waitForTimeout(500);

// Page d'édition
const firstEdit = page.locator('a[href^="/admin/"]').first();
await firstEdit.click();
await page.waitForTimeout(600);

// Retour accueil + clic sur une carte + bouton écouter
await page.click('header a[href="/"]');
await page.waitForTimeout(600);
const card = page.locator('a[href^="/mot/"]').first();
await card.click();
await page.waitForTimeout(600);
const speak = page.locator('button[aria-label^="Écouter"]').first();
if (await speak.count()) {
  await speak.click();
  await page.waitForTimeout(600);
}

// Soumission du formulaire de recherche
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.fill('input[name="q"]', "azul");
await page.press('input[name="q"]', "Enter");
await page.waitForTimeout(800);

console.log("URL finale:", page.url());
console.log("=== ERREURS CONSOLE ===");
if (!errors.length) console.log("aucune");
errors.forEach((e, i) => console.log(`--- ${i + 1} ---\n${e}\n`));

await browser.close();
