"""Boot sequence art: logo (3 frames), emblem, boot background, init icons, shutdown."""
from PIL import Image
from pixel import Canvas, P, out, write_image
from art_common import crt, shield, check


def emblem(bright=False, size=16):
    c = Canvas(size, size)
    fill = '#3fa8ff' if bright else P['blue']
    shield(c, 1, 0, 14, 16, fill, P['black'], hi=P['sky'] if bright else '#59b0ee')
    # keyhole
    c.ell(8, 6, 2, 2, P['white']); c.rect(7, 8, 3, 4, P['white'])
    c.px(8, 6, fill)
    # gold rim highlight
    c.rect(2, 1, 12, 1, P['yellow'] if bright else P['gold'])
    return c


def lettering(text, scale=2, dim=0.0):
    w = Canvas.text_width(text) * scale + scale * 2
    c = Canvas(w, 7 * scale + scale * 2)
    base = Canvas(Canvas.text_width(text), 7).text(0, 0, text, '#fff')
    grad = ['#ffffff', '#e8f4ff', '#bfe0ff', '#8fc8ff', '#5fb0f5', '#3f98e0', '#2f80c8']
    for y in range(7):
        for x in range(base.w):
            if base.g[y][x]:
                col_main = grad[y]
                if dim:
                    from pixel import hexrgb, rgbhex
                    r, g, b = hexrgb(col_main)
                    col_main = rgbhex((int(r * (1 - dim) + 20 * dim), int(g * (1 - dim) + 20 * dim), int(b * (1 - dim) + 50 * dim)))
                c.rect(x * scale + scale, y * scale + scale, scale, scale, P['navy'])  # drop shadow
    for y in range(7):
        for x in range(base.w):
            if base.g[y][x]:
                col_main = grad[y]
                if dim:
                    from pixel import hexrgb, rgbhex
                    r, g, b = hexrgb(col_main)
                    col_main = rgbhex((int(r * (1 - dim) + 20 * dim), int(g * (1 - dim) + 20 * dim), int(b * (1 - dim) + 50 * dim)))
                c.rect(x * scale, y * scale, scale, scale, col_main)
    return c


def logo(frame):
    """frame 1 = dark screen, 2 = blue screen, 3 = lit logo."""
    c = Canvas(128, 88)
    screen = {1: '#0a0a0a', 2: '#0000a8', 3: '#1c5cf0'}[frame]
    m = crt(44, 38, screen=screen, led=P['green'] if frame >= 2 else P['shade'], glow=(frame == 3))
    c.paste(m, 42, 0)
    if frame == 3:
        e = emblem(True)
        c.paste(e, 56, 7)
    dim = {1: 0.82, 2: 0.55, 3: 0.0}[frame]
    t = lettering('CYBERDESK', 2, dim)
    c.paste(t, (128 - t.w) // 2, 44)
    tag = Canvas(Canvas.text_width('SECURITY TRAINING EDITION', 3), 5).text(0, 0, 'SECURITY TRAINING EDITION', P['sky'] if frame == 3 else P['shade'], 3)
    c.paste(tag, (128 - tag.w) // 2, 70)
    return c


def init_icon(kind):
    c = Canvas(16, 16)
    o = P['black']
    if kind == 'memory':
        c.rect(1, 4, 14, 8, o); c.rect(2, 5, 12, 6, P['dgreen'])
        for i in range(4): c.rect(3 + i * 3, 6, 2, 3, P['black']); c.rect(3 + i * 3, 6, 2, 1, P['dark'])
        for i in range(7): c.px(2 + i * 2, 12, P['yellow']); c.px(2 + i * 2, 13, P['yellow'])
    elif kind == 'storage':
        c.rect(1, 3, 14, 10, o); c.rect(2, 4, 12, 8, P['face']); c.rect(2, 4, 12, 1, P['hi'])
        c.rect(4, 6, 8, 3, P['shade']); c.rect(5, 7, 6, 1, P['dark'])
        c.rect(3, 10, 3, 1, P['dark']); c.px(12, 10, P['green'])
    elif kind == 'network':
        c.rect(2, 2, 12, 8, o); c.rect(3, 3, 10, 6, P['sky']); c.rect(6, 10, 4, 2, P['shade'])
        c.rect(1, 13, 14, 2, P['dark'])
        c.ell(8, 6, 2, 2, P['blue'], fill=False); c.rect(6, 6, 5, 1, P['blue']); c.rect(8, 3, 1, 6, P['blue'])
    elif kind == 'audio':
        c.rect(2, 6, 3, 4, o); c.poly([(5, 6), (9, 2), (9, 13), (5, 10)], o)
        c.rect(3, 7, 2, 2, P['face']); c.poly([(6, 7), (8, 4), (8, 11), (6, 9)], P['face'])
        c.line(11, 5, 11, 10, P['dark']); c.line(13, 3, 13, 12, P['dark'])
    elif kind == 'display':
        c.rect(1, 2, 14, 10, o); c.rect(2, 3, 12, 8, P['face']); c.rect(3, 4, 10, 6, P['navy'])
        c.rect(4, 5, 4, 2, P['blue']); c.rect(6, 12, 4, 2, P['shade']); c.rect(4, 14, 8, 1, P['dark'])
    elif kind == 'security':
        shield(c, 2, 1, 12, 14, P['blue'], o, hi=P['sky'])
        c.rect(7, 5, 2, 5, P['white']); c.rect(5, 7, 6, 2, P['white'])
    return c


def build():
    # logo frames
    for f in (1, 2, 3):
        out(f'boot/logo-frame{f}', logo(f), [1], 'BootScreen/Logo', png_scale=3,
            note={1: 'screen dark', 2: 'blue screen', 3: 'logo illuminated'}[f])
    # canonical logo = lit
    out('boot/logo', logo(3), [1], 'BootScreen/Logo', png_scale=3, note='final frame (canonical)')
    out('boot/emblem', emblem(), [2], 'Emblem', png_scale=4, note='frame 1 / 3')
    out('boot/emblem-bright', emblem(True), [2], 'Emblem', png_scale=4, note='frame 2 highlight')

    # boot background: black with faint scanlines + vignette (PNG), plus 1x4 scanline tile
    W, H = 320, 180
    im = Image.new('RGBA', (W, H), (0, 0, 0, 255))
    px = im.load()
    for y in range(H):
        for x in range(W):
            d = ((x - W / 2) / (W / 2)) ** 2 + ((y - H / 2) / (H / 2)) ** 2
            v = max(0, int(14 - d * 10))
            if y % 2 == 0: v = max(0, v - 4)
            px[x, y] = (v // 2, v, v // 2 + 2, 255)
    write_image('boot/boot-bg.png', im.resize((W * 2, H * 2), Image.NEAREST), [3], 'BootScreen/Background', note='CRT boot background')
    tile = Image.new('RGBA', (1, 4), (0, 0, 0, 0))
    tile.putpixel((0, 2), (0, 0, 0, 70)); tile.putpixel((0, 3), (0, 0, 0, 40))
    write_image('boot/scanlines-tile.png', tile, [12, 3], 'CrtOverlay', note='1x4 repeating scanline tile')

    # init icons: gray -> colour -> check
    for k, n in (('memory', 'MEM'), ('storage', 'DISK'), ('network', 'NET'), ('audio', 'SND'), ('display', 'GFX'), ('security', 'SEC')):
        ic = init_icon(k)
        out(f'boot/init/{k}-gray', ic.gray(), [8], 'BootScreen/InitIcon', png_scale=3, note='frame 1')
        out(f'boot/init/{k}', ic, [8], 'BootScreen/InitIcon', png_scale=3, note='frame 2 colour')
        chk = ic.copy(); chk.rect(9, 9, 7, 7, P['black']); chk.rect(10, 10, 5, 5, P['dgreen']); check(chk, 10, 11, P['white'], 4)
        out(f'boot/init/{k}-check', chk, [8], 'BootScreen/InitIcon', png_scale=3, note='frame 3 check')

    # disk activity LED
    for n, col in (('off', '#304030'), ('on', P['green'])):
        c = Canvas(8, 8); c.rect(1, 1, 6, 6, P['black']); c.rect(2, 2, 4, 4, col)
        if n == 'on': c.px(2, 2, P['hi'])
        out(f'boot/disk-led-{n}', c, [7], 'DiskLed', png_scale=4, note='drive activity light')

    # shutdown screen bg (PNG)
    W, H = 160, 90
    c = Canvas(W, H, '#000000')
    e = emblem(); c.paste(e, W // 2 - 8, 22)
    for i, (t, col) in enumerate((('YOU MAY NOW SAFELY', P['orange']), ('POWER OFF CYBERDESK', P['orange']))):
        s = Canvas(Canvas.text_width(t), 7).text(0, 0, t, col)
        c.paste(s, (W - s.w) // 2, 46 + i * 11)
    out('boot/shutdown', c, [11], 'ShutdownScreen', png_scale=6, note='shutdown still (final frame)', svg=True)
