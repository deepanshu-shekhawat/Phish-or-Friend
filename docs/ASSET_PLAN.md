# Asset production plan

Method: every raster asset is drawn procedurally on a pixel grid (`tools/art_*.py`) using one palette (`tools/pixel.py`, exported to `styles/tokens.css`), so styles stay consistent and any asset can be re-generated or retuned in one place.

| Stage | Output | Status |
|---|---|---|
| 1 Palette, grid sizes, exporters | `pixel.py`, tokens.css | Done |
| 2 Boot + desktop art | boot/, wallpapers/, sprites/ | Done |
| 3 Icons (app, system, file, status, overlays) | icons/ | Done |
| 4 UI glyphs, cursors, threat/evidence icons | toolbar/, window/, cursors/, security/, investigation/ | Done |
| 5 People, mascot, ranks, achievements | mail/avatars, mascot/, progression/ | Done |
| 6 Audio (20 clips, WAV+OGG) | audio/ | Done (synthesised) |
| 7 Shell + apps (React/CSS) | src/cyberdesk | Done |
| 8 Verification + manifest + inventory | tools/e2e, manifest.json, xlsx | Done |

Sizes: icons 16/32/48 px grids, avatars 40x40, wallpapers 640x400 (scaled with `image-rendering: pixelated`), cursors 32x32.
