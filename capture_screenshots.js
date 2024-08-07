const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");

// Load URLs from JSON file
const urls = JSON.parse(fs.readFileSync("urls.json"));

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const item of urls.urls) {
    console.log(item);
    const { url, prefix } = item;
    const dir = `screenshots/${prefix}`;

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await page.goto(url, { waitUntil: "networkidle2" });

    // Capture mobile screenshot
    await page.setViewport({ width: 375, height: 812 });
    await page.screenshot({
      path: path.join(dir, "mobile.png"),
      fullPage: true
    });

    // Capture desktop screenshot if the URL does not contain '/m/'
    if (!url.includes("/m/")) {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.screenshot({
        path: path.join(dir, "desktop.png"),
        fullPage: true
      });
    }
  }

  await browser.close();
})();
