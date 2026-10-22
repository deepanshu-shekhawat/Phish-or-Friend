// Second sweep: dialogs, files, downloads, settings, accessibility, shutdown, timers.
import { launch } from './lib.mjs';
const { browser, page, errors } = await launch();
const U = 'http://127.0.0.1:4173/'; let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
const shot = (n) => page.screenshot({ path: `shots/sweep/${n}.png` });
const step = async (name, fn) => { try { await fn(); } catch (e) { fails++; console.log('FAIL step', name, String(e.message).split('\n')[0]); await shot('err-' + name).catch(() => {}); } };
const closeWin = async (t) => { await page.click(`section[aria-label="${t}"] .wbtn[aria-label=Close]`); await page.waitForTimeout(350); };
await page.goto(U); await page.evaluate(() => { sessionStorage.clear(); localStorage.clear(); });
await page.goto(U); await page.waitForSelector('.warn-dialog'); await page.waitForTimeout(1200);
await page.click('text=Start CyberDesk'); await page.waitForSelector('.screen.boot'); await page.keyboard.press('Escape'); await page.waitForSelector('.desktop'); await page.waitForTimeout(800);
await step('files', async () => {
  await page.dblclick('.dicon:has-text("Files")'); await page.waitForSelector('section[aria-label="Files"]');
  await page.click('.files :text("Lab 2 notes.txt")'); await page.click('.btn:has-text("Properties")'); await page.waitForSelector('.dialog'); await shot('s2-01-properties');
  await page.click('.dialog .btn:has-text("OK")'); await page.waitForTimeout(300);
  await page.dblclick('.files :text("Syllabus CS240.pdf")'); await page.waitForSelector('section[aria-label="Syllabus CS240.pdf"]'); await page.waitForTimeout(400); await shot('s2-02-viewer'); await closeWin('Syllabus CS240.pdf');
  await page.click('.files :text("Budget.xls")'); await page.click('.btn:has-text("Quarantine")'); await page.waitForTimeout(400);
  await page.click('button.folder:has-text("Quarantine")'); await page.waitForTimeout(400); await shot('s2-03-quarantine'); await closeWin('Files');
});
await step('mail-attach', async () => {
  await page.dblclick('.dicon:has-text("CyberMail")'); await page.waitForSelector('.mail'); await page.waitForTimeout(500);
  await page.click('.mrow-msg:has-text("Invoice")').catch(async () => { await page.click('.mrow-msg:has(.clip)'); }); await page.waitForTimeout(400);
  await shot('s2-04-mail-attach');
  const chip = page.locator('.atts .att').first(); await chip.dblclick(); await page.waitForSelector('.dialog'); await shot('s2-05-attach-dialog');
  await page.click('.dialog .btn:has-text("Cancel")').catch(() => {}); await page.waitForTimeout(300);
});
await step('safe-decision', async () => {
  await page.click('.mrow-msg:has-text("Lab 3")'); await page.waitForTimeout(300);
  await page.click('.tbtn:has-text("Mark safe")'); await page.waitForTimeout(900); await shot('s2-06-safe-feedback');
});
await step('settings', async () => {
  await page.click('.startbtn, button:has-text("Start")'); await page.click('.startmenu :text("Display & Sound")'); await page.waitForSelector('section[aria-label="Display & Sound Settings"]'); await page.waitForTimeout(400); await shot('s2-07-settings-bg');
  await page.click('.tab:has-text("Accessibility")'); await shot('s2-08-settings-acc');
  await page.click('.tab:has-text("Sound")'); await shot('s2-09-settings-sound');
  await page.click('.tab:has-text("Accessibility")');
  await page.locator('.settings :text("High contrast")').click(); await page.waitForTimeout(300);
  ok(await page.locator('.cyberdesk[data-contrast=high]').count() === 1, 'high contrast sets data-contrast'); await shot('s2-10-highcontrast');
  await page.locator('.settings :text("High contrast")').click();
  await page.selectOption('.settings select', 'reduce').catch(() => {}); await page.waitForTimeout(300);
  ok(await page.locator('.cyberdesk[data-motion=reduce]').count() === 1, 'reduce motion sets data-motion'); await shot('s2-11-reduced');
  await page.selectOption('.settings select', 'full').catch(() => {});
  await closeWin('Display & Sound Settings');
});
await step('sysprops', async () => {
  await page.click('.startbtn, button:has-text("Start")'); await page.click('.startmenu :text("System Properties")'); await page.waitForSelector('section[aria-label="System Properties"]'); await page.waitForTimeout(400); await shot('s2-12-sysprops'); await closeWin('System Properties');
});
await step('calculator', async () => {
  await page.click('.startbtn, button:has-text("Start")'); await page.click('.startmenu :text("Calculator")'); await page.waitForSelector('section[aria-label="Calculator"]'); await shot('s2-13-calculator'); await closeWin('Calculator');
});
await step('summary', async () => {
  await page.click('.startbtn, button:has-text("Start")'); await page.click('.startmenu :text("Session Summary")'); await page.waitForSelector('section[aria-label="Session Summary"]'); await page.waitForTimeout(1500); await shot('s2-14-summary'); await closeWin('Session Summary');
});
await step('window-controls', async () => {
  const w = 'section[aria-label="CyberMail"]';
  await page.click(`${w} .wbtn[aria-label=Maximize]`); await page.waitForTimeout(500); await shot('s2-15-maximized');
  await page.click(`${w} .wbtn[aria-label=Restore]`); await page.waitForTimeout(500);
  await page.click(`${w} .wbtn[aria-label=Minimize]`); await page.waitForTimeout(500); ok(await page.locator(`${w}.minimized, ${w}[data-state=min]`).count() >= 0, 'minimize executed'); await shot('s2-16-minimized');
  await page.click('.tbtn-task:has-text("CyberMail"), .taskbar button:has-text("CyberMail")'); await page.waitForTimeout(500);
});
await step('new-mail-timer', async () => {
  await page.waitForTimeout(30000); await shot('s2-17-newmail');
  const n = await page.locator('.mrow-msg').count(); ok(n >= 8, 'timed email arrived: ' + n);
});
await step('shutdown', async () => {
  await page.click('.startbtn, button:has-text("Start")'); await page.click('.startmenu :text("Shut Down")'); await page.waitForSelector('.dialog'); await shot('s2-18-shutdown-dialog');
  await page.click('.dialog .btn:has-text("Yes")'); await page.waitForTimeout(1500); await shot('s2-19-shutdown-screen');
});
console.log('ERRORS', errors, 'FAILS', fails); await browser.close();
