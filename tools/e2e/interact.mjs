import { launch } from './lib.mjs';
const { browser, page, errors } = await launch(); let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
const U = 'http://127.0.0.1:4173/';
await page.goto(U); await page.evaluate(() => { sessionStorage.clear(); localStorage.clear(); });
await page.goto(U); await page.waitForSelector('.warn-dialog'); await page.waitForTimeout(1200);
await page.click('text=Start CyberDesk'); await page.waitForSelector('.screen.boot'); await page.keyboard.press('Escape'); await page.waitForSelector('.desktop'); await page.waitForTimeout(700);
await page.dblclick('.dicon:has-text("Notes")'); const w = page.locator('section[aria-label="Notes"]'); await w.waitFor(); await page.waitForTimeout(500);
const b0 = await w.boundingBox();
// drag by title bar
await page.mouse.move(b0.x + 120, b0.y + 12); await page.mouse.down(); await page.mouse.move(b0.x + 220, b0.y + 82, { steps: 6 }); await page.mouse.up();
const b1 = await w.boundingBox(); ok(Math.abs(b1.x - b0.x - 100) < 6 && Math.abs(b1.y - b0.y - 70) < 6, `drag moved window (${b1.x - b0.x},${b1.y - b0.y})`);
// resize via bottom-right handle
const h = page.locator('section[aria-label="Notes"] .rz-se').first();
const hb = await h.boundingBox(); await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2); await page.mouse.down(); await page.mouse.move(hb.x + 90, hb.y + 70, { steps: 6 }); await page.mouse.up();
const b2 = await w.boundingBox(); ok(b2.width > b1.width + 60 && b2.height > b1.height + 40, `resize grew window (${b2.width - b1.width},${b2.height - b1.height})`);
// busy cursor while browser loads
await page.dblclick('.dicon:has-text("CyberSurf")'); await page.waitForSelector('.addr'); await page.fill('.addr', 'portal.eastbrook.example'); await page.keyboard.press('Enter');
await page.waitForTimeout(250); ok(await page.locator('.cyberdesk.busy').count() === 1, 'busy class set while loading');
await page.waitForTimeout(5000); ok(await page.locator('.cyberdesk.busy').count() === 0, 'busy class cleared after load');
console.log('ERRORS', errors, 'FAILS', fails); await browser.close();
