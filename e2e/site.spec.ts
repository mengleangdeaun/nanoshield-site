import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { locales, paths } from "../content/site";

const routes = locales.flatMap((l) => paths.map((p) => `/${l}${p}`));

const bg = (page: import("@playwright/test").Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const DARK_BG = "rgb(10, 10, 11)";
const LIGHT_BG = "rgb(255, 255, 255)";

for (const scheme of ["dark", "light"] as const)
for (const route of routes) {
  test(`${route} [${scheme}]: SEO head, JSON-LD, a11y, no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    await page.emulateMedia({ colorScheme: scheme });
    const res = await page.goto(route);
    // Dark is the default whatever the device prefers.
    expect(await bg(page)).toBe(DARK_BG);
    expect(res?.status()).toBe(200);
    const headers = res!.headers();
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["strict-transport-security"]).toContain("max-age=");
    expect(headers["x-content-type-options"]).toBe("nosniff");

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://nanoshield-cambodia.com${route}`);
    for (const l of [...locales, "x-default"]) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveCount(1);
    }
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);

    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.length).toBeGreaterThan(0);
    for (const block of ld) expect(() => JSON.parse(block)).not.toThrow();

    // Render off-screen sections (content-visibility: auto) so axe can measure their contrast.
    await page.addStyleTag({ content: "main > section { content-visibility: visible !important }" });
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("root redirects by Accept-Language, first supported language wins", async ({ request }) => {
  const go = (al: string) => request.get("/", { headers: { "accept-language": al }, maxRedirects: 0 });
  expect((await go("km-KH,km;q=0.9")).headers().location).toMatch(/\/km$/);
  expect((await go("en-US,km;q=0.9")).headers().location).toMatch(/\/en$/);
  expect((await go("fr-FR,de;q=0.9")).headers().location).toMatch(/\/en$/);
});

test("unknown locale, page and service return 404", async ({ request }) => {
  for (const p of ["/xx", "/en/nope", "/en/services/nope"]) expect((await request.get(p)).status()).toBe(404);
});

test("verification file, llms.txt, sitemap and robots are served", async ({ request }) => {
  expect(await (await request.get("/google066b18306d412845.html")).text()).toContain("google-site-verification");
  expect((await request.get("/llms.txt")).status()).toBe(200);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap.match(/<url>/g)).toHaveLength(routes.length);
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap: https://nanoshield-cambodia.com/sitemap.xml");
});

test("FAQ accordion opens one answer at a time", async ({ page }) => {
  await page.goto("/en/faq");
  const items = page.locator("details");
  await expect(items.first()).toHaveAttribute("open", "");
  await items.nth(2).locator("summary").click();
  await expect(items.nth(2)).toHaveAttribute("open", "");
  await expect(items.first()).not.toHaveAttribute("open");
});

test("mobile menu opens and closes after navigating", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/en");
  // Open the menu on each page in turn: after client navigation the previous route stays mounted
  // (hidden), so each button must open its own page's popover.
  for (const [link, url] of [["Packages", /\/en\/packages$/], ["FAQ", /\/en\/faq$/]] as const) {
    const button = page.getByRole("button", { name: "Menu" }).locator("visible=true");
    const menu = page.locator(`[id="${await button.getAttribute("popovertarget")}"]`);
    await expect(menu).toBeHidden();
    await button.click();
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: link }).click();
    await expect(page).toHaveURL(url);
    await expect(menu).toBeHidden();
  }
});

test("language switch keeps the current page", async ({ page }) => {
  await page.goto("/en/services/steam-wash");
  await page.getByRole("link", { name: /Khmer/ }).click();
  await expect(page).toHaveURL(/\/km\/services\/steam-wash$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "km");
});

// Launch gate: fails while the design's placeholders remain. Remove `.fixme` once the business supplies content.
test.fixme("no placeholder content left", async ({ request }) => {
  for (const r of routes) {
    const html = await (await request.get(r)).text();
    expect(html, r).not.toMatch(/\[(PRICE|HOURS|INTERVAL|X|GUARANTEE TERMS|WARRANTY TERMS)\]|PHOTO ·|IMAGE ·/);
  }
});

test("theme toggle flips, persists across reload and client navigation", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/en");
  expect(await bg(page)).toBe(DARK_BG);

  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await bg(page)).toBe(LIGHT_BG);
  await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();

  await page.reload();
  expect(await bg(page)).toBe(LIGHT_BG);

  await page.getByRole("link", { name: "FAQ" }).first().click();
  await expect(page).toHaveURL(/\/en\/faq$/);
  expect(await bg(page)).toBe(LIGHT_BG);

  await page.getByRole("button", { name: "Switch to dark mode" }).locator("visible=true").click();
  expect(await bg(page)).toBe(DARK_BG);
});

test("stored theme applies before hydration (no flash)", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  // Block the JS bundles: the theme must come from the inline head script alone.
  await page.route(/\/_next\/static\/.*\.js$/, (r) => r.abort());
  await page.goto("/km", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await bg(page)).toBe(LIGHT_BG);
});

test("theme toggle is reachable on mobile; light-mode device still starts dark", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/km");
  expect(await bg(page)).toBe(DARK_BG);
  const toggle = page.getByRole("button", { name: "ប្តូរទៅផ្ទៃពណ៌ភ្លឺ" });
  await expect(toggle).toBeInViewport();
  await toggle.click();
  expect(await bg(page)).toBe(LIGHT_BG);
  // Header must not overflow the phone width.
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

test("visit: showroom photo links to Google Maps (EN + KM)", async ({ page }) => {
  for (const lang of ["en", "km"]) {
    await page.goto(`/${lang}`);
    const link = page.locator('#visit a[href^="https://maps.app.goo.gl"]:has(img)');
    await expect(link.locator('img[src*="showroom"]')).toHaveCount(1);
    await expect(page.locator("#visit")).not.toContainText("MAP ·");
  }
});

test("footer: circle logo and phone link (EN + KM)", async ({ page }) => {
  for (const lang of ["en", "km"]) {
    await page.goto(`/${lang}`);
    const footer = page.locator("footer");
    await expect(footer.locator('a[href="tel:+855762222188"]')).toContainText("076 2222 188");
    await expect(footer.locator('img[src*="nanoshield-logo-512"]')).toHaveCount(1);
  }
});

test("benefits grid: decorative logo arc fills the 8th block on desktop, hidden on phones", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  const cells = page.locator("#benefits ul > li");
  await expect(cells).toHaveCount(8);
  const deco = cells.nth(7);
  await expect(deco).toHaveAttribute("aria-hidden", "true");
  await deco.scrollIntoViewIfNeeded();
  await expect(deco).toBeVisible();
  // Same row as cards 5–7, and the same height: no gap left in the grid.
  const [a, b] = await Promise.all([cells.nth(6).boundingBox(), deco.boundingBox()]);
  expect(Math.round(b!.y)).toBe(Math.round(a!.y));
  expect(Math.round(b!.height)).toBe(Math.round(a!.height));

  await page.setViewportSize({ width: 375, height: 800 });
  await expect(deco).toBeHidden();
});

test("coating section shows the paint cross-section diagram (EN + KM)", async ({ page }) => {
  for (const [lang, name] of [["en", /Car paint cross-section/], ["km", /ផ្ទាំងកាត់ស្រទាប់ថ្នាំរថយន្ត/]] as const) {
    await page.goto(`/${lang}`);
    const diagram = page.locator("#coating figure").getByRole("img", { name });
    await expect(diagram).toHaveCount(1);
    await expect(page.locator("#coating")).not.toContainText("PHOTO ·");
  }
});

test("technology section: SiO₂ → Graphene → Nanotube progression (EN + KM)", async ({ page }) => {
  for (const lang of ["en", "km"]) {
    await page.goto(`/${lang}`);
    const tiles = page.locator("#technology ol > li");
    await expect(tiles).toHaveCount(3);
    await expect(tiles.locator("h3")).toHaveText(["SiO₂", "Graphene", "Nanotube"]);
    await expect(tiles.nth(1)).toContainText("9H");
    await expect(tiles.nth(2)).toContainText("10H");
  }
});

test("hero: real photo is preloaded and loaded; hero stays dark in light mode", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  await page.goto("/en");
  const photo = page.locator("#top img[alt*='Nanoshield showroom']");
  await expect(photo).toBeVisible();
  // LCP image: eager + fetchpriority=high on the <img> (Next 16 docs prefer this over `preload`).
  await expect(photo).toHaveAttribute("fetchpriority", "high");
  await expect(photo).not.toHaveAttribute("loading", "lazy");
  await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(page.locator("h1")).toHaveCount(1);
  expect(await page.locator("#top h1").evaluate((el) => getComputedStyle(el).color)).toBe("rgb(255, 255, 255)");
});
