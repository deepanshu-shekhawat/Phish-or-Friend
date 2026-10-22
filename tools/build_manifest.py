"""Builds the asset manifest (file -> inventory row -> component) and verifies every file exists.
Writes public/assets/cyberdesk/manifest.json and docs/ASSET_MANIFEST.md."""
import json, os, glob
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUB = os.path.join(R, 'public')
files = json.load(open(os.path.join(PUB, 'assets/cyberdesk/manifest.files.json')))
for a in json.load(open(os.path.join(PUB, 'assets/cyberdesk/audio/audio.json'))):
    for f in a['files']: files.append(dict(file=f, rows=[92], grid='', component='engine/audio.js', note=a['trigger']))
C = 'src/cyberdesk/'
# row -> (components, verification evidence)
COMP = {
 4: ([C+'os/Boot.jsx#BootScreen'], 'sweep 01-boot'), 5: ([C+'os/Boot.jsx', C+'styles/anim.css'], 'sweep 01-boot'),
 6: ([C+'styles/anim.css (cd-blink)'], 'sweep 01-boot'), 9: ([C+'os/Boot.jsx#WarningScreen'], 'sweep 00-warning'),
 10: ([C+'os/Boot.jsx', C+'styles/anim.css'], 'flow/sweep: boot -> desktop reveal'), 13: ([C+'os/Boot.jsx#CrtOverlay', C+'styles/anim.css (cd-flicker)'], 'CSS present; reduced-motion disables'),
 16: ([C+'os/Taskbar.jsx'], 'sweep 02-desktop'), 17: ([C+'os/Taskbar.jsx#StartMenu'], 'sweep 03-startmenu'), 18: ([C+'os/Taskbar.jsx#Tray'], 'sweep 02-desktop'),
 19: ([C+'os/Taskbar.jsx#Clock,Calendar'], 'sweep 04-calendar'), 20: ([C+'os/Desktop.jsx'], 'sweep 02-desktop'), 21: ([C+'os/Desktop.jsx#ContextMenu'], 'sweep 05-desktop-ctx'),
 24: ([C+'os/ui.jsx#DialogView'], 'sweep2 s2-18-shutdown-dialog'),
 30: ([C+'os/AppWindow.jsx', C+'styles/os.css'], 'all screenshots'), 31: ([C+'os/AppWindow.jsx (.inactive)'], 'sweep2 (stacked windows)'),
 32: ([C+'os/AppWindow.jsx'], 'all screenshots'), 34: ([C+'os/AppWindow.jsx (8 handles)'], 'CSS/handles present; drag-resize not pixel-tested'),
 35: ([C+'styles/os.css (.win box-shadow)'], 'all screenshots'), 38: ([C+'os/ui.jsx#Tip,ContextMenu'], 'flow 11-linkmenu, sweep 05'),
 39: ([C+'os/ui.jsx#DialogView'], 'flow 15,17; sweep2 s2-01,05,18'),
 40: ([C+'apps/Mail.jsx'], 'flow 10; sweep2'), 41: ([C+'apps/Mail.jsx'], 'flow 10; sweep2 s2-04'), 47: ([C+'apps/Mail.jsx'], 'flow 11-linkmenu'),
 48: ([C+'os/Notifications.jsx#Toasts'], 'sweep2 s2-04 (Sam Rivera toast)'), 49: ([C+'apps/Mail.jsx'], 'sweep2 s2-04 (filter)'),
 53: ([C+'apps/Browser.jsx#NewTab'], 'sweep 13'), 54: ([C+'apps/pages/Pages.jsx#Portal'], 'sweep 14'), 55: ([C+'apps/pages/Pages.jsx#Cloud'], 'sweep 21'),
 56: ([C+'apps/pages/Pages.jsx#Login x5'], 'sweep 15, 16'), 57: ([C+'apps/pages/Pages.jsx#Payment,Tracking,Support,Job,Invoice,Bank'], 'sweep 17-20, 22'),
 58: ([C+'apps/pages/Pages.jsx#ErrorPage,Warning,Blocked'], 'sweep 16, 23, 24'), 59: ([C+'apps/Downloads.jsx'], 'sweep 09; mail attach flow'),
 60: ([C+'apps/LinkInspector.jsx'], 'flow 12'), 61: ([C+'apps/LinkInspector.jsx'], 'flow 12'), 62: ([C+'apps/LinkInspector.jsx#Chain'], 'flow 13 (after width fix)'),
 63: ([C+'apps/LinkInspector.jsx'], 'flow 15-cert (captured, dialog opens)'), 65: ([C+'apps/LinkInspector.jsx'], 'flow 14-notes'),
 66: ([C+'apps/SecurityCenter.jsx'], 'sweep 12'), 67: ([C+'apps/SecurityCenter.jsx'], 'flow 16'), 69: ([C+'apps/SecurityCenter.jsx'], 'flow report submitted dialog'),
 70: ([C+'apps/SecurityCenter.jsx'], 'flow 18'), 71: ([C+'apps/Debrief.jsx'], 'flow 19'),
 72: ([C+'apps/Files.jsx'], 'sweep 06'), 74: ([C+'apps/Files.jsx'], 'sweep2 s2-01'), 75: ([C+'apps/Notes.jsx'], 'sweep 07; sweep2 s2-02'),
 76: ([C+'apps/Downloads.jsx'], 'sweep 09'), 77: ([C+'apps/Files.jsx'], 'sweep2 s2-03, s2-05'),
 78: ([C+'os/Notifications.jsx'], 'all screenshots (toasts)'), 79: ([C+'os/Notifications.jsx#XpCounter,XpMini'], 'sweep2 s2-12, tray'),
 82: ([C+'os/Desktop.jsx#MissionCard'], 'sweep 04'), 83: ([C+'apps/Debrief.jsx#Summary'], 'sweep2 s2-14'),
 93: ([C+'styles/os.css', C+'CyberDesk.jsx (data-motion/contrast/touch)'], 'sweep2 s2-10, s2-11'), 94: ([C+'apps/Utilities.jsx'], 'sweep 10; sweep2 s2-07..13'),
}
# rows whose files give verification by review of contact sheets
FILEROWS = {}
for e in files:
    for r in e['rows']: FILEROWS.setdefault(r, []).append(e)
missing = []
for e in files:
    if not os.path.exists(os.path.join(PUB, e['file'])): missing.append(e['file'])
out = dict(generated_by='tools/build_manifest.py', file_count=len(files), missing=missing, files=files,
           components={str(k): dict(components=v[0], verified_by=v[1]) for k, v in COMP.items()})
json.dump(out, open(os.path.join(PUB, 'assets/cyberdesk/manifest.json'), 'w'), indent=1)
os.makedirs(os.path.join(R, 'docs'), exist_ok=True)
L = ['# CyberDesk asset manifest', '', f'{len(files)} files registered; missing on disk: {len(missing)}.', '', '## Inventory row -> components', '', '| Row | Components | Verified by |', '|---|---|---|']
for k in sorted(COMP): L.append(f'| {k} | {"<br>".join(COMP[k][0])} | {COMP[k][1]} |')
L += ['', '## Files', '', '| File | Row(s) | Grid | Component | Note |', '|---|---|---|---|---|']
for e in sorted(files, key=lambda x: x['file']): L.append(f"| {e['file']} | {','.join(map(str, e['rows']))} | {e.get('grid','')} | {e['component']} | {e.get('note','')} |")
open(os.path.join(R, 'docs/ASSET_MANIFEST.md'), 'w').write('\n'.join(L) + '\n')
print('files', len(files), 'missing', missing, 'file rows', len(FILEROWS), 'component rows', len(COMP))
cov = set(FILEROWS) | set(COMP); print('uncovered rows:', sorted(set(range(1, 95)) - cov))
