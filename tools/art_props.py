"""Wallpapers, hardware, storage media and office prop sprites."""
import random
from pixel import Canvas, P, out, write_image, hexrgb, rgbhex
from art_common import crt, folder

K = P['black']


def lerp(a, b, t):
    A, B = hexrgb(a), hexrgb(b)
    return rgbhex(tuple(int(A[i] + (B[i] - A[i]) * t) for i in range(3)))


def save_wall(name, c, rows, note):
    from PIL import Image
    im = c.to_image(4)   # 1280x720 nearest
    write_image(f'wallpapers/{name}.png', im, rows, 'Wallpaper', note=note)
    im.convert('RGB').save(__import__('os').path.join(__import__('pixel').ROOT, f'wallpapers/{name}.webp'), 'WEBP', quality=88, method=6)
    __import__('pixel').MANIFEST.append(dict(file=f'assets/cyberdesk/wallpapers/{name}.webp', rows=rows, grid='1280x720', component='Wallpaper', note=note))
    th = c.to_image(1).convert('RGB'); th.save(__import__('os').path.join(__import__('pixel').ROOT, f'wallpapers/{name}-thumb.png'))
    __import__('pixel').MANIFEST.append(dict(file=f'assets/cyberdesk/wallpapers/{name}-thumb.png', rows=rows, grid='320x180', component='Wallpaper', note='thumbnail'))


def wall_landscape():
    r = random.Random(7); W, H = 320, 180
    c = Canvas(W, H)
    bands = ['#0a5a7a', '#0e6a8a', '#128a9a', '#18a0a8', '#40b8b0', '#80d0b8', '#c0e0b8', '#f0e8a8']
    for y in range(140):
        c.rect(0, y, W, 1, bands[min(len(bands) - 1, y * len(bands) // 140)])
    # dithering between bands
    for y in range(140):
        for x in range(0, W):
            b = y * len(bands) / 140; i = int(b); f = b - i
            if i + 1 < len(bands) and ((x + y) % 2 == 0) and f > 0.6: c.px(x, y, bands[i + 1])
    # stars faint at top
    for _ in range(40): c.px(r.randrange(W), r.randrange(30), '#a0e0ff')
    # sun
    c.ell(240, 92, 22, 22, '#fff0a0'); c.ell(240, 92, 18, 18, '#ffe040'); c.ell(240, 92, 14, 14, '#ffc020')
    for y in range(84, 112):
        if y % 4 == 0: c.rect(215, y, 50, 1, bands[-1])
    # clouds
    for cx, cy in ((50, 28), (140, 44), (270, 24)):
        for dx, dy, rx, ry in ((0, 0, 14, 5), (10, -4, 10, 5), (-10, -2, 9, 4), (20, 0, 10, 4)):
            c.ell(cx + dx, cy + dy, rx, ry, '#ffffff')
        c.rect(cx - 18, cy + 4, 46, 1, '#c8e8f0')
    # hills
    def hill(base, amp, col, shade, seed, per):
        rr = random.Random(seed)
        ph = rr.random() * 6
        import math
        for x in range(W):
            h = int(base - amp * (0.5 + 0.5 * math.sin(x / per + ph)) - amp * 0.3 * math.sin(x / (per / 2.3) + ph * 2))
            c.rect(x, h, 1, H - h, col)
            c.px(x, h, shade)
            if (x % 6 == 0): c.rect(x, h + 2, 1, 2, shade)
    hill(122, 22, '#2a8a5a', '#58c07a', 1, 38)
    hill(138, 20, '#1e7048', '#3aa060', 2, 30)
    hill(158, 14, '#145a38', '#2a8a50', 3, 26)
    # road with perspective grid
    for y in range(150, H):
        t = (y - 150) / (H - 150)
        half = int(18 + t * 130)
        c.rect(160 - half, y, half * 2, 1, '#303848')
        if y % 5 < 3: c.rect(158, y, 4 + int(t * 3), 1, '#ffe040')
        c.px(160 - half, y, '#8090a8'); c.px(160 + half - 1, y, '#8090a8')
    # little CRT tower on hill
    c.rect(52, 112, 10, 18, '#404858'); c.rect(53, 113, 8, 16, '#c0c8d8'); [c.rect(54, 115 + i * 3, 6, 1, '#808898') for i in range(4)]
    c.rect(56, 104, 2, 8, '#808898'); c.px(56, 103, P['red'])
    # birds
    for bx, by in ((100, 56), (112, 50), (124, 58)):
        c.px(bx, by, K); c.px(bx + 1, by + 1, K); c.px(bx + 2, by, K); c.px(bx + 3, by + 1, K); c.px(bx + 4, by, K)
    return c


def wall_campus():
    r = random.Random(11); W, H = 320, 180
    c = Canvas(W, H)
    for y in range(120): c.rect(0, y, W, 1, lerp('#5aa0e0', '#cfe8ff', y / 120))
    for cx, cy in ((60, 30), (200, 20), (280, 44)):
        for dx, dy, rx, ry in ((0, 0, 14, 4), (9, -3, 9, 4), (-9, -1, 8, 3)): c.ell(cx + dx, cy + dy, rx, ry, '#ffffff')
    # lawn
    for y in range(120, H): c.rect(0, y, W, 1, lerp('#4aa04a', '#2a7a3a', (y - 120) / 60))
    for _ in range(300): c.px(r.randrange(W), r.randrange(122, H), '#68c068')
    # main brick building
    c.rect(40, 60, 240, 62, '#a0402a'); c.rect(40, 58, 240, 3, '#7a2a1a'); c.rect(36, 56, 248, 3, '#d8d0c0')
    for y in range(62, 122, 4):
        c.rect(40, y, 240, 1, '#8a3222')
        for x in range(40 + (y // 4 % 2) * 4, 280, 8): c.rect(x, y, 1, 4, '#8a3222')
    for row in range(2):
        for col in range(10):
            x = 52 + col * 22
            if 130 < x + 8 < 190: continue
            y = 68 + row * 28
            c.rect(x, y, 10, 16, '#d8d0c0'); c.rect(x + 1, y + 1, 8, 14, '#305078'); c.rect(x + 1, y + 1, 8, 1, '#80b8e8'); c.rect(x + 5, y + 1, 1, 14, '#d8d0c0'); c.rect(x + 1, y + 8, 8, 1, '#d8d0c0')
    # clock tower
    c.rect(138, 20, 44, 102, '#b04a30'); c.rect(134, 16, 52, 5, '#d8d0c0'); c.poly([(134, 16), (160, -6), (186, 16)], '#3a5a7a')
    c.poly([(144, 16), (160, 0), (176, 16)], '#4a7aa0')
    c.ell(160, 40, 12, 12, '#d8d0c0'); c.ell(160, 40, 10, 10, '#fffff0'); c.line(160, 40, 160, 33, K); c.line(160, 40, 165, 43, K)
    for a in range(4): c.px(160 + (0, 9, 0, -9)[a], 40 + (-9, 0, 9, 0)[a], K)
    c.rect(150, 90, 20, 32, '#d8d0c0'); c.rect(152, 92, 16, 30, '#503020'); c.rect(159, 92, 2, 30, '#d8d0c0')
    c.rect(146, 122, 28, 3, '#d8d0c0'); c.rect(142, 125, 36, 3, '#c0b8a8')
    # path
    c.poly([(150, 128), (170, 128), (230, H), (90, H)], '#d8c8a0')
    # trees
    for tx, ty in ((20, 110), (298, 108), (84, 126), (240, 128)):
        c.rect(tx, ty + 10, 5, 22, '#6a4020'); c.ell(tx + 2, ty, 14, 12, '#2a7a2a'); c.ell(tx - 3, ty - 3, 8, 6, '#40a040'); c.ell(tx + 8, ty - 2, 7, 6, '#38903a')
    return c


def wall_city():
    r = random.Random(23); W, H = 320, 180
    c = Canvas(W, H)
    for y in range(H): c.rect(0, y, W, 1, lerp('#06061a', '#3a1a5a', (y / H) ** 1.4))
    for _ in range(90): c.px(r.randrange(W), r.randrange(100), r.choice(['#ffffff', '#a0b0ff', '#ffe0a0']))
    c.ell(250, 34, 14, 14, '#f0f0d8'); c.ell(255, 31, 12, 12, lerp('#06061a', '#3a1a5a', .2))   # crescent
    # skyline layers
    def layer(base, minw, maxw, minh, maxh, col, win, dens):
        x = -4
        while x < W:
            w = r.randint(minw, maxw); h = r.randint(minh, maxh)
            c.rect(x, base - h, w, h + 200, col)
            if r.random() < .3: c.rect(x + w // 2, base - h - 8, 1, 8, col); c.px(x + w // 2, base - h - 9, P['red'])
            for wy in range(base - h + 3, base - 2, 4):
                for wx in range(x + 2, x + w - 2, 3):
                    if r.random() < dens: c.px(wx, wy, r.choice(win))
            x += w + r.randint(0, 2)
    layer(130, 12, 24, 30, 70, '#14102e', ['#40386a'], .12)
    layer(150, 14, 28, 36, 90, '#0a0a1c', ['#ffe080', '#ffd060', '#80d0ff', '#ff9060'], .35)
    layer(180, 10, 20, 20, 50, '#05050f', ['#ffe080', '#ffb040'], .25)
    # reflections / street glow
    for y in range(160, H):
        for x in range(0, W, 2):
            if r.random() < .08: c.px(x, y, '#ffb040')
    return c


def wall_room():
    r = random.Random(5); W, H = 320, 180
    c = Canvas(W, H)
    c.rect(0, 0, W, 132, '#3a4a68')
    for x in range(0, W, 16): c.rect(x, 0, 1, 132, '#34425e')
    c.rect(0, 132, W, 48, '#5a3a2a')
    for y in range(132, H, 6): c.rect(0, y, W, 1, '#4a2e20')
    c.rect(0, 128, W, 4, '#2a2a3a')
    # window
    c.rect(20, 22, 76, 70, '#d0c8b8'); c.rect(24, 26, 68, 62, '#102040')
    for y in range(26, 88): c.rect(24, y, 68, 1, lerp('#102040', '#4a3a7a', (y - 26) / 62))
    for _ in range(14): c.px(r.randrange(26, 90), r.randrange(28, 60), '#ffffff')
    c.rect(57, 26, 2, 62, '#d0c8b8'); c.rect(24, 56, 68, 2, '#d0c8b8')
    c.rect(18, 92, 80, 4, '#b0a898')
    # poster
    c.rect(246, 20, 40, 52, '#e8e0c8'); c.rect(249, 23, 34, 46, '#0a3a7a'); c.rect(258, 34, 16, 18, '#7ec8ff'); c.rect(260, 36, 12, 14, '#1084d0')
    c.text(253, 58, 'HACK', '#ffe040', 3); c.text(253, 63, 'FREE', '#ffffff', 3)
    # shelf with books
    c.rect(120, 40, 100, 3, '#7a4a1e')
    x = 122
    while x < 214:
        w = r.randint(3, 6); h = r.randint(14, 22)
        c.rect(x, 40 - h, w, h, r.choice(['#c02020', '#2060c0', '#20a040', '#c0a020', '#8040a0', '#e0e0e0'])); c.rect(x, 40 - h, 1, h, '#ffffff')
        x += w + 1
    # desk
    c.rect(60, 118, 240, 8, '#a8723a'); c.rect(60, 118, 240, 2, '#d0984e'); c.rect(60, 126, 240, 2, '#5a3a1a')
    c.rect(70, 126, 8, 54, '#7a4a1e'); c.rect(282, 126, 8, 54, '#7a4a1e')
    # monitor on desk
    m = crt(60, 52, '#1c5cf0', P['green'], glow=True); c.paste(m, 130, 70)
    c.rect(138, 76, 20, 2, '#80c0ff'); c.rect(138, 80, 34, 1, '#80c0ff'); c.rect(138, 83, 26, 1, '#80c0ff')
    # keyboard
    c.rect(124, 112, 70, 6, '#d9d0b8'); c.rect(124, 112, 70, 1, '#ffffff'); [c.rect(126 + i * 4, 114, 3, 1, '#a89f88') for i in range(16)]
    # lamp
    c.rect(246, 100, 3, 18, '#404040'); c.poly([(236, 88), (262, 88), (256, 100), (242, 100)], '#ffb020'); c.rect(240, 118, 14, 2, '#404040')
    c.poly([(238, 101), (260, 101), (275, 118), (225, 118)], '#a87a3a')
    # mug
    c.rect(100, 108, 8, 10, '#e0e0e0'); c.rect(108, 110, 3, 5, '#e0e0e0'); c.rect(101, 109, 6, 2, '#6a3a1a')
    return c


def build():
    save_wall('landscape', wall_landscape(), [14], 'Main retro landscape (teal default alternative = CSS #008080)')
    save_wall('campus', wall_campus(), [15], 'Alternate: campus')
    save_wall('night-city', wall_city(), [15], 'Alternate: night city')
    save_wall('computer-room', wall_room(), [15], 'Alternate: retro computer room')

    # hardware
    out('sprites/crt-off', crt(44, 38, '#0a0a0a'), [84], 'Crt', png_scale=3, note='screen off')
    out('sprites/crt-on', crt(44, 38, '#1c5cf0', P['green'], glow=True), [84], 'Crt', png_scale=3, note='screen on (glow pulse in CSS)')
    for led, n in ((False, 'tower'), (True, 'tower-on')):
        c = Canvas(24, 40); c.rect(1, 0, 22, 40, K); c.rect(2, 1, 20, 38, P['beige']); c.rect(2, 1, 20, 1, P['hi']); c.rect(2, 38, 20, 1, P['dbeige']); c.rect(21, 1, 1, 38, P['dbeige'])
        c.rect(4, 4, 16, 6, K); c.rect(5, 5, 14, 4, P['dbeige']); c.rect(5, 5, 14, 1, P['shade'])
        c.rect(4, 12, 16, 3, K); c.rect(5, 13, 14, 1, P['dark']); c.rect(7, 14, 8, 0, K)
        c.rect(4, 22, 7, 4, K); c.rect(5, 23, 5, 2, P['face']); c.rect(5, 30, 4, 4, K); c.rect(6, 31, 2, 2, P['red'] if not led else P['green'])
        c.px(17, 31, P['green'] if led else '#304030'); c.px(17, 33, '#ff9020' if led else '#403020')
        for i in range(5): c.rect(5, 17 + i, 14, 0, K)
        out(f'sprites/{n}', c, [85], 'Tower', png_scale=3, note='power LED on' if led else 'static')
    k = Canvas(56, 16); k.rect(0, 2, 56, 13, K); k.rect(1, 3, 54, 11, P['beige']); k.rect(1, 3, 54, 1, P['hi']); k.rect(1, 13, 54, 1, P['dbeige'])
    for r_ in range(3):
        for i in range(13): k.rect(3 + i * 4 + (r_ % 2) * 1, 5 + r_ * 3, 3, 2, P['face']); k.rect(3 + i * 4 + (r_ % 2), 5 + r_ * 3, 3, 1, P['hi'])
    k.rect(14, 12, 28, 1, P['face'])
    out('sprites/keyboard', k, [85], 'Keyboard', png_scale=3)
    m = Canvas(12, 18); m.ell(6, 10, 5, 7, K); m.ell(6, 10, 4, 6, P['beige']); m.rect(6, 4, 1, 5, K); m.rect(2, 9, 8, 1, K); m.rect(5, 0, 2, 4, K); m.rect(5, 0, 2, 1, P['dark'])
    out('sprites/mouse', m, [85], 'Mouse', png_scale=3)

    # storage media (12)
    def floppy(col):
        c = Canvas(24, 24); c.rect(1, 1, 22, 22, K); c.rect(2, 2, 20, 20, col)
        c.rect(6, 2, 12, 7, P['shade']); c.rect(8, 3, 3, 5, P['dark']); c.rect(4, 12, 16, 10, P['white']); c.rect(6, 14, 12, 1, P['red']); c.rect(6, 17, 9, 1, P['shade'])
        return c
    def cd(tint):
        c = Canvas(24, 24); c.ell(12, 12, 11, 11, K); c.ell(12, 12, 10, 10, '#c8d8e8'); c.poly([(12, 12), (21, 5), (22, 10)], P['hi']); c.poly([(12, 12), (3, 19), (2, 14)], tint)
        c.ell(12, 12, 3, 3, K); c.ell(12, 12, 2, 2, 'clear'); return c
    def usb(col):
        c = Canvas(24, 12); c.rect(0, 3, 6, 6, K); c.rect(1, 4, 4, 4, P['face']); c.rect(2, 5, 1, 2, P['dark']); c.rect(3, 5, 1, 2, P['dark'])
        c.rect(5, 1, 18, 10, K); c.rect(6, 2, 16, 8, col); c.rect(6, 2, 16, 1, P['hi']); c.rect(18, 5, 3, 2, P['face']); return c
    items = [('floppy-blue', floppy('#1c3a9a')), ('floppy-black', floppy('#303040')), ('floppy-red', floppy('#a02020')),
             ('cd-rom', cd('#e0b0ff')), ('cd-r', cd('#ffe080')), ('dvd', cd('#80e0c0')),
             ('usb-red', usb('#d02020')), ('usb-blue', usb('#2060d0')), ('usb-black', usb('#303040'))]
    z = Canvas(24, 24); z.rect(1, 1, 22, 22, K); z.rect(2, 2, 20, 20, P['blue']); z.rect(5, 2, 14, 6, P['face']); z.rect(4, 12, 16, 8, P['white']); z.text(6, 14, 'ZIP', P['blue'], 3); items.append(('zip-disk', z))
    h = Canvas(28, 18); h.rect(0, 1, 28, 16, K); h.rect(1, 2, 26, 14, P['dark']); h.rect(1, 2, 26, 1, P['shade']); h.rect(4, 6, 12, 2, P['face']); h.px(23, 13, P['green']); h.rect(20, 12, 4, 3, K); items.append(('external-hdd', h))
    s = Canvas(16, 20); s.rect(0, 0, 16, 20, K); s.rect(1, 1, 14, 18, P['blue']); s.rect(2, 1, 12, 1, P['sky']); s.rect(3, 3, 10, 7, P['white']); s.rect(5, 14, 6, 4, P['yellow']); s.rect(5, 15, 1, 3, P['gold']); items.append(('memory-card', s))
    for n, c in items:
        out(f'sprites/storage/{n}', c, [86], 'Storage', png_scale=3)

    # office props (10 + state frames)
    def printer(paper=False):
        c = Canvas(40, 30); c.rect(6, 0, 28, 10, K); c.rect(7, 1, 26, 9, P['white'] if not paper else P['paper']); c.rect(10, 3, 18, 1, P['shade']); c.rect(10, 6, 12, 1, P['shade'])
        c.rect(0, 10, 40, 14, K); c.rect(1, 11, 38, 12, P['beige']); c.rect(1, 11, 38, 1, P['hi']); c.rect(1, 22, 38, 1, P['dbeige']); c.rect(30, 14, 5, 2, K); c.px(32, 15, P['green'])
        c.rect(8, 22, 24, 8 if paper else 5, K); c.rect(9, 23, 22, 6 if paper else 3, P['white']);
        if paper: c.rect(11, 26, 14, 1, P['shade'])
        return c
    out('sprites/office/printer', printer(False), [87], 'Printer', png_scale=3, note='idle')
    out('sprites/office/printer-paper', printer(True), [87], 'Printer', png_scale=3, note='paper out frame')
    ph = Canvas(30, 20); ph.rect(0, 8, 30, 12, K); ph.rect(1, 9, 28, 10, P['beige']); ph.rect(0, 2, 30, 7, K); ph.rect(1, 3, 28, 5, P['beige']); ph.rect(3, 0, 24, 4, K); ph.rect(4, 1, 22, 2, P['dbeige'])
    for i in range(3):
        for j in range(4): ph.rect(11 + j * 4, 11 + i * 2, 3, 1, P['shade'])
    ph.rect(5, 12, 4, 5, P['dark']); out('sprites/office/telephone', ph, [87], 'Telephone', png_scale=3)
    for on in (False, True):
        l = Canvas(28, 34)
        if on: l.poly([(9, 15), (19, 15), (27, 30), (1, 30)], '#fff4b0')
        l.rect(5, 30, 18, 3, K); l.rect(6, 31, 16, 1, P['shade']); l.rect(13, 14, 3, 17, K); l.rect(14, 15, 1, 15, P['dark']); l.poly([(2, 4), (22, 4), (26, 14), (8, 14)], K); l.poly([(4, 5), (21, 5), (24, 13), (9, 13)], P['orange'] if on else '#a8602a')
        out(f'sprites/office/desk-lamp{"-on" if on else ""}', l, [87], 'Lamp', png_scale=3, note='lamp lit' if on else 'idle')
    pp = Canvas(30, 22)
    for i in range(3): pp.rect(2 + i * 2, 12 - i * 4 + 4, 22, 8, K); pp.rect(3 + i * 2, 13 - i * 4 + 4, 20, 6, P['white'] if i != 1 else P['paper']); pp.rect(5 + i * 2, 15 - i * 4 + 4, 12, 1, P['shade'])
    out('sprites/office/papers', pp, [87], 'Papers', png_scale=3)
    cb = Canvas(32, 20);
    for pts, col in (([(1, 4), (10, 4), (14, 12), (22, 12), (26, 6), (31, 6)], P['black']), ([(1, 9), (8, 9), (14, 16), (24, 16), (28, 10), (31, 10)], P['blue'])):
        for a, b in zip(pts, pts[1:]): cb.line(a[0], a[1], b[0], b[1], col); cb.line(a[0], a[1] + 1, b[0], b[1] + 1, col)
    cb.rect(0, 3, 3, 3, K); cb.rect(0, 8, 3, 3, K); cb.rect(29, 5, 3, 3, K); cb.rect(29, 9, 3, 3, K)
    out('sprites/office/cables', cb, [87], 'Cables', png_scale=3)
    mf = Canvas(32, 24); folder(mf, 1, 3, 30, 20, P['tan'], '#b08a40'); mf.rect(2, 8, 28, 1, P['hi']); mf.rect(10, 12, 12, 5, P['white']); mf.rect(11, 14, 10, 1, P['shade'])
    out('sprites/office/manila-folder', mf, [87], 'Folder', png_scale=3)
    mg = Canvas(20, 20); mg.rect(2, 4, 12, 14, K); mg.rect(3, 5, 10, 12, P['white']); mg.rect(14, 7, 5, 8, K); mg.rect(15, 8, 3, 6, 'clear'); mg.rect(3, 5, 10, 3, '#6a3a1a'); mg.rect(5, 10, 6, 3, P['blue']); mg.rect(5, 0, 1, 3, P['shade']); mg.rect(8, 1, 1, 2, P['shade'])
    out('sprites/office/coffee-mug', mg, [87], 'Mug', png_scale=3)
    sn = Canvas(24, 24)
    for i, col in enumerate(('#ffe040', '#ff8fa3', '#7ee0a0')):
        sn.rect(1 + i * 5, 2 + i * 6, 14, 14, K); sn.rect(2 + i * 5, 3 + i * 6, 12, 12, col); sn.rect(4 + i * 5, 6 + i * 6, 8, 1, P['shade']); sn.rect(4 + i * 5, 9 + i * 6, 6, 1, P['shade'])
    out('sprites/office/sticky-notes', sn, [87], 'Notes', png_scale=3)
    pl = Canvas(22, 30); pl.rect(4, 20, 14, 9, K); pl.rect(5, 21, 12, 7, '#b0502a'); pl.rect(4, 20, 14, 2, '#d0703a')
    for dx, dy, h_ in ((10, 6, 14), (6, 10, 10), (14, 9, 11)): pl.rect(dx, dy, 2, h_, '#145a38'); pl.ell(dx + 1, dy, 3, 3, '#2a8a50')
    pl.ell(11, 4, 4, 4, '#3aa060')
    out('sprites/office/potted-plant', pl, [87], 'Plant', png_scale=3)
    st = Canvas(28, 14); st.rect(0, 8, 28, 5, K); st.rect(1, 9, 26, 3, P['dark']); st.poly([(2, 8), (26, 2), (27, 6), (4, 10)], K); st.poly([(4, 8), (25, 3), (26, 5), (5, 9)], P['red'])
    out('sprites/office/stapler', st, [87], 'Stapler', png_scale=3)
