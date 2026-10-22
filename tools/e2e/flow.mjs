import { launch } from './lib.mjs';
const { browser, page, errors } = await launch();
const log = (...a) => console.log(...a);
let fails = 0; const ok = (c, m) => { if (!c) { fails++; log('FAIL', m); } else log('ok  ', m); };
await page.goto('http://127.0.0.1:4173/'); await page.evaluate(() => { sessionStorage.clear(); localStorage.clear(); });
await page.goto('http://127.0.0.1:4173/'); await page.waitForSelector('.warn-dialog'); await page.waitForTimeout(1300);
await page.click('text=Start CyberDesk'); await page.waitForSelector('.screen.boot'); await page.keyboard.press('Escape'); await page.waitForSelector('.desktop');
await page.waitForTimeout(800);
// open mail via desktop icon double-click
await page.dblclick('.dicon:has-text("CyberMail")'); await page.waitForSelector('.mail');
ok(await page.locator('.mrow-msg').count() === 8, 'inbox shows 8 initial messages (2 arrive later)');
ok(await page.locator('.mrow-msg.unread').count() === 8, 'all initial rows unread (bold)');
await page.screenshot({ path: 'shots/10-mail.png' });
// open registrar mail
await page.click('.mrow-msg:has-text("URGENT")'); await page.waitForTimeout(300);
ok(await page.locator('.mrow-msg.unread').count() === 7, 'opening a message marks it read');
// details reveal → evidence
await page.click('text=[Details]'); await page.waitForTimeout(300);
ok((await page.textContent('.rhdr-raw')).includes('eastbrook-registrar.example'), 'details reveal real sender address');
ok(await page.locator('.toast:has-text("Evidence saved")').count() >= 1, 'evidence toast appears');
// hover link shows destination
await page.hover('.mbtn'); await page.waitForTimeout(200);
const st = await page.textContent('.statusbar .sb-main'); ok(st.includes('eastbrook.secure-login.example'), 'hover shows real destination in status bar: ' + st);
await page.waitForTimeout(900);
// right-click → inspect destination
await page.click('.mbtn', { button: 'right' }); await page.waitForSelector('.ctxmenu');
ok((await page.locator('.ctxmenu .mrow').allTextContents()).join('|').includes('Inspect Destination'), 'link context menu has Inspect Destination');
await page.screenshot({ path: 'shots/11-linkmenu.png' });
await page.click('text=Inspect Destination'); await page.waitForSelector('.inspector'); await page.waitForTimeout(3200);
ok(await page.locator('.verdict.suspicious').count() === 1, 'inspector verdict suspicious');
await page.screenshot({ path: 'shots/12-inspector.png' });
await page.click('.tab:has-text("Redirects")'); await page.waitForTimeout(600); await page.screenshot({ path: 'shots/13-redirects.png' });
await page.click('.tab:has-text("Notes")'); await page.screenshot({ path: 'shots/14-notes.png' });
await page.click('.tab:has-text("Certificate")'); await page.click('text=View certificate…'); await page.waitForSelector('.dialog'); await page.screenshot({ path: 'shots/15-cert.png' });
await page.click('.dialog .btn:has-text("OK")'); await page.waitForTimeout(400);
await page.click('section[aria-label="Link Inspector"] .wbtn[aria-label=Close]'); await page.waitForTimeout(300);
// report via mail toolbar
await page.click('.tbtn.rep'); await page.waitForSelector('.cats'); await page.screenshot({ path: 'shots/16-report-form.png' });
await page.click('.btn:has-text("Submit report")'); await page.waitForSelector('.dialog:has-text("Incomplete")'); ok(true, 'incomplete dialog on empty submit');
await page.screenshot({ path: 'shots/17-incomplete.png' });
await page.click('.dialog .btn:has-text("OK")'); await page.waitForTimeout(400);
await page.click('.cat:has-text("Credential theft")');
await page.click('.chk:has-text("Look-alike or misspelled domain")'); await page.click('.chk:has-text("Urgent or threatening language")');
await page.click('.btn:has-text("Submit report")'); await page.waitForSelector('.dialog:has-text("Report submitted")', { timeout: 5000 });
ok(true, 'report submitted dialog'); await page.click('.dialog .btn:has-text("OK")');
await page.waitForTimeout(500); await page.screenshot({ path: 'shots/18-history.png' });
await page.waitForSelector('.badge.st-resolved', { timeout: 9000 }); ok(true, 'report reaches Resolved');
await page.waitForTimeout(1200);
ok(await page.locator('.xpmini .xpn').textContent() !== '0', 'XP increased: ' + await page.locator('.xpmini .xpn').textContent());
await page.click('.btn:has-text("Debrief")'); await page.waitForSelector('.debrief'); await page.waitForTimeout(3200); await page.screenshot({ path: 'shots/19-debrief.png' });
console.log('ERRORS', JSON.stringify(errors, null, 1)); console.log('FAILS', fails);
await browser.close();
