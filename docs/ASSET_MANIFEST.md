# CyberDesk asset manifest

594 files registered; missing on disk: 0.

## Inventory row -> components

| Row | Components | Verified by |
|---|---|---|
| 4 | src/cyberdesk/os/Boot.jsx#BootScreen | sweep 01-boot |
| 5 | src/cyberdesk/os/Boot.jsx<br>src/cyberdesk/styles/anim.css | sweep 01-boot |
| 6 | src/cyberdesk/styles/anim.css (cd-blink) | sweep 01-boot |
| 9 | src/cyberdesk/os/Boot.jsx#WarningScreen | sweep 00-warning |
| 10 | src/cyberdesk/os/Boot.jsx<br>src/cyberdesk/styles/anim.css | flow/sweep: boot -> desktop reveal |
| 13 | src/cyberdesk/os/Boot.jsx#CrtOverlay<br>src/cyberdesk/styles/anim.css (cd-flicker) | CSS present; reduced-motion disables |
| 16 | src/cyberdesk/os/Taskbar.jsx | sweep 02-desktop |
| 17 | src/cyberdesk/os/Taskbar.jsx#StartMenu | sweep 03-startmenu |
| 18 | src/cyberdesk/os/Taskbar.jsx#Tray | sweep 02-desktop |
| 19 | src/cyberdesk/os/Taskbar.jsx#Clock,Calendar | sweep 04-calendar |
| 20 | src/cyberdesk/os/Desktop.jsx | sweep 02-desktop |
| 21 | src/cyberdesk/os/Desktop.jsx#ContextMenu | sweep 05-desktop-ctx |
| 24 | src/cyberdesk/os/ui.jsx#DialogView | sweep2 s2-18-shutdown-dialog |
| 30 | src/cyberdesk/os/AppWindow.jsx<br>src/cyberdesk/styles/os.css | all screenshots |
| 31 | src/cyberdesk/os/AppWindow.jsx (.inactive) | sweep2 (stacked windows) |
| 32 | src/cyberdesk/os/AppWindow.jsx | all screenshots |
| 34 | src/cyberdesk/os/AppWindow.jsx (8 handles) | CSS/handles present; drag-resize not pixel-tested |
| 35 | src/cyberdesk/styles/os.css (.win box-shadow) | all screenshots |
| 38 | src/cyberdesk/os/ui.jsx#Tip,ContextMenu | flow 11-linkmenu, sweep 05 |
| 39 | src/cyberdesk/os/ui.jsx#DialogView | flow 15,17; sweep2 s2-01,05,18 |
| 40 | src/cyberdesk/apps/Mail.jsx | flow 10; sweep2 |
| 41 | src/cyberdesk/apps/Mail.jsx | flow 10; sweep2 s2-04 |
| 47 | src/cyberdesk/apps/Mail.jsx | flow 11-linkmenu |
| 48 | src/cyberdesk/os/Notifications.jsx#Toasts | sweep2 s2-04 (Sam Rivera toast) |
| 49 | src/cyberdesk/apps/Mail.jsx | sweep2 s2-04 (filter) |
| 53 | src/cyberdesk/apps/Browser.jsx#NewTab | sweep 13 |
| 54 | src/cyberdesk/apps/pages/Pages.jsx#Portal | sweep 14 |
| 55 | src/cyberdesk/apps/pages/Pages.jsx#Cloud | sweep 21 |
| 56 | src/cyberdesk/apps/pages/Pages.jsx#Login x5 | sweep 15, 16 |
| 57 | src/cyberdesk/apps/pages/Pages.jsx#Payment,Tracking,Support,Job,Invoice,Bank | sweep 17-20, 22 |
| 58 | src/cyberdesk/apps/pages/Pages.jsx#ErrorPage,Warning,Blocked | sweep 16, 23, 24 |
| 59 | src/cyberdesk/apps/Downloads.jsx | sweep 09; mail attach flow |
| 60 | src/cyberdesk/apps/LinkInspector.jsx | flow 12 |
| 61 | src/cyberdesk/apps/LinkInspector.jsx | flow 12 |
| 62 | src/cyberdesk/apps/LinkInspector.jsx#Chain | flow 13 (after width fix) |
| 63 | src/cyberdesk/apps/LinkInspector.jsx | flow 15-cert (captured, dialog opens) |
| 65 | src/cyberdesk/apps/LinkInspector.jsx | flow 14-notes |
| 66 | src/cyberdesk/apps/SecurityCenter.jsx | sweep 12 |
| 67 | src/cyberdesk/apps/SecurityCenter.jsx | flow 16 |
| 69 | src/cyberdesk/apps/SecurityCenter.jsx | flow report submitted dialog |
| 70 | src/cyberdesk/apps/SecurityCenter.jsx | flow 18 |
| 71 | src/cyberdesk/apps/Debrief.jsx | flow 19 |
| 72 | src/cyberdesk/apps/Files.jsx | sweep 06 |
| 74 | src/cyberdesk/apps/Files.jsx | sweep2 s2-01 |
| 75 | src/cyberdesk/apps/Notes.jsx | sweep 07; sweep2 s2-02 |
| 76 | src/cyberdesk/apps/Downloads.jsx | sweep 09 |
| 77 | src/cyberdesk/apps/Files.jsx | sweep2 s2-03, s2-05 |
| 78 | src/cyberdesk/os/Notifications.jsx | all screenshots (toasts) |
| 79 | src/cyberdesk/os/Notifications.jsx#XpCounter,XpMini | sweep2 s2-12, tray |
| 82 | src/cyberdesk/os/Desktop.jsx#MissionCard | sweep 04 |
| 83 | src/cyberdesk/apps/Debrief.jsx#Summary | sweep2 s2-14 |
| 93 | src/cyberdesk/styles/os.css<br>src/cyberdesk/CyberDesk.jsx (data-motion/contrast/touch) | sweep2 s2-10, s2-11 |
| 94 | src/cyberdesk/apps/Utilities.jsx | sweep 10; sweep2 s2-07..13 |

## Files

| File | Row(s) | Grid | Component | Note |
|---|---|---|---|---|
| assets/cyberdesk/LICENSES/THIRD_PARTY.md | 89,90,91 |  | docs | attribution record |
| assets/cyberdesk/audio/achievement.ogg | 92 |  | engine/audio.js | Achievement unlocked |
| assets/cyberdesk/audio/achievement.wav | 92 |  | engine/audio.js | Achievement unlocked |
| assets/cyberdesk/audio/ambience.ogg | 92 |  | engine/audio.js | Looping CRT / room hum while desktop is shown (very quiet) |
| assets/cyberdesk/audio/ambience.wav | 92 |  | engine/audio.js | Looping CRT / room hum while desktop is shown (very quiet) |
| assets/cyberdesk/audio/click.ogg | 92 |  | engine/audio.js | Any button / icon press |
| assets/cyberdesk/audio/click.wav | 92 |  | engine/audio.js | Any button / icon press |
| assets/cyberdesk/audio/dialog-pop.ogg | 92 |  | engine/audio.js | Dialog pop-in |
| assets/cyberdesk/audio/dialog-pop.wav | 92 |  | engine/audio.js | Dialog pop-in |
| assets/cyberdesk/audio/download-done.ogg | 92 |  | engine/audio.js | Download completed |
| assets/cyberdesk/audio/download-done.wav | 92 |  | engine/audio.js | Download completed |
| assets/cyberdesk/audio/email.ogg | 92 |  | engine/audio.js | New email notification |
| assets/cyberdesk/audio/email.wav | 92 |  | engine/audio.js | New email notification |
| assets/cyberdesk/audio/error.ogg | 92 |  | engine/audio.js | Error dialog / wrong decision |
| assets/cyberdesk/audio/error.wav | 92 |  | engine/audio.js | Error dialog / wrong decision |
| assets/cyberdesk/audio/evidence.ogg | 92 |  | engine/audio.js | Evidence discovered |
| assets/cyberdesk/audio/evidence.wav | 92 |  | engine/audio.js | Evidence discovered |
| assets/cyberdesk/audio/hover.ogg | 92 |  | engine/audio.js | Menu row / icon hover (optional, quiet) |
| assets/cyberdesk/audio/hover.wav | 92 |  | engine/audio.js | Menu row / icon hover (optional, quiet) |
| assets/cyberdesk/audio/menu-open.ogg | 92 |  | engine/audio.js | Start menu / context menu opens |
| assets/cyberdesk/audio/menu-open.wav | 92 |  | engine/audio.js | Start menu / context menu opens |
| assets/cyberdesk/audio/notify.ogg | 92 |  | engine/audio.js | Generic system notification |
| assets/cyberdesk/audio/notify.wav | 92 |  | engine/audio.js | Generic system notification |
| assets/cyberdesk/audio/report.ogg | 92 |  | engine/audio.js | Report submitted |
| assets/cyberdesk/audio/report.wav | 92 |  | engine/audio.js | Report submitted |
| assets/cyberdesk/audio/shutdown.ogg | 92 |  | engine/audio.js | Shutdown confirmed |
| assets/cyberdesk/audio/shutdown.wav | 92 |  | engine/audio.js | Shutdown confirmed |
| assets/cyberdesk/audio/startup.ogg | 92 |  | engine/audio.js | Boot completes (desktop reveal) |
| assets/cyberdesk/audio/startup.wav | 92 |  | engine/audio.js | Boot completes (desktop reveal) |
| assets/cyberdesk/audio/success.ogg | 92 |  | engine/audio.js | Correct decision / task complete |
| assets/cyberdesk/audio/success.wav | 92 |  | engine/audio.js | Correct decision / task complete |
| assets/cyberdesk/audio/typing.ogg | 92 |  | engine/audio.js | Typing in editor / text field (one key) |
| assets/cyberdesk/audio/typing.wav | 92 |  | engine/audio.js | Typing in editor / text field (one key) |
| assets/cyberdesk/audio/warning.ogg | 92 |  | engine/audio.js | Warning dialog / blocked action |
| assets/cyberdesk/audio/warning.wav | 92 |  | engine/audio.js | Warning dialog / blocked action |
| assets/cyberdesk/audio/window-close.ogg | 92 |  | engine/audio.js | Window closes / minimizes |
| assets/cyberdesk/audio/window-close.wav | 92 |  | engine/audio.js | Window closes / minimizes |
| assets/cyberdesk/audio/window-open.ogg | 92 |  | engine/audio.js | Window opens |
| assets/cyberdesk/audio/window-open.wav | 92 |  | engine/audio.js | Window opens |
| assets/cyberdesk/audio/xp.ogg | 92 |  | engine/audio.js | XP counter tick (repeat while counting) |
| assets/cyberdesk/audio/xp.wav | 92 |  | engine/audio.js | XP counter tick (repeat while counting) |
| assets/cyberdesk/boot/boot-bg.png | 3 | 640x360 | BootScreen/Background | CRT boot background |
| assets/cyberdesk/boot/disk-led-off.png | 7 | 8x8@4x | DiskLed | drive activity light |
| assets/cyberdesk/boot/disk-led-off.svg | 7 | 8x8 | DiskLed | drive activity light |
| assets/cyberdesk/boot/disk-led-on.png | 7 | 8x8@4x | DiskLed | drive activity light |
| assets/cyberdesk/boot/disk-led-on.svg | 7 | 8x8 | DiskLed | drive activity light |
| assets/cyberdesk/boot/emblem-bright.png | 2 | 16x16@4x | Emblem | frame 2 highlight |
| assets/cyberdesk/boot/emblem-bright.svg | 2 | 16x16 | Emblem | frame 2 highlight |
| assets/cyberdesk/boot/emblem.png | 2 | 16x16@4x | Emblem | frame 1 / 3 |
| assets/cyberdesk/boot/emblem.svg | 2 | 16x16 | Emblem | frame 1 / 3 |
| assets/cyberdesk/boot/init/audio-check.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 3 check |
| assets/cyberdesk/boot/init/audio-check.svg | 8 | 16x16 | BootScreen/InitIcon | frame 3 check |
| assets/cyberdesk/boot/init/audio-gray.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 1 |
| assets/cyberdesk/boot/init/audio-gray.svg | 8 | 16x16 | BootScreen/InitIcon | frame 1 |
| assets/cyberdesk/boot/init/audio.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 2 colour |
| assets/cyberdesk/boot/init/audio.svg | 8 | 16x16 | BootScreen/InitIcon | frame 2 colour |
| assets/cyberdesk/boot/init/display-check.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 3 check |
| assets/cyberdesk/boot/init/display-check.svg | 8 | 16x16 | BootScreen/InitIcon | frame 3 check |
| assets/cyberdesk/boot/init/display-gray.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 1 |
| assets/cyberdesk/boot/init/display-gray.svg | 8 | 16x16 | BootScreen/InitIcon | frame 1 |
| assets/cyberdesk/boot/init/display.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 2 colour |
| assets/cyberdesk/boot/init/display.svg | 8 | 16x16 | BootScreen/InitIcon | frame 2 colour |
| assets/cyberdesk/boot/init/memory-check.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 3 check |
| assets/cyberdesk/boot/init/memory-check.svg | 8 | 16x16 | BootScreen/InitIcon | frame 3 check |
| assets/cyberdesk/boot/init/memory-gray.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 1 |
| assets/cyberdesk/boot/init/memory-gray.svg | 8 | 16x16 | BootScreen/InitIcon | frame 1 |
| assets/cyberdesk/boot/init/memory.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 2 colour |
| assets/cyberdesk/boot/init/memory.svg | 8 | 16x16 | BootScreen/InitIcon | frame 2 colour |
| assets/cyberdesk/boot/init/network-check.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 3 check |
| assets/cyberdesk/boot/init/network-check.svg | 8 | 16x16 | BootScreen/InitIcon | frame 3 check |
| assets/cyberdesk/boot/init/network-gray.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 1 |
| assets/cyberdesk/boot/init/network-gray.svg | 8 | 16x16 | BootScreen/InitIcon | frame 1 |
| assets/cyberdesk/boot/init/network.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 2 colour |
| assets/cyberdesk/boot/init/network.svg | 8 | 16x16 | BootScreen/InitIcon | frame 2 colour |
| assets/cyberdesk/boot/init/security-check.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 3 check |
| assets/cyberdesk/boot/init/security-check.svg | 8 | 16x16 | BootScreen/InitIcon | frame 3 check |
| assets/cyberdesk/boot/init/security-gray.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 1 |
| assets/cyberdesk/boot/init/security-gray.svg | 8 | 16x16 | BootScreen/InitIcon | frame 1 |
| assets/cyberdesk/boot/init/security.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 2 colour |
| assets/cyberdesk/boot/init/security.svg | 8 | 16x16 | BootScreen/InitIcon | frame 2 colour |
| assets/cyberdesk/boot/init/storage-check.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 3 check |
| assets/cyberdesk/boot/init/storage-check.svg | 8 | 16x16 | BootScreen/InitIcon | frame 3 check |
| assets/cyberdesk/boot/init/storage-gray.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 1 |
| assets/cyberdesk/boot/init/storage-gray.svg | 8 | 16x16 | BootScreen/InitIcon | frame 1 |
| assets/cyberdesk/boot/init/storage.png | 8 | 16x16@3x | BootScreen/InitIcon | frame 2 colour |
| assets/cyberdesk/boot/init/storage.svg | 8 | 16x16 | BootScreen/InitIcon | frame 2 colour |
| assets/cyberdesk/boot/logo-frame1.png | 1 | 128x88@3x | BootScreen/Logo | screen dark |
| assets/cyberdesk/boot/logo-frame1.svg | 1 | 128x88 | BootScreen/Logo | screen dark |
| assets/cyberdesk/boot/logo-frame2.png | 1 | 128x88@3x | BootScreen/Logo | blue screen |
| assets/cyberdesk/boot/logo-frame2.svg | 1 | 128x88 | BootScreen/Logo | blue screen |
| assets/cyberdesk/boot/logo-frame3.png | 1 | 128x88@3x | BootScreen/Logo | logo illuminated |
| assets/cyberdesk/boot/logo-frame3.svg | 1 | 128x88 | BootScreen/Logo | logo illuminated |
| assets/cyberdesk/boot/logo.png | 1 | 128x88@3x | BootScreen/Logo | final frame (canonical) |
| assets/cyberdesk/boot/logo.svg | 1 | 128x88 | BootScreen/Logo | final frame (canonical) |
| assets/cyberdesk/boot/scanlines-tile.png | 12,3 | 1x4 | CrtOverlay | 1x4 repeating scanline tile |
| assets/cyberdesk/boot/shutdown.png | 11 | 160x90@6x | ShutdownScreen | shutdown still (final frame) |
| assets/cyberdesk/boot/shutdown.svg | 11 | 160x90 | ShutdownScreen | shutdown still (final frame) |
| assets/cyberdesk/cursors/arrow.png | 29 | 12x18@2x | Cursors |  |
| assets/cyberdesk/cursors/arrow.svg | 29 | 12x18 | Cursors |  |
| assets/cyberdesk/cursors/busy-0.png | 29 | 14x20@2x | Cursors |  |
| assets/cyberdesk/cursors/busy-0.svg | 29 | 14x20 | Cursors |  |
| assets/cyberdesk/cursors/busy-1.png | 29 | 14x20@2x | Cursors |  |
| assets/cyberdesk/cursors/busy-1.svg | 29 | 14x20 | Cursors |  |
| assets/cyberdesk/cursors/busy-2.png | 29 | 14x20@2x | Cursors |  |
| assets/cyberdesk/cursors/busy-2.svg | 29 | 14x20 | Cursors |  |
| assets/cyberdesk/cursors/busy-3.png | 29 | 14x20@2x | Cursors |  |
| assets/cyberdesk/cursors/busy-3.svg | 29 | 14x20 | Cursors |  |
| assets/cyberdesk/cursors/crosshair.png | 29 | 17x17@2x | Cursors |  |
| assets/cyberdesk/cursors/crosshair.svg | 29 | 17x17 | Cursors |  |
| assets/cyberdesk/cursors/forbidden.png | 29 | 16x16@2x | Cursors |  |
| assets/cyberdesk/cursors/forbidden.svg | 29 | 16x16 | Cursors |  |
| assets/cyberdesk/cursors/hand.png | 29 | 18x20@2x | Cursors |  |
| assets/cyberdesk/cursors/hand.svg | 29 | 18x20 | Cursors |  |
| assets/cyberdesk/cursors/ibeam.png | 29 | 9x18@2x | Cursors |  |
| assets/cyberdesk/cursors/ibeam.svg | 29 | 9x18 | Cursors |  |
| assets/cyberdesk/cursors/resize_ew.png | 29 | 15x15@2x | Cursors |  |
| assets/cyberdesk/cursors/resize_ew.svg | 29 | 15x15 | Cursors |  |
| assets/cyberdesk/cursors/resize_nesw.png | 29 | 15x15@2x | Cursors |  |
| assets/cyberdesk/cursors/resize_nesw.svg | 29 | 15x15 | Cursors |  |
| assets/cyberdesk/cursors/resize_ns.png | 29 | 15x15@2x | Cursors |  |
| assets/cyberdesk/cursors/resize_ns.svg | 29 | 15x15 | Cursors |  |
| assets/cyberdesk/cursors/resize_nwse.png | 29 | 15x15@2x | Cursors |  |
| assets/cyberdesk/cursors/resize_nwse.svg | 29 | 15x15 | Cursors |  |
| assets/cyberdesk/data/contacts.json | 42 |  | Mail | 20 avatars |
| assets/cyberdesk/data/layouts.json | 44 |  | Mail/EmailBody | 6 body layouts (block lists rendered by EmailBody) |
| assets/cyberdesk/data/progression.json | 80,81,88 |  | Progression |  |
| assets/cyberdesk/data/signatures.json | 43 |  | Mail/EmailBody | 8 fictional signatures |
| assets/cyberdesk/desktop/recycle-empty.png | 23 | 32x32@2x | RecycleBin |  |
| assets/cyberdesk/desktop/recycle-empty.svg | 23 | 32x32 | RecycleBin |  |
| assets/cyberdesk/desktop/recycle-full.png | 23 | 32x32@2x | RecycleBin |  |
| assets/cyberdesk/desktop/recycle-full.svg | 23 | 32x32 | RecycleBin |  |
| assets/cyberdesk/desktop/shortcut-arrow.png | 22 | 16x16@4x | DesktopIcon |  |
| assets/cyberdesk/desktop/shortcut-arrow.svg | 22 | 16x16 | DesktopIcon |  |
| assets/cyberdesk/fonts/fonts.css | 89,90,91 |  | fonts.css | font-face declarations |
| assets/cyberdesk/fonts/pixelify-sans-latin-400-normal.woff | 89 |  | fonts.css | Primary UI font (Pixelify Sans) |
| assets/cyberdesk/fonts/pixelify-sans-latin-400-normal.woff2 | 89 |  | fonts.css | Primary UI font (Pixelify Sans) |
| assets/cyberdesk/fonts/press-start-2p-latin-400-normal.woff | 91 |  | fonts.css | Bitmap display font (Press Start 2P) |
| assets/cyberdesk/fonts/press-start-2p-latin-400-normal.woff2 | 91 |  | fonts.css | Bitmap display font (Press Start 2P) |
| assets/cyberdesk/fonts/vt323-latin-400-normal.woff | 90 |  | fonts.css | Monospace terminal font (VT323) |
| assets/cyberdesk/fonts/vt323-latin-400-normal.woff2 | 90 |  | fonts.css | Monospace terminal font (VT323) |
| assets/cyberdesk/icons/app/browser.png | 26 | 32x32@2x | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/browser.svg | 26 | 32x32 | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/calculator.png | 26 | 32x32@2x | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/calculator.svg | 26 | 32x32 | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/downloads.png | 26 | 32x32@2x | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/downloads.svg | 26 | 32x32 | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/files.png | 26 | 32x32@2x | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/files.svg | 26 | 32x32 | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/help.png | 26 | 32x32@2x | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/help.svg | 26 | 32x32 | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/inspector.png | 26 | 32x32@2x | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/inspector.svg | 26 | 32x32 | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/mail.png | 26 | 32x32@2x | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/mail.svg | 26 | 32x32 | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/mission.png | 26 | 32x32@2x | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/mission.svg | 26 | 32x32 | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/notes.png | 26 | 32x32@2x | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/notes.svg | 26 | 32x32 | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/security.png | 26 | 32x32@2x | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/security.svg | 26 | 32x32 | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/settings.png | 26 | 32x32@2x | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/settings.svg | 26 | 32x32 | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/terminal.png | 26 | 32x32@2x | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/app/terminal.svg | 26 | 32x32 | AppIcon | 32x32 app icon |
| assets/cyberdesk/icons/attach/doc.png | 45 | 16x16@2x | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/doc.svg | 45 | 16x16 | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/exe.png | 45 | 16x16@2x | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/exe.svg | 45 | 16x16 | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/html.png | 45 | 16x16@2x | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/html.svg | 45 | 16x16 | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/img.png | 45 | 16x16@2x | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/img.svg | 45 | 16x16 | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/js.png | 45 | 16x16@2x | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/js.svg | 45 | 16x16 | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/pdf.png | 45 | 16x16@2x | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/pdf.svg | 45 | 16x16 | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/txt.png | 45 | 16x16@2x | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/txt.svg | 45 | 16x16 | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/unknown.png | 45 | 16x16@2x | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/unknown.svg | 45 | 16x16 | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/xls.png | 45 | 16x16@2x | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/xls.svg | 45 | 16x16 | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/zip.png | 45 | 16x16@2x | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/attach/zip.svg | 45 | 16x16 | AttachmentChip | 16x16 attachment chip |
| assets/cyberdesk/icons/filetype/archive.png | 27,73 | 32x32@2x | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/archive.svg | 27,73 | 32x32 | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/attachment.png | 27,73 | 32x32@2x | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/attachment.svg | 27,73 | 32x32 | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/document.png | 27,73 | 32x32@2x | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/document.svg | 27,73 | 32x32 | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/executable.png | 27,73 | 32x32@2x | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/executable.svg | 27,73 | 32x32 | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/folder.png | 27,73 | 32x32@2x | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/folder.svg | 27,73 | 32x32 | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/image.png | 27,73 | 32x32@2x | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/image.svg | 27,73 | 32x32 | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/pdf.png | 27,73 | 32x32@2x | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/pdf.svg | 27,73 | 32x32 | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/quarantined.png | 27,73 | 32x32@2x | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/quarantined.svg | 27,73 | 32x32 | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/script.png | 27,73 | 32x32@2x | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/script.svg | 27,73 | 32x32 | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/shortcut.png | 27,73 | 32x32@2x | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/shortcut.svg | 27,73 | 32x32 | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/spreadsheet.png | 27,73 | 32x32@2x | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/spreadsheet.svg | 27,73 | 32x32 | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/text.png | 27,73 | 32x32@2x | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/text.svg | 27,73 | 32x32 | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/unknown.png | 27,73 | 32x32@2x | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/filetype/unknown.svg | 27,73 | 32x32 | FileIcon | 32x32 file type icon (shared by rows 27 & 73) |
| assets/cyberdesk/icons/overlay/blocked.png | 22,27,45,73 | 16x16@4x | IconOverlay | 16x16 overlay |
| assets/cyberdesk/icons/overlay/blocked.svg | 22,27,45,73 | 16x16 | IconOverlay | 16x16 overlay |
| assets/cyberdesk/icons/overlay/check.png | 22,27,45,73 | 16x16@4x | IconOverlay | 16x16 overlay |
| assets/cyberdesk/icons/overlay/check.svg | 22,27,45,73 | 16x16 | IconOverlay | 16x16 overlay |
| assets/cyberdesk/icons/overlay/download.png | 22,27,45,73 | 16x16@4x | IconOverlay | 16x16 overlay |
| assets/cyberdesk/icons/overlay/download.svg | 22,27,45,73 | 16x16 | IconOverlay | 16x16 overlay |
| assets/cyberdesk/icons/overlay/quarantine.png | 22,27,45,73 | 16x16@4x | IconOverlay | 16x16 overlay |
| assets/cyberdesk/icons/overlay/quarantine.svg | 22,27,45,73 | 16x16 | IconOverlay | 16x16 overlay |
| assets/cyberdesk/icons/overlay/shortcut.png | 22,27,45,73 | 16x16@4x | IconOverlay | 16x16 overlay |
| assets/cyberdesk/icons/overlay/shortcut.svg | 22,27,45,73 | 16x16 | IconOverlay | 16x16 overlay |
| assets/cyberdesk/icons/overlay/warning.png | 22,27,45,73 | 16x16@4x | IconOverlay | 16x16 overlay |
| assets/cyberdesk/icons/overlay/warning.svg | 22,27,45,73 | 16x16 | IconOverlay | 16x16 overlay |
| assets/cyberdesk/icons/status/blocked.png | 28 | 16x16@4x | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/blocked.svg | 28 | 16x16 | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/error.png | 28 | 16x16@4x | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/error.svg | 28 | 16x16 | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/evidence.png | 28 | 16x16@4x | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/evidence.svg | 28 | 16x16 | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/info.png | 28 | 16x16@4x | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/info.svg | 28 | 16x16 | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/pending.png | 28 | 16x16@4x | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/pending.svg | 28 | 16x16 | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/question.png | 28 | 16x16@4x | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/question.svg | 28 | 16x16 | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/shield.png | 28 | 16x16@4x | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/shield.svg | 28 | 16x16 | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/success.png | 28 | 16x16@4x | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/success.svg | 28 | 16x16 | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/suspicious.png | 28 | 16x16@4x | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/suspicious.svg | 28 | 16x16 | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/unknown.png | 28 | 16x16@4x | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/unknown.svg | 28 | 16x16 | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/verified.png | 28 | 16x16@4x | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/verified.svg | 28 | 16x16 | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/warning.png | 28 | 16x16@4x | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/status/warning.svg | 28 | 16x16 | StatusIcon | 16x16 status icon |
| assets/cyberdesk/icons/system/cd_drive.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/cd_drive.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/clock.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/clock.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/control_panel.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/control_panel.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/display.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/display.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/documents.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/documents.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/floppy_drive.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/floppy_drive.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/hard_drive.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/hard_drive.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/help.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/help.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/internet.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/internet.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/my_computer.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/my_computer.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/network.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/network.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/power.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/power.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/printer.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/printer.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/programs.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/programs.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/run.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/run.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/search.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/search.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/speaker.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/speaker.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/user.png | 25 | 32x32@2x | SystemIcon | 32x32 system icon |
| assets/cyberdesk/icons/system/user.svg | 25 | 32x32 | SystemIcon | 32x32 system icon |
| assets/cyberdesk/investigation/evidence-cert.png | 64 | 16x16@4x | EvidenceIndicator | 16x16 |
| assets/cyberdesk/investigation/evidence-cert.svg | 64 | 16x16 | EvidenceIndicator | 16x16 |
| assets/cyberdesk/investigation/evidence-clue.png | 64 | 16x16@4x | EvidenceIndicator | 16x16 |
| assets/cyberdesk/investigation/evidence-clue.svg | 64 | 16x16 | EvidenceIndicator | 16x16 |
| assets/cyberdesk/investigation/evidence-known.png | 64 | 16x16@4x | EvidenceIndicator | 16x16 |
| assets/cyberdesk/investigation/evidence-known.svg | 64 | 16x16 | EvidenceIndicator | 16x16 |
| assets/cyberdesk/investigation/evidence-mismatch.png | 64 | 16x16@4x | EvidenceIndicator | 16x16 |
| assets/cyberdesk/investigation/evidence-mismatch.svg | 64 | 16x16 | EvidenceIndicator | 16x16 |
| assets/cyberdesk/investigation/evidence-suspicious.png | 64 | 16x16@4x | EvidenceIndicator | 16x16 |
| assets/cyberdesk/investigation/evidence-suspicious.svg | 64 | 16x16 | EvidenceIndicator | 16x16 |
| assets/cyberdesk/investigation/evidence-unknown.png | 64 | 16x16@4x | EvidenceIndicator | 16x16 |
| assets/cyberdesk/investigation/evidence-unknown.svg | 64 | 16x16 | EvidenceIndicator | 16x16 |
| assets/cyberdesk/mail/avatars/alex-kim.png | 42 | 32x32@2x | Avatar | Alex Kim |
| assets/cyberdesk/mail/avatars/alex-kim.svg | 42 | 32x32 | Avatar | Alex Kim |
| assets/cyberdesk/mail/avatars/chris-novak.png | 42 | 32x32@2x | Avatar | Chris Novak |
| assets/cyberdesk/mail/avatars/chris-novak.svg | 42 | 32x32 | Avatar | Chris Novak |
| assets/cyberdesk/mail/avatars/dana-whitfield.png | 42 | 32x32@2x | Avatar | Dana Whitfield |
| assets/cyberdesk/mail/avatars/dana-whitfield.svg | 42 | 32x32 | Avatar | Dana Whitfield |
| assets/cyberdesk/mail/avatars/eastbrook-university.png | 42 | 32x32@2x | Avatar | Eastbrook University |
| assets/cyberdesk/mail/avatars/eastbrook-university.svg | 42 | 32x32 | Avatar | Eastbrook University |
| assets/cyberdesk/mail/avatars/it-helpdesk.png | 42 | 32x32@2x | Avatar | IT Help Desk |
| assets/cyberdesk/mail/avatars/it-helpdesk.svg | 42 | 32x32 | Avatar | IT Help Desk |
| assets/cyberdesk/mail/avatars/ivy-park.png | 42 | 32x32@2x | Avatar | Ivy Park |
| assets/cyberdesk/mail/avatars/ivy-park.svg | 42 | 32x32 | Avatar | Ivy Park |
| assets/cyberdesk/mail/avatars/jordan-blake.png | 42 | 32x32@2x | Avatar | Jordan Blake |
| assets/cyberdesk/mail/avatars/jordan-blake.svg | 42 | 32x32 | Avatar | Jordan Blake |
| assets/cyberdesk/mail/avatars/ken-watanabe.png | 42 | 32x32@2x | Avatar | Ken Watanabe |
| assets/cyberdesk/mail/avatars/ken-watanabe.svg | 42 | 32x32 | Avatar | Ken Watanabe |
| assets/cyberdesk/mail/avatars/liam-chen.png | 42 | 32x32@2x | Avatar | Liam Chen |
| assets/cyberdesk/mail/avatars/liam-chen.svg | 42 | 32x32 | Avatar | Liam Chen |
| assets/cyberdesk/mail/avatars/maya-okafor.png | 42 | 32x32@2x | Avatar | Dr. Maya Okafor |
| assets/cyberdesk/mail/avatars/maya-okafor.svg | 42 | 32x32 | Avatar | Dr. Maya Okafor |
| assets/cyberdesk/mail/avatars/nimbusdrive.png | 42 | 32x32@2x | Avatar | NimbusDrive Cloud |
| assets/cyberdesk/mail/avatars/nimbusdrive.svg | 42 | 32x32 | Avatar | NimbusDrive Cloud |
| assets/cyberdesk/mail/avatars/nora-hughes.png | 42 | 32x32@2x | Avatar | Nora Hughes |
| assets/cyberdesk/mail/avatars/nora-hughes.svg | 42 | 32x32 | Avatar | Nora Hughes |
| assets/cyberdesk/mail/avatars/northvale-bank.png | 42 | 32x32@2x | Avatar | Northvale Bank |
| assets/cyberdesk/mail/avatars/northvale-bank.svg | 42 | 32x32 | Avatar | Northvale Bank |
| assets/cyberdesk/mail/avatars/omar-haddad.png | 42 | 32x32@2x | Avatar | Omar Haddad |
| assets/cyberdesk/mail/avatars/omar-haddad.svg | 42 | 32x32 | Avatar | Omar Haddad |
| assets/cyberdesk/mail/avatars/parcelpoint.png | 42 | 32x32@2x | Avatar | ParcelPoint Delivery |
| assets/cyberdesk/mail/avatars/parcelpoint.svg | 42 | 32x32 | Avatar | ParcelPoint Delivery |
| assets/cyberdesk/mail/avatars/paysure-hr.png | 42 | 32x32@2x | Avatar | PaySure Payroll |
| assets/cyberdesk/mail/avatars/paysure-hr.svg | 42 | 32x32 | Avatar | PaySure Payroll |
| assets/cyberdesk/mail/avatars/priya-nair.png | 42 | 32x32@2x | Avatar | Priya Nair |
| assets/cyberdesk/mail/avatars/priya-nair.svg | 42 | 32x32 | Avatar | Priya Nair |
| assets/cyberdesk/mail/avatars/rosa-martinez.png | 42 | 32x32@2x | Avatar | Rosa Martinez |
| assets/cyberdesk/mail/avatars/rosa-martinez.svg | 42 | 32x32 | Avatar | Rosa Martinez |
| assets/cyberdesk/mail/avatars/sam-rivera.png | 42 | 32x32@2x | Avatar | Sam Rivera |
| assets/cyberdesk/mail/avatars/sam-rivera.svg | 42 | 32x32 | Avatar | Sam Rivera |
| assets/cyberdesk/mail/avatars/tom-becker.png | 42 | 32x32@2x | Avatar | Tom Becker |
| assets/cyberdesk/mail/avatars/tom-becker.svg | 42 | 32x32 | Avatar | Tom Becker |
| assets/cyberdesk/mascot/finn-alert.png | 88 | 32x32@3x | Mascot | frame 4 |
| assets/cyberdesk/mascot/finn-alert.svg | 88 | 32x32 | Mascot | frame 4 |
| assets/cyberdesk/mascot/finn-blink.png | 88 | 32x32@3x | Mascot | frame 2 |
| assets/cyberdesk/mascot/finn-blink.svg | 88 | 32x32 | Mascot | frame 2 |
| assets/cyberdesk/mascot/finn-happy.png | 88 | 32x32@3x | Mascot | frame 3 |
| assets/cyberdesk/mascot/finn-happy.svg | 88 | 32x32 | Mascot | frame 3 |
| assets/cyberdesk/mascot/finn-idle.png | 88 | 32x32@3x | Mascot | frame 1 |
| assets/cyberdesk/mascot/finn-idle.svg | 88 | 32x32 | Mascot | frame 1 |
| assets/cyberdesk/mascot/finn-sheet.png | 88 | 192x32@3x | Mascot | 6 frames x 32px: idle,blink,happy,alert,thinking,warning |
| assets/cyberdesk/mascot/finn-sheet.svg | 88 | 192x32 | Mascot | 6 frames x 32px: idle,blink,happy,alert,thinking,warning |
| assets/cyberdesk/mascot/finn-thinking.png | 88 | 32x32@3x | Mascot | frame 5 |
| assets/cyberdesk/mascot/finn-thinking.svg | 88 | 32x32 | Mascot | frame 5 |
| assets/cyberdesk/mascot/finn-warning.png | 88 | 32x32@3x | Mascot | frame 6 |
| assets/cyberdesk/mascot/finn-warning.svg | 88 | 32x32 | Mascot | frame 6 |
| assets/cyberdesk/progression/achievements/all_seeing-locked.png | 81 | 32x32@2x | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/all_seeing-locked.svg | 81 | 32x32 | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/all_seeing.png | 81 | 32x32@2x | AchievementIcon | All-Seeing |
| assets/cyberdesk/progression/achievements/all_seeing.svg | 81 | 32x32 | AchievementIcon | All-Seeing |
| assets/cyberdesk/progression/achievements/attachment_hawk-locked.png | 81 | 32x32@2x | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/attachment_hawk-locked.svg | 81 | 32x32 | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/attachment_hawk.png | 81 | 32x32@2x | AchievementIcon | Attachment Hawk |
| assets/cyberdesk/progression/achievements/attachment_hawk.svg | 81 | 32x32 | AchievementIcon | Attachment Hawk |
| assets/cyberdesk/progression/achievements/bookworm-locked.png | 81 | 32x32@2x | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/bookworm-locked.svg | 81 | 32x32 | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/bookworm.png | 81 | 32x32@2x | AchievementIcon | Bookworm |
| assets/cyberdesk/progression/achievements/bookworm.svg | 81 | 32x32 | AchievementIcon | Bookworm |
| assets/cyberdesk/progression/achievements/bullseye-locked.png | 81 | 32x32@2x | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/bullseye-locked.svg | 81 | 32x32 | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/bullseye.png | 81 | 32x32@2x | AchievementIcon | Bullseye |
| assets/cyberdesk/progression/achievements/bullseye.svg | 81 | 32x32 | AchievementIcon | Bullseye |
| assets/cyberdesk/progression/achievements/champion-locked.png | 81 | 32x32@2x | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/champion-locked.svg | 81 | 32x32 | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/champion.png | 81 | 32x32@2x | AchievementIcon | Champion |
| assets/cyberdesk/progression/achievements/champion.svg | 81 | 32x32 | AchievementIcon | Champion |
| assets/cyberdesk/progression/achievements/cyber_royalty-locked.png | 81 | 32x32@2x | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/cyber_royalty-locked.svg | 81 | 32x32 | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/cyber_royalty.png | 81 | 32x32@2x | AchievementIcon | Cyber Royalty |
| assets/cyberdesk/progression/achievements/cyber_royalty.svg | 81 | 32x32 | AchievementIcon | Cyber Royalty |
| assets/cyberdesk/progression/achievements/first_report-locked.png | 81 | 32x32@2x | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/first_report-locked.svg | 81 | 32x32 | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/first_report.png | 81 | 32x32@2x | AchievementIcon | First Report |
| assets/cyberdesk/progression/achievements/first_report.svg | 81 | 32x32 | AchievementIcon | First Report |
| assets/cyberdesk/progression/achievements/inbox_clear-locked.png | 81 | 32x32@2x | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/inbox_clear-locked.svg | 81 | 32x32 | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/inbox_clear.png | 81 | 32x32@2x | AchievementIcon | Inbox Clear |
| assets/cyberdesk/progression/achievements/inbox_clear.svg | 81 | 32x32 | AchievementIcon | Inbox Clear |
| assets/cyberdesk/progression/achievements/key_keeper-locked.png | 81 | 32x32@2x | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/key_keeper-locked.svg | 81 | 32x32 | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/key_keeper.png | 81 | 32x32@2x | AchievementIcon | Key Keeper |
| assets/cyberdesk/progression/achievements/key_keeper.svg | 81 | 32x32 | AchievementIcon | Key Keeper |
| assets/cyberdesk/progression/achievements/link_sleuth-locked.png | 81 | 32x32@2x | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/link_sleuth-locked.svg | 81 | 32x32 | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/link_sleuth.png | 81 | 32x32@2x | AchievementIcon | Link Sleuth |
| assets/cyberdesk/progression/achievements/link_sleuth.svg | 81 | 32x32 | AchievementIcon | Link Sleuth |
| assets/cyberdesk/progression/achievements/lockdown-locked.png | 81 | 32x32@2x | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/lockdown-locked.svg | 81 | 32x32 | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/lockdown.png | 81 | 32x32@2x | AchievementIcon | Lockdown |
| assets/cyberdesk/progression/achievements/lockdown.svg | 81 | 32x32 | AchievementIcon | Lockdown |
| assets/cyberdesk/progression/achievements/on_the_clock-locked.png | 81 | 32x32@2x | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/on_the_clock-locked.svg | 81 | 32x32 | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/on_the_clock.png | 81 | 32x32@2x | AchievementIcon | On the Clock |
| assets/cyberdesk/progression/achievements/on_the_clock.svg | 81 | 32x32 | AchievementIcon | On the Clock |
| assets/cyberdesk/progression/achievements/perfect_run-locked.png | 81 | 32x32@2x | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/perfect_run-locked.svg | 81 | 32x32 | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/perfect_run.png | 81 | 32x32@2x | AchievementIcon | Perfect Run |
| assets/cyberdesk/progression/achievements/perfect_run.svg | 81 | 32x32 | AchievementIcon | Perfect Run |
| assets/cyberdesk/progression/achievements/safe_clicker-locked.png | 81 | 32x32@2x | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/safe_clicker-locked.svg | 81 | 32x32 | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/safe_clicker.png | 81 | 32x32@2x | AchievementIcon | Safe Clicker |
| assets/cyberdesk/progression/achievements/safe_clicker.svg | 81 | 32x32 | AchievementIcon | Safe Clicker |
| assets/cyberdesk/progression/achievements/sharp_eyes-locked.png | 81 | 32x32@2x | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/sharp_eyes-locked.svg | 81 | 32x32 | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/sharp_eyes.png | 81 | 32x32@2x | AchievementIcon | Sharp Eyes |
| assets/cyberdesk/progression/achievements/sharp_eyes.svg | 81 | 32x32 | AchievementIcon | Sharp Eyes |
| assets/cyberdesk/progression/achievements/speed_reader-locked.png | 81 | 32x32@2x | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/speed_reader-locked.svg | 81 | 32x32 | AchievementIcon | locked frame |
| assets/cyberdesk/progression/achievements/speed_reader.png | 81 | 32x32@2x | AchievementIcon | Speed Reader |
| assets/cyberdesk/progression/achievements/speed_reader.svg | 81 | 32x32 | AchievementIcon | Speed Reader |
| assets/cyberdesk/progression/ranks/analyst-locked.png | 80 | 32x32@2x | RankBadge | locked frame |
| assets/cyberdesk/progression/ranks/analyst-locked.svg | 80 | 32x32 | RankBadge | locked frame |
| assets/cyberdesk/progression/ranks/analyst.png | 80 | 32x32@2x | RankBadge | Analyst @ 250 XP |
| assets/cyberdesk/progression/ranks/analyst.svg | 80 | 32x32 | RankBadge | Analyst @ 250 XP |
| assets/cyberdesk/progression/ranks/chief-locked.png | 80 | 32x32@2x | RankBadge | locked frame |
| assets/cyberdesk/progression/ranks/chief-locked.svg | 80 | 32x32 | RankBadge | locked frame |
| assets/cyberdesk/progression/ranks/chief.png | 80 | 32x32@2x | RankBadge | Chief Inspector @ 2100 XP |
| assets/cyberdesk/progression/ranks/chief.svg | 80 | 32x32 | RankBadge | Chief Inspector @ 2100 XP |
| assets/cyberdesk/progression/ranks/investigator-locked.png | 80 | 32x32@2x | RankBadge | locked frame |
| assets/cyberdesk/progression/ranks/investigator-locked.svg | 80 | 32x32 | RankBadge | locked frame |
| assets/cyberdesk/progression/ranks/investigator.png | 80 | 32x32@2x | RankBadge | Investigator @ 1400 XP |
| assets/cyberdesk/progression/ranks/investigator.svg | 80 | 32x32 | RankBadge | Investigator @ 1400 XP |
| assets/cyberdesk/progression/ranks/junior-locked.png | 80 | 32x32@2x | RankBadge | locked frame |
| assets/cyberdesk/progression/ranks/junior-locked.svg | 80 | 32x32 | RankBadge | locked frame |
| assets/cyberdesk/progression/ranks/junior.png | 80 | 32x32@2x | RankBadge | Junior Analyst @ 100 XP |
| assets/cyberdesk/progression/ranks/junior.svg | 80 | 32x32 | RankBadge | Junior Analyst @ 100 XP |
| assets/cyberdesk/progression/ranks/sage-locked.png | 80 | 32x32@2x | RankBadge | locked frame |
| assets/cyberdesk/progression/ranks/sage-locked.svg | 80 | 32x32 | RankBadge | locked frame |
| assets/cyberdesk/progression/ranks/sage.png | 80 | 32x32@2x | RankBadge | Cyber Sage @ 3000 XP |
| assets/cyberdesk/progression/ranks/sage.svg | 80 | 32x32 | RankBadge | Cyber Sage @ 3000 XP |
| assets/cyberdesk/progression/ranks/senior-locked.png | 80 | 32x32@2x | RankBadge | locked frame |
| assets/cyberdesk/progression/ranks/senior-locked.svg | 80 | 32x32 | RankBadge | locked frame |
| assets/cyberdesk/progression/ranks/senior.png | 80 | 32x32@2x | RankBadge | Senior Analyst @ 500 XP |
| assets/cyberdesk/progression/ranks/senior.svg | 80 | 32x32 | RankBadge | Senior Analyst @ 500 XP |
| assets/cyberdesk/progression/ranks/specialist-locked.png | 80 | 32x32@2x | RankBadge | locked frame |
| assets/cyberdesk/progression/ranks/specialist-locked.svg | 80 | 32x32 | RankBadge | locked frame |
| assets/cyberdesk/progression/ranks/specialist.png | 80 | 32x32@2x | RankBadge | Specialist @ 900 XP |
| assets/cyberdesk/progression/ranks/specialist.svg | 80 | 32x32 | RankBadge | Specialist @ 900 XP |
| assets/cyberdesk/progression/ranks/trainee-locked.png | 80 | 32x32@2x | RankBadge | locked frame |
| assets/cyberdesk/progression/ranks/trainee-locked.svg | 80 | 32x32 | RankBadge | locked frame |
| assets/cyberdesk/progression/ranks/trainee.png | 80 | 32x32@2x | RankBadge | Trainee @ 0 XP |
| assets/cyberdesk/progression/ranks/trainee.svg | 80 | 32x32 | RankBadge | Trainee @ 0 XP |
| assets/cyberdesk/security/threat-attachment.png | 68 | 32x32@2x | ThreatCategory | 32x32 |
| assets/cyberdesk/security/threat-attachment.svg | 68 | 32x32 | ThreatCategory | 32x32 |
| assets/cyberdesk/security/threat-credential.png | 68 | 32x32@2x | ThreatCategory | 32x32 |
| assets/cyberdesk/security/threat-credential.svg | 68 | 32x32 | ThreatCategory | 32x32 |
| assets/cyberdesk/security/threat-impersonation.png | 68 | 32x32@2x | ThreatCategory | 32x32 |
| assets/cyberdesk/security/threat-impersonation.svg | 68 | 32x32 | ThreatCategory | 32x32 |
| assets/cyberdesk/security/threat-link.png | 68 | 32x32@2x | ThreatCategory | 32x32 |
| assets/cyberdesk/security/threat-link.svg | 68 | 32x32 | ThreatCategory | 32x32 |
| assets/cyberdesk/security/threat-other.png | 68 | 32x32@2x | ThreatCategory | 32x32 |
| assets/cyberdesk/security/threat-other.svg | 68 | 32x32 | ThreatCategory | 32x32 |
| assets/cyberdesk/security/threat-payment.png | 68 | 32x32@2x | ThreatCategory | 32x32 |
| assets/cyberdesk/security/threat-payment.svg | 68 | 32x32 | ThreatCategory | 32x32 |
| assets/cyberdesk/security/threat-social.png | 68 | 32x32@2x | ThreatCategory | 32x32 |
| assets/cyberdesk/security/threat-social.svg | 68 | 32x32 | ThreatCategory | 32x32 |
| assets/cyberdesk/security/threat-spoof.png | 68 | 32x32@2x | ThreatCategory | 32x32 |
| assets/cyberdesk/security/threat-spoof.svg | 68 | 32x32 | ThreatCategory | 32x32 |
| assets/cyberdesk/sprites/crt-off.png | 84 | 44x38@3x | Crt | screen off |
| assets/cyberdesk/sprites/crt-off.svg | 84 | 44x38 | Crt | screen off |
| assets/cyberdesk/sprites/crt-on.png | 84 | 44x38@3x | Crt | screen on (glow pulse in CSS) |
| assets/cyberdesk/sprites/crt-on.svg | 84 | 44x38 | Crt | screen on (glow pulse in CSS) |
| assets/cyberdesk/sprites/keyboard.png | 85 | 56x16@3x | Keyboard |  |
| assets/cyberdesk/sprites/keyboard.svg | 85 | 56x16 | Keyboard |  |
| assets/cyberdesk/sprites/mouse.png | 85 | 12x18@3x | Mouse |  |
| assets/cyberdesk/sprites/mouse.svg | 85 | 12x18 | Mouse |  |
| assets/cyberdesk/sprites/office/cables.png | 87 | 32x20@3x | Cables |  |
| assets/cyberdesk/sprites/office/cables.svg | 87 | 32x20 | Cables |  |
| assets/cyberdesk/sprites/office/coffee-mug.png | 87 | 20x20@3x | Mug |  |
| assets/cyberdesk/sprites/office/coffee-mug.svg | 87 | 20x20 | Mug |  |
| assets/cyberdesk/sprites/office/desk-lamp-on.png | 87 | 28x34@3x | Lamp | lamp lit |
| assets/cyberdesk/sprites/office/desk-lamp-on.svg | 87 | 28x34 | Lamp | lamp lit |
| assets/cyberdesk/sprites/office/desk-lamp.png | 87 | 28x34@3x | Lamp | idle |
| assets/cyberdesk/sprites/office/desk-lamp.svg | 87 | 28x34 | Lamp | idle |
| assets/cyberdesk/sprites/office/manila-folder.png | 87 | 32x24@3x | Folder |  |
| assets/cyberdesk/sprites/office/manila-folder.svg | 87 | 32x24 | Folder |  |
| assets/cyberdesk/sprites/office/papers.png | 87 | 30x22@3x | Papers |  |
| assets/cyberdesk/sprites/office/papers.svg | 87 | 30x22 | Papers |  |
| assets/cyberdesk/sprites/office/potted-plant.png | 87 | 22x30@3x | Plant |  |
| assets/cyberdesk/sprites/office/potted-plant.svg | 87 | 22x30 | Plant |  |
| assets/cyberdesk/sprites/office/printer-paper.png | 87 | 40x30@3x | Printer | paper out frame |
| assets/cyberdesk/sprites/office/printer-paper.svg | 87 | 40x30 | Printer | paper out frame |
| assets/cyberdesk/sprites/office/printer.png | 87 | 40x30@3x | Printer | idle |
| assets/cyberdesk/sprites/office/printer.svg | 87 | 40x30 | Printer | idle |
| assets/cyberdesk/sprites/office/stapler.png | 87 | 28x14@3x | Stapler |  |
| assets/cyberdesk/sprites/office/stapler.svg | 87 | 28x14 | Stapler |  |
| assets/cyberdesk/sprites/office/sticky-notes.png | 87 | 24x24@3x | Notes |  |
| assets/cyberdesk/sprites/office/sticky-notes.svg | 87 | 24x24 | Notes |  |
| assets/cyberdesk/sprites/office/telephone.png | 87 | 30x20@3x | Telephone |  |
| assets/cyberdesk/sprites/office/telephone.svg | 87 | 30x20 | Telephone |  |
| assets/cyberdesk/sprites/storage/cd-r.png | 86 | 24x24@3x | Storage |  |
| assets/cyberdesk/sprites/storage/cd-r.svg | 86 | 24x24 | Storage |  |
| assets/cyberdesk/sprites/storage/cd-rom.png | 86 | 24x24@3x | Storage |  |
| assets/cyberdesk/sprites/storage/cd-rom.svg | 86 | 24x24 | Storage |  |
| assets/cyberdesk/sprites/storage/dvd.png | 86 | 24x24@3x | Storage |  |
| assets/cyberdesk/sprites/storage/dvd.svg | 86 | 24x24 | Storage |  |
| assets/cyberdesk/sprites/storage/external-hdd.png | 86 | 28x18@3x | Storage |  |
| assets/cyberdesk/sprites/storage/external-hdd.svg | 86 | 28x18 | Storage |  |
| assets/cyberdesk/sprites/storage/floppy-black.png | 86 | 24x24@3x | Storage |  |
| assets/cyberdesk/sprites/storage/floppy-black.svg | 86 | 24x24 | Storage |  |
| assets/cyberdesk/sprites/storage/floppy-blue.png | 86 | 24x24@3x | Storage |  |
| assets/cyberdesk/sprites/storage/floppy-blue.svg | 86 | 24x24 | Storage |  |
| assets/cyberdesk/sprites/storage/floppy-red.png | 86 | 24x24@3x | Storage |  |
| assets/cyberdesk/sprites/storage/floppy-red.svg | 86 | 24x24 | Storage |  |
| assets/cyberdesk/sprites/storage/memory-card.png | 86 | 16x20@3x | Storage |  |
| assets/cyberdesk/sprites/storage/memory-card.svg | 86 | 16x20 | Storage |  |
| assets/cyberdesk/sprites/storage/usb-black.png | 86 | 24x12@3x | Storage |  |
| assets/cyberdesk/sprites/storage/usb-black.svg | 86 | 24x12 | Storage |  |
| assets/cyberdesk/sprites/storage/usb-blue.png | 86 | 24x12@3x | Storage |  |
| assets/cyberdesk/sprites/storage/usb-blue.svg | 86 | 24x12 | Storage |  |
| assets/cyberdesk/sprites/storage/usb-red.png | 86 | 24x12@3x | Storage |  |
| assets/cyberdesk/sprites/storage/usb-red.svg | 86 | 24x12 | Storage |  |
| assets/cyberdesk/sprites/storage/zip-disk.png | 86 | 24x24@3x | Storage |  |
| assets/cyberdesk/sprites/storage/zip-disk.svg | 86 | 24x24 | Storage |  |
| assets/cyberdesk/sprites/tower-on.png | 85 | 24x40@3x | Tower | power LED on |
| assets/cyberdesk/sprites/tower-on.svg | 85 | 24x40 | Tower | power LED on |
| assets/cyberdesk/sprites/tower.png | 85 | 24x40@3x | Tower | static |
| assets/cyberdesk/sprites/tower.svg | 85 | 24x40 | Tower | static |
| assets/cyberdesk/toolbar/archive.png | 46 | 16x16@2x | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/archive.svg | 46 | 16x16 | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/back.png | 50,51,52 | 16x16@2x | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/back.svg | 50,51,52 | 16x16 | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/compose.png | 46 | 16x16@2x | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/compose.svg | 46 | 16x16 | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/delete.png | 46 | 16x16@2x | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/delete.svg | 46 | 16x16 | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/download.png | 50,51,52 | 16x16@2x | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/download.svg | 50,51,52 | 16x16 | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/forward.png | 46 | 16x16@2x | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/forward.svg | 46 | 16x16 | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/forward_nav.png | 50,51,52 | 16x16@2x | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/forward_nav.svg | 50,51,52 | 16x16 | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/home.png | 50,51,52 | 16x16@2x | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/home.svg | 50,51,52 | 16x16 | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/lock.png | 50,51,52 | 16x16@2x | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/lock.svg | 50,51,52 | 16x16 | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/lock_open.png | 50,51,52 | 16x16@2x | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/lock_open.svg | 50,51,52 | 16x16 | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/mark_unread.png | 46 | 16x16@2x | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/mark_unread.svg | 46 | 16x16 | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/new_tab.png | 50,51,52 | 16x16@2x | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/new_tab.svg | 50,51,52 | 16x16 | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/print.png | 46 | 16x16@2x | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/print.svg | 46 | 16x16 | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/refresh.png | 50,51,52 | 16x16@2x | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/refresh.svg | 50,51,52 | 16x16 | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/reply.png | 46 | 16x16@2x | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/reply.svg | 46 | 16x16 | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/reply_all.png | 46 | 16x16@2x | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/reply_all.svg | 46 | 16x16 | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/report.png | 46 | 16x16@2x | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/report.svg | 46 | 16x16 | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/search.png | 46 | 16x16@2x | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/search.svg | 46 | 16x16 | MailToolbar | 16x16 |
| assets/cyberdesk/toolbar/star.png | 50,51,52 | 16x16@2x | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/star.svg | 50,51,52 | 16x16 | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/stop.png | 50,51,52 | 16x16@2x | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/stop.svg | 50,51,52 | 16x16 | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/user.png | 50,51,52 | 16x16@2x | BrowserToolbar | 16x16 |
| assets/cyberdesk/toolbar/user.svg | 50,51,52 | 16x16 | BrowserToolbar | 16x16 |
| assets/cyberdesk/wallpapers/campus-thumb.png | 15 | 320x180 | Wallpaper | thumbnail |
| assets/cyberdesk/wallpapers/campus.png | 15 | 1280x720 | Wallpaper | Alternate: campus |
| assets/cyberdesk/wallpapers/campus.webp | 15 | 1280x720 | Wallpaper | Alternate: campus |
| assets/cyberdesk/wallpapers/computer-room-thumb.png | 15 | 320x180 | Wallpaper | thumbnail |
| assets/cyberdesk/wallpapers/computer-room.png | 15 | 1280x720 | Wallpaper | Alternate: retro computer room |
| assets/cyberdesk/wallpapers/computer-room.webp | 15 | 1280x720 | Wallpaper | Alternate: retro computer room |
| assets/cyberdesk/wallpapers/landscape-thumb.png | 14 | 320x180 | Wallpaper | thumbnail |
| assets/cyberdesk/wallpapers/landscape.png | 14 | 1280x720 | Wallpaper | Main retro landscape (teal default alternative = CSS #008080) |
| assets/cyberdesk/wallpapers/landscape.webp | 14 | 1280x720 | Wallpaper | Main retro landscape (teal default alternative = CSS #008080) |
| assets/cyberdesk/wallpapers/night-city-thumb.png | 15 | 320x180 | Wallpaper | thumbnail |
| assets/cyberdesk/wallpapers/night-city.png | 15 | 1280x720 | Wallpaper | Alternate: night city |
| assets/cyberdesk/wallpapers/night-city.webp | 15 | 1280x720 | Wallpaper | Alternate: night city |
| assets/cyberdesk/window/glyph-arrow-down.png | 37,36 | 7x4@4x | Scrollbar/Select |  |
| assets/cyberdesk/window/glyph-arrow-down.svg | 37,36 | 7x4 | Scrollbar/Select |  |
| assets/cyberdesk/window/glyph-arrow-left.png | 37,36 | 4x7@4x | Scrollbar/Select |  |
| assets/cyberdesk/window/glyph-arrow-left.svg | 37,36 | 4x7 | Scrollbar/Select |  |
| assets/cyberdesk/window/glyph-arrow-right.png | 37,36 | 4x7@4x | Scrollbar/Select |  |
| assets/cyberdesk/window/glyph-arrow-right.svg | 37,36 | 4x7 | Scrollbar/Select |  |
| assets/cyberdesk/window/glyph-arrow-up.png | 37,36 | 7x4@4x | Scrollbar/Select |  |
| assets/cyberdesk/window/glyph-arrow-up.svg | 37,36 | 7x4 | Scrollbar/Select |  |
| assets/cyberdesk/window/glyph-check.png | 36 | 7x7@4x | Checkbox |  |
| assets/cyberdesk/window/glyph-check.svg | 36 | 7x7 | Checkbox |  |
| assets/cyberdesk/window/glyph-close.png | 33 | 8x7@4x | WindowControls | black glyph; recolour via CSS mask |
| assets/cyberdesk/window/glyph-close.svg | 33 | 8x7 | WindowControls | black glyph; recolour via CSS mask |
| assets/cyberdesk/window/glyph-maximize.png | 33 | 9x8@4x | WindowControls | black glyph; recolour via CSS mask |
| assets/cyberdesk/window/glyph-maximize.svg | 33 | 9x8 | WindowControls | black glyph; recolour via CSS mask |
| assets/cyberdesk/window/glyph-minimize.png | 33 | 8x7@4x | WindowControls | black glyph; recolour via CSS mask |
| assets/cyberdesk/window/glyph-minimize.svg | 33 | 8x7 | WindowControls | black glyph; recolour via CSS mask |
| assets/cyberdesk/window/glyph-radio.png | 36 | 4x4@4x | Radio |  |
| assets/cyberdesk/window/glyph-radio.svg | 36 | 4x4 | Radio |  |
| assets/cyberdesk/window/glyph-restore.png | 33 | 9x8@4x | WindowControls | black glyph; recolour via CSS mask |
| assets/cyberdesk/window/glyph-restore.svg | 33 | 9x8 | WindowControls | black glyph; recolour via CSS mask |
