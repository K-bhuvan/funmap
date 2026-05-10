const { chromium } = require("../frontend/node_modules/playwright");

function seedLocalStorageScript() {
  return () => {
    const now = new Date().toISOString();
    localStorage.setItem(
      "funmap.profile.v1",
      JSON.stringify({
        version: 1,
        activities: ["Walk", "Coffee", "Street food", "Viewpoint", "Dessert"],
        afterWorkTime: "60-90",
        weekendTime: "90-150",
        driveTolerance: "20",
        createdAt: now,
        updatedAt: now,
      }),
    );
    localStorage.setItem(
      "funmap.zipLocation.v1",
      JSON.stringify({
        zip: "75081",
        lat: 32.9483,
        lng: -96.7299,
        savedAt: now,
      }),
    );
  };
}

async function newPage() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(seedLocalStorageScript());
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  return { browser, page };
}

async function captureHomeAndDetails() {
  const { browser, page } = await newPage();
  await page.screenshot({ path: "docs/screenshots/funmap-home.png", fullPage: false });

  const detailsBtn = page.locator("button").filter({ hasText: "Details" }).first();
  await detailsBtn.waitFor({ timeout: 20000 });
  await detailsBtn.click({ force: true });
  await page.getByText("Place Details").first().waitFor({ timeout: 10000 });
  await page.waitForTimeout(450);
  await page.screenshot({ path: "docs/screenshots/funmap-place-details.png", fullPage: false });
  await browser.close();
}

async function captureMap() {
  const { browser, page } = await newPage();
  await page.getByRole("button", { name: "Map View" }).click({ force: true });
  await page.getByText("Map").first().waitFor({ timeout: 10000 });
  await page.waitForTimeout(650);
  await page.screenshot({ path: "docs/screenshots/funmap-map-view.png", fullPage: false });
  await browser.close();
}

async function captureWishlistAndProfile() {
  const { browser, page } = await newPage();

  const firstHeart = page.locator('button[aria-label="Add to wishlist"]').first();
  if (await firstHeart.count()) {
    await firstHeart.click({ force: true });
    await page.waitForTimeout(250);
  }

  const navButtons = page.locator('nav[aria-label="Primary"] button');
  await navButtons.nth(1).click({ force: true });
  await page.waitForTimeout(700);
  await page.screenshot({ path: "docs/screenshots/funmap-wishlist.png", fullPage: false });

  await navButtons.nth(2).click({ force: true });
  await page.waitForTimeout(700);
  await page.screenshot({ path: "docs/screenshots/funmap-profile.png", fullPage: false });
  await browser.close();
}

async function main() {
  await captureHomeAndDetails();
  await captureMap();
  await captureWishlistAndProfile();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

