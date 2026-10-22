import { chromium } from 'playwright-core';
import fs from 'fs';
const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium/chrome-linux/chrome'].find((p) => fs.existsSync(p));
export async function launch(w = 1280, h = 800) {
  const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage(); const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
  page.on('requestfailed', (r) => { const t = r.failure()?.errorText || ''; if (!/ERR_ABORTED/.test(t)) errors.push('REQFAIL ' + t + ' ' + r.url()); });
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`); });
  return { browser, ctx, page, errors };
}
export async function toDesktop(page, base = 'http://127.0.0.1:4173/') {
  await page.goto(base); await page.waitForSelector('.warn-dialog'); await page.waitForTimeout(1300);
  await page.click('text=Start CyberDesk'); await page.waitForSelector('.screen.boot');
  return page;
}
