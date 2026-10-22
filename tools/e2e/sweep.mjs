// Opens every app/screen and captures it for visual verification.
import { launch } from './lib.mjs';
const { browser, page, errors } = await launch();
const U = 'http://127.0.0.1:4173/'; let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
const shot = (n) => page.screenshot({ path: `shots/sweep/${n}.png` });
await page.goto(U); await page.evaluate(() => { sessionStorage.clear(); localStorage.clear(); });
await page.goto(U); await page.waitForSelector('.warn-dialog'); await shot('00-warning'); await page.waitForTimeout(1200);
await page.click('text=Start CyberDesk'); await page.waitForSelector('.screen.boot'); await page.waitForTimeout(1800); await shot('01-boot');
await page.keyboard.press('Escape'); await page.waitForSelector('.desktop'); await page.waitForTimeout(900); await shot('02-desktop');
// start menu + calendar
await page.click('.startbtn, button:has-text("Start")'); await page.waitForSelector('.startmenu'); await shot('03-startmenu'); await page.keyboard.press('Escape'); await page.click('.desktop', { position: { x: 600, y: 300 } });
const clock = page.locator('.clock').first(); if (await clock.count()) { await clock.click(); await page.waitForTimeout(300); await shot('04-calendar'); await page.keyboard.press('Escape'); await page.click('.desktop', { position: { x: 600, y: 300 } }); }
// desktop context menu
await page.click('.desktop', { button: 'right', position: { x: 500, y: 250 } }); await page.waitForTimeout(200); await shot('05-desktop-ctx'); await page.keyboard.press('Escape'); await page.click('.desktop', { position: { x: 600, y: 300 } });
const open = async (label, title, name, keep) => { await page.dblclick(`.dicon:has-text("${label}")`); await page.waitForSelector(`section[aria-label="${title}"]`); await page.waitForTimeout(700); await shot(name); if (!keep) { await page.click(`section[aria-label="${title}"] .wbtn[aria-label=Close]`); await page.waitForTimeout(350); } };
await open('Files', 'Files', '06-files');
await open('Notes', 'Notes', '07-notes');
await open('System Log', 'System Log', '08-syslog');
await open('Downloads', 'Download Manager', '09-downloads');
await open('Help', 'CyberDesk Help', '10-help');
await open('Security', 'Security Center', '12-security');
// browser pages
await page.dblclick('.dicon:has-text("CyberSurf")'); await page.waitForSelector('.addr'); await page.waitForTimeout(600); await shot('13-browser-newtab');
let i = 14;
for (const [u, n] of [['portal.eastbrook.example', 'portal'], ['https://eastbrook.secure-login.example/auth?next=portal', 'phish-login'], ['https://nimbusdrlve.example/login?r=alert', 'phish-cloud-login'], ['https://parcelpoint-delivery.example/pay?ref=PP4821', 'payment'], ['https://parcelpoint.example/track?id=PP4821', 'tracking'], ['https://help.eastbrook.example/', 'support'], ['https://careers.eastbrook.example/', 'job'], ['https://files.nimbusdrive.example/', 'cloud'], ['https://northvale.example/statements', 'bank'], ['https://bit.example/x7Qa2', 'shortener'], ['https://nothing.example/zzz', 'error']]) {
  await page.fill('.addr', u); await page.keyboard.press('Enter'); await page.waitForTimeout(3800); await shot(`${i++}-browser-${n}`);
}
await page.screenshot({ path: 'shots/sweep/99-final.png' });
console.log('ERRORS', errors, 'FAILS', fails); await browser.close();
