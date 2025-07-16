import { chromium } from 'playwright';

export async function scanDOM(url: string): Promise<string> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    //get all page from DOM
    const dom = await page.content();
    return dom;
  } catch (err) {
    console.error("❌ Failed to scan page:", err);
    return '';
  } finally {
    await browser.close();
  }
}
