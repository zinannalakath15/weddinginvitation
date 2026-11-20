import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { chromium } from "playwright-core";

const output = process.env.SCREENSHOT_DIR ? resolve(process.env.SCREENSHOT_DIR) : join(process.cwd(), "reference");
const browserPath = process.env.CHROMIUM_EXECUTABLE ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const url = process.env.INVITATION_URL ?? "https://invytor.com/mushraf-sharfina";
const browser = await chromium.launch({ executablePath: browserPath, headless: true });
const report = {};

await mkdir(output, { recursive: true });

for (const viewport of [{ name: "mobile", width: 390, height: 844 }, { name: "desktop", width: 1440, height: 900 }]) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: "no-preference" });
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.getByText("Tap to Open", { exact: true }).waitFor({ state: "visible" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(3800);
  report[viewport.name] = {
    viewport: { width: viewport.width, height: viewport.height },
    cover: await page.evaluate(() => ({
      background: getComputedStyle(document.body).backgroundColor,
      labels: [...document.querySelectorAll("h1,p")].map((element) => ({
        text: element.textContent?.trim(),
        font: getComputedStyle(element).fontFamily,
        size: getComputedStyle(element).fontSize,
        color: getComputedStyle(element).color,
        letterSpacing: getComputedStyle(element).letterSpacing,
        opacity: getComputedStyle(element).opacity,
      })).filter((entry) => entry.text && !entry.text.startsWith("{") && !entry.text.startsWith("self.__next_f")),
      audio: [...document.querySelectorAll("audio")].map((audio) => ({ paused: audio.paused, muted: audio.muted, src: audio.currentSrc })),
      images: [...document.querySelectorAll(".cover .artwork img")].map((image) => ({
        src: image.currentSrc || image.src,
        loaded: image.complete,
        naturalSize: [image.naturalWidth, image.naturalHeight],
        styles: { display: getComputedStyle(image).display, opacity: getComputedStyle(image).opacity, visibility: getComputedStyle(image).visibility, rect: image.getBoundingClientRect().toJSON() },
      })),
    })),
  };
  await page.screenshot({ path: join(output, `cover-${viewport.name}.png`) });
  const openButton = page.getByRole("button", { name: /tap to open/i });
  if (await openButton.count()) {
    await openButton.click();
  } else {
    await page.getByText("Tap to Open", { exact: true }).click();
  }
  await page.getByText("With great pleasure", { exact: true }).waitFor({ state: "visible" });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: join(output, `opened-${viewport.name}.png`) });
  await page.screenshot({ path: join(output, `opened-${viewport.name}-full.png`), fullPage: true });
  report[viewport.name].opened = await page.evaluate(() => ({
    scrollHeight: document.body.scrollHeight,
    orderedPageText: document.body.innerText.split("\n").map((line) => line.trim()).filter(Boolean),
    links: [...document.querySelectorAll("a")].map((link) => ({ text: link.textContent?.trim(), href: link.href })),
    audio: [...document.querySelectorAll("audio")].map((audio) => ({ paused: audio.paused, muted: audio.muted, src: audio.currentSrc })),
    buttons: [...document.querySelectorAll("button")].map((button) => ({ text: button.innerText.trim(), label: button.getAttribute("aria-label") })),
  }));
  await page.close();
}

await writeFile(join(output, "inspection.json"), `${JSON.stringify(report, null, 2)}\n`);
await browser.close();
