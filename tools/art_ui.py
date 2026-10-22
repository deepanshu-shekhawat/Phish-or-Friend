"""UI glyphs: window controls, toolbar, nav, attachments, threat categories, evidence indicators, cursors."""
from pixel import Canvas, P, out, write_cur, write_image, write_text
from art_common import shield, check, cross, magnifier, folder, envelope, gear
import art_icons as AI

K = P['black']


# ------------------------------------------------------------ window glyphs (black, recoloured with CSS mask)
def glyph_min():
    c = Canvas(8, 7); c.rect(0, 5, 6, 2, K); return c
def glyph_max():
    c = Canvas(9, 8); c.box(0, 0, 9, 8, K); c.rect(0, 0, 9, 2, K); return c
def glyph_restore():
    c = Canvas(9, 8); c.box(2, 0, 7, 6, K); c.rect(2, 0, 7, 2, K); c.rect(0, 2, 7, 6, P['face']); c.box(0, 2, 7, 6, K); c.rect(0, 2, 7, 2, K); return c
def glyph_close():
    c = Canvas(8, 7); c.line(0, 0, 7, 6, K); c.line(1, 0, 7, 5, K); c.line(0, 1, 6, 6, K); c.line(7, 0, 0, 6, K); c.line(6, 0, 0, 5, K); c.line(7, 1, 1, 6, K); return c
def glyph_check():
    c = Canvas(7, 7); check(c, 0, 1, K, 5); check(c, 0, 2, K, 5); return c
def glyph_dot():
    c = Canvas(4, 4); c.rect(0, 1, 4, 2, K); c.rect(1, 0, 2, 4, K); return c
def glyph_arrow(d):
    if d in 'ud':
        c = Canvas(7, 4)
        if d == 'u':
            c.px(3, 0, K); c.rect(2, 1, 3, 1, K); c.rect(1, 2, 5, 1, K); c.rect(0, 3, 7, 1, K)
        else:
            c.rect(0, 0, 7, 1, K); c.rect(1, 1, 5, 1, K); c.rect(2, 2, 3, 1, K); c.px(3, 3, K)
    else:
        c = Canvas(4, 7)
        if d == 'l':
            c.px(0, 3, K); c.rect(1, 2, 1, 3, K); c.rect(2, 1, 1, 5, K); c.rect(3, 0, 1, 7, K)
        else:
            c.rect(0, 0, 1, 7, K); c.rect(1, 1, 1, 5, K); c.rect(2, 2, 1, 3, K); c.px(3, 3, K)
    return c


# ------------------------------------------------------------ 16x16 toolbar / nav
def tb(name):
    c = Canvas(16, 16)
    if name == 'reply':
        c.poly([(1, 7), (7, 2), (7, 12)], P['blue']); c.rect(7, 5, 5, 5, P['blue']); c.rect(11, 5, 3, 8, P['blue'])
        c.rect(7, 5, 4, 5, P['blue']); c.rect(10, 7, 4, 6, P['blue']); c.rect(7, 10, 7, 3, P['blue'])
        c.outline(K)
    elif name == 'reply_all':
        c.poly([(0, 7), (5, 3), (5, 11)], P['blue']); c.poly([(5, 7), (10, 3), (10, 11)], P['blue']); c.rect(10, 5, 4, 6, P['blue']); c.rect(10, 9, 5, 4, P['blue']); c.outline(K)
    elif name == 'forward':
        c.poly([(14, 7), (8, 2), (8, 12)], P['blue']); c.rect(5, 5, 4, 5, P['blue']); c.rect(2, 7, 4, 6, P['blue']); c.rect(2, 10, 7, 3, P['blue']); c.outline(K)
    elif name == 'delete':
        c.poly([(3, 4), (12, 4), (11, 14), (4, 14)], K); c.poly([(4, 5), (11, 5), (10, 13), (5, 13)], P['face'])
        for x in (6, 8): c.rect(x, 6, 1, 6, P['shade'])
        c.rect(2, 2, 12, 2, K); c.rect(6, 0, 4, 2, K)
    elif name == 'archive':
        c.rect(1, 2, 14, 4, K); c.rect(2, 3, 12, 2, P['tan']); c.rect(2, 6, 12, 8, K); c.rect(3, 6, 10, 7, P['tan'])
        c.rect(6, 8, 4, 1, K); c.poly([(5, 9), (10, 9), (7, 12)], P['dgreen'])
    elif name == 'compose':
        c.rect(1, 2, 10, 12, K); c.rect(2, 3, 8, 10, P['white']); [c.rect(3, 5 + i * 2, 6, 1, P['shade']) for i in range(4)]
        c.line(7, 12, 13, 4, P['gold']); c.line(8, 12, 14, 4, P['yellow']); c.line(6, 13, 7, 12, K); c.px(14, 3, K)
    elif name == 'search':
        magnifier(c, 6, 6, 4, P['sky'], K)
    elif name == 'report':
        c.rect(3, 1, 1, 14, K); c.rect(4, 2, 9, 7, P['red']); c.rect(4, 2, 9, 1, '#ff6060'); c.rect(8, 3, 1, 3, P['white']); c.rect(8, 7, 1, 1, P['white'])
        c.rect(2, 14, 4, 1, K)
    elif name == 'print':
        c.rect(4, 1, 8, 5, K); c.rect(5, 2, 6, 3, P['white']); c.rect(1, 6, 14, 6, K); c.rect(2, 7, 12, 4, P['face']); c.rect(4, 10, 8, 5, K); c.rect(5, 11, 6, 3, P['white'])
    elif name == 'mark_unread':
        envelope(c, 1, 3, 14, 10, P['white'], P['shade']); c.rect(10, 1, 5, 5, K); c.rect(11, 2, 3, 3, P['red'])
    elif name == 'back':
        c.poly([(1, 7), (8, 1), (8, 13)], P['dgreen']); c.rect(8, 4, 6, 7, P['dgreen']); c.outline(K)
    elif name == 'forward_nav':
        c.poly([(14, 7), (7, 1), (7, 13)], P['dgreen']); c.rect(2, 4, 6, 7, P['dgreen']); c.outline(K)
    elif name == 'refresh':
        c.ell(7, 8, 5, 5, K, fill=False); c.rect(2, 8, 12, 0, K); c.poly([(9, 1), (14, 4), (9, 6)], K); c.poly([(10, 2), (12, 4), (10, 5)], P['dgreen']); c.rect(4, 10, 3, 3, 'clear')
    elif name == 'home':
        c.poly([(7, 1), (14, 8), (0, 8)], K); c.poly([(7, 3), (11, 7), (3, 7)], P['red']); c.rect(3, 8, 9, 6, K); c.rect(4, 8, 7, 5, P['tan']); c.rect(6, 10, 3, 4, K)
    elif name == 'stop':
        c.poly([(5, 0), (10, 0), (15, 5), (15, 10), (10, 15), (5, 15), (0, 10), (0, 5)], K); c.poly([(5, 2), (10, 2), (13, 5), (13, 10), (10, 13), (5, 13), (2, 10), (2, 5)], P['red'])
        cross(c, 5, 5, P['white'], 5)
    elif name == 'lock':
        c.rect(3, 7, 10, 8, K); c.rect(4, 8, 8, 6, P['yellow']); c.rect(5, 2, 6, 6, K); c.rect(6, 3, 4, 5, P['face']); c.rect(7, 10, 2, 3, K)
    elif name == 'lock_open':
        c.rect(3, 7, 10, 8, K); c.rect(4, 8, 8, 6, P['yellow']); c.rect(8, 2, 6, 6, K); c.rect(9, 3, 4, 3, P['face']); c.rect(7, 10, 2, 3, K); c.rect(13, 7, 1, 1, P['face'])
    elif name == 'star':
        c.poly([(7, 0), (9, 5), (14, 5), (10, 9), (12, 14), (7, 11), (2, 14), (4, 9), (0, 5), (5, 5)], K); c.poly([(7, 2), (8, 6), (12, 6), (9, 8), (10, 12), (7, 10), (4, 12), (5, 8), (2, 6), (6, 6)], P['yellow'])
    elif name == 'new_tab':
        c.rect(1, 3, 13, 10, K); c.rect(2, 4, 11, 8, P['white']); c.rect(5, 7, 5, 1, P['dgreen']); c.rect(7, 5, 1, 5, P['dgreen'])
    elif name == 'download':
        c.rect(6, 0, 4, 8, P['dgreen']); c.poly([(2, 7), (13, 7), (7, 13)], P['dgreen']); c.outline(K); c.rect(2, 14, 12, 2, K)
    elif name == 'user':
        c.ell(7, 4, 3, 3, K); c.ell(7, 4, 2, 2, P['tan']); c.rect(2, 9, 11, 6, K); c.rect(3, 10, 9, 5, P['blue'])
    return c


TOOLBAR = ['reply', 'reply_all', 'forward', 'delete', 'archive', 'compose', 'search', 'report', 'print', 'mark_unread']
NAV = ['back', 'forward_nav', 'refresh', 'home', 'stop', 'lock', 'lock_open', 'star', 'new_tab', 'download', 'user']


# ------------------------------------------------------------ attachment chips (16x16)
def att(kind):
    c = Canvas(16, 16)
    a = {'pdf': ('P', P['red']), 'doc': ('W', P['blue']), 'xls': ('X', P['dgreen']), 'zip': ('Z', P['gold']), 'exe': ('E', P['dark']),
         'txt': ('T', P['shade']), 'js': ('S', P['purple']), 'html': ('H', P['orange']), 'unknown': ('?', P['shade'])}
    if kind == 'img':
        c.rect(1, 1, 14, 14, K); c.rect(2, 2, 12, 12, P['sky']); c.poly([(2, 13), (6, 8), (10, 13)], P['dgreen']); c.poly([(7, 13), (11, 9), (13, 13)], P['green']); c.rect(10, 4, 2, 2, P['yellow'])
        return c
    L, col = a[kind]
    c.rect(2, 0, 12, 16, K); c.rect(3, 1, 10, 14, P['white'])
    c.rect(3, 1, 10, 4, col)
    c.text(6, 6, L, col, 3)
    w = 3; c.text(8 - w // 2 - 0, 8, L, col, 3)
    c.rect(4, 13, 8, 1, P['mid'])
    return c


ATTACH = ['pdf', 'doc', 'img', 'xls', 'zip', 'exe', 'txt', 'js', 'html', 'unknown']


# ------------------------------------------------------------ threat categories (32x32)
def threat(name):
    c = Canvas(32, 32)
    if name == 'credential':
        c.ell(10, 12, 7, 7, K); c.ell(10, 12, 6, 6, P['yellow']); c.ell(10, 12, 2, 2, K)
        c.rect(15, 11, 15, 4, K); c.rect(16, 12, 13, 2, P['yellow']); c.rect(24, 15, 3, 5, K); c.rect(25, 15, 1, 4, P['yellow']); c.rect(28, 15, 2, 4, K)
        c.rect(8, 8, 2, 2, P['hi'])
    elif name == 'impersonation':
        c.ell(16, 10, 6, 7, K); c.ell(16, 10, 5, 6, P['tan']); c.poly([(5, 30), (6, 21), (16, 18), (26, 21), (27, 30)], K); c.poly([(7, 29), (8, 22), (16, 19), (24, 22), (25, 29)], P['dark'])
        c.rect(11, 8, 10, 3, K); c.rect(12, 9, 3, 1, P['red']); c.rect(17, 9, 3, 1, P['red'])  # mask eyes
        c.rect(10, 4, 12, 4, K); c.rect(11, 5, 10, 2, P['dark'])
    elif name == 'link':
        c.ell(10, 20, 6, 4, K, fill=False); c.ell(22, 12, 6, 4, K, fill=False); c.rect(12, 16, 8, 4, P['white']); c.line(11, 19, 21, 13, P['shade']); c.line(11, 20, 21, 14, P['red'])
        c.rect(14, 15, 4, 4, P['red']); c.rect(15, 16, 2, 2, P['white'])
    elif name == 'attachment':
        c.rect(6, 6, 18, 22, K); c.rect(7, 7, 16, 20, P['white']); c.rect(9, 9, 12, 1, P['shade']); c.rect(9, 12, 9, 1, P['shade'])
        c.rect(14, 2, 2, 14, P['shade']); c.ell(15, 3, 2, 2, P['shade'], fill=False)
        c.poly([(22, 18), (30, 31), (14, 31)], K); c.poly([(22, 21), (27, 29), (17, 29)], P['yellow']); c.rect(21, 23, 2, 3, K); c.rect(21, 27, 2, 1, K)
    elif name == 'payment':
        c.rect(2, 7, 28, 19, K); c.rect(3, 8, 26, 17, P['blue']); c.rect(3, 11, 26, 4, K); c.rect(5, 19, 8, 2, P['yellow']); c.rect(5, 22, 12, 1, P['sky'])
        c.ell(23, 21, 3, 3, P['yellow'], fill=True); c.rect(23, 18, 1, 7, P['gold'])
    elif name == 'social':
        c.poly([(2, 3), (28, 3), (28, 20), (14, 20), (8, 27), (9, 20), (2, 20)], K); c.poly([(4, 5), (26, 5), (26, 18), (13, 18), (10, 22), (10, 18), (4, 18)], P['white'])
        c.line(10, 8, 10, 14, P['red']); c.ell(10, 15, 2, 2, P['red'], fill=False); c.rect(8, 8, 5, 1, P['red'])
        c.rect(15, 9, 8, 1, P['shade']); c.rect(15, 12, 6, 1, P['shade'])
    elif name == 'spoof':
        AI.globe(c, 14, 15, 11); c.rect(18, 22, 13, 9, K); c.rect(19, 23, 11, 7, P['yellow']); c.rect(24, 24, 1, 3, K); c.rect(24, 28, 1, 1, K)
    elif name == 'other':
        c.rect(3, 3, 26, 26, K); c.rect(4, 4, 24, 24, P['face']); c.rect(4, 4, 24, 1, P['hi'])
        c.paste(Canvas(5, 7).text(0, 0, '?', P['navy']).scaled(3), 8, 6)
    return c


THREATS = ['credential', 'impersonation', 'link', 'attachment', 'payment', 'social', 'spoof', 'other']


# ------------------------------------------------------------ evidence indicators (16x16)
def evid(name):
    c = Canvas(16, 16)
    if name == 'known':
        shield(c, 1, 0, 14, 16, P['dgreen'], K, hi=P['lime']); check(c, 4, 4, P['white'], 7)
    elif name == 'suspicious':
        c = AI.st('suspicious')
    elif name == 'unknown':
        c = AI.st('unknown')
    elif name == 'mismatch':
        c.ell(7, 7, 7, 7, K); c.ell(7, 7, 6, 6, P['red']); c.rect(3, 5, 9, 2, P['white']); c.rect(3, 9, 9, 2, P['white']); c.line(11, 3, 3, 12, P['white'])
        c.line(10, 2, 4, 12, K)
    elif name == 'clue':
        c = AI.st('evidence')
    elif name == 'cert':
        c.rect(1, 2, 14, 11, K); c.rect(2, 3, 12, 9, P['paper']); c.rect(4, 5, 8, 1, P['shade']); c.rect(4, 7, 6, 1, P['shade']); c.ell(11, 11, 2, 2, P['red']); c.rect(10, 13, 1, 3, P['red']); c.rect(12, 13, 1, 3, P['red'])
    return c


EVIDENCE = ['known', 'suspicious', 'unknown', 'mismatch', 'clue', 'cert']


# ------------------------------------------------------------ cursors (drawn 16x24 grid, exported @2x)
def parse(rows, key):
    c = Canvas(max(len(r) for r in rows), len(rows))
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch in key: c.px(x, y, key[ch])
    return c


K1 = {'x': K, 'o': P['white']}
ARROW = """
x...........
xx..........
xox.........
xoox........
xooox.......
xoooox......
xooooox.....
xoooooox....
xooooooox...
xoooooooox..
xooooooooox.
xooooooxxxxx
xoooxooxx...
xooxxxoox...
xoxx.xoox...
xx....xoox..
x.....xoox..
.......xx...
""".strip('\n').split('\n')


def cursor(name, frame=0):
    if name == 'arrow':
        return parse(ARROW, K1), (0, 0)
    if name == 'hand':
        c = Canvas(18, 20)
        c.rect(6, 1, 3, 9, P['white']); c.rect(3, 9, 12, 8, P['white']); c.rect(9, 8, 3, 3, P['white']); c.rect(12, 9, 3, 3, P['white']); c.rect(1, 11, 3, 3, P['white']); c.rect(4, 17, 9, 1, P['white'])
        c.outline(K)
        c.line(10, 10, 10, 15, P['shade']); c.line(13, 11, 13, 15, P['shade'])
        return c, (7, 0)
    if name == 'ibeam':
        c = Canvas(9, 18); c.rect(0, 0, 9, 1, P['white']); c.rect(0, 16, 9, 1, P['white']); c.rect(4, 0, 1, 17, P['white']); c.outline(K)
        c.rect(1, 1, 7, 1, K)
        return c, (4, 8)
    if name == 'busy':
        c = Canvas(14, 20)
        top = [(2, 3), (11, 3), (8, 9), (5, 9)]
        bot = [(5, 11), (8, 11), (11, 17), (2, 17)]
        c.poly(top, P['white']); c.poly(bot, P['white'])
        ty = [4, 6, 7, 9][frame % 4]      # sand level in top chamber falls
        by = [16, 14, 13, 12][frame % 4]  # sand pile in bottom chamber rises
        for y in range(3, 10):
            for x in range(14):
                if c.get(x, y) == P['white'] and y >= ty: c.px(x, y, P['yellow'])
        for y in range(11, 18):
            for x in range(14):
                if c.get(x, y) == P['white'] and y >= by: c.px(x, y, P['yellow'])
        c.rect(6, 9, 2, 2, P['yellow'] if frame % 4 < 3 else P['white'])
        c.rect(1, 1, 12, 2, K); c.rect(1, 17, 12, 2, K)
        c.line(2, 3, 5, 9, K); c.line(11, 3, 8, 9, K); c.line(5, 11, 2, 17, K); c.line(8, 11, 11, 17, K)
        c.rect(5, 9, 1, 2, K); c.rect(8, 9, 1, 2, K)
        return c, (7, 10)
    if name == 'forbidden':
        c = Canvas(16, 16); c.ell(8, 8, 7, 7, K); c.ell(8, 8, 5, 5, P['white']); c.ell(8, 8, 5, 5, P['red'], fill=False); c.ell(8, 8, 6, 6, P['red'], fill=False)
        c.line(4, 12, 12, 4, P['red']); c.line(4, 11, 11, 4, P['red']); c.line(5, 12, 12, 5, P['red'])
        return c, (8, 8)
    if name in ('resize_ns', 'resize_ew', 'resize_nwse', 'resize_nesw'):
        base = Canvas(15, 15)
        if name == 'resize_ns':
            base.rect(7, 2, 1, 11, P['white']); base.poly([(7, 0), (3, 4), (11, 4)], P['white']); base.poly([(7, 14), (3, 10), (11, 10)], P['white'])
        elif name == 'resize_ew':
            base.rect(2, 7, 11, 1, P['white']); base.poly([(0, 7), (4, 3), (4, 11)], P['white']); base.poly([(14, 7), (10, 3), (10, 11)], P['white'])
        else:
            base.line(3, 3, 11, 11, P['white']); base.line(4, 3, 12, 11, P['white']); base.line(3, 4, 11, 12, P['white'])
            base.poly([(0, 0), (6, 0), (0, 6)], P['white']); base.poly([(14, 14), (8, 14), (14, 8)], P['white'])
            if name == 'resize_nesw': base = base.flip()
        base.outline(K)
        return base, (7, 7)
    if name == 'crosshair':
        c = Canvas(17, 17); c.rect(8, 0, 1, 6, P['white']); c.rect(8, 11, 1, 6, P['white']); c.rect(0, 8, 6, 1, P['white']); c.rect(11, 8, 6, 1, P['white']); c.px(8, 8, P['white'])
        c.outline(K)
        return c, (8, 8)
    raise KeyError(name)


CURSORS = ['arrow', 'hand', 'ibeam', 'busy', 'forbidden', 'resize_ns', 'resize_ew', 'resize_nwse', 'resize_nesw', 'crosshair']


def build():
    for n, f in (('minimize', glyph_min), ('maximize', glyph_max), ('restore', glyph_restore), ('close', glyph_close)):
        out(f'window/glyph-{n}', f(), [33], 'WindowControls', png_scale=4, note='black glyph; recolour via CSS mask')
    out('window/glyph-check', glyph_check(), [36], 'Checkbox', png_scale=4)
    out('window/glyph-radio', glyph_dot(), [36], 'Radio', png_scale=4)
    for d, n in (('u', 'up'), ('d', 'down'), ('l', 'left'), ('r', 'right')):
        out(f'window/glyph-arrow-{n}', glyph_arrow(d), [37, 36], 'Scrollbar/Select', png_scale=4)
    for n in TOOLBAR:
        out(f'toolbar/{n}', tb(n), [46], 'MailToolbar', png_scale=2, note='16x16')
    for n in NAV:
        out(f'toolbar/{n}', tb(n), [50, 51, 52], 'BrowserToolbar', png_scale=2, note='16x16')
    for n in ATTACH:
        out(f'icons/attach/{n}', att(n), [45], 'AttachmentChip', png_scale=2, note='16x16 attachment chip')
    for n in THREATS:
        out(f'security/threat-{n}', threat(n), [68], 'ThreatCategory', png_scale=2, note='32x32')
    for n in EVIDENCE:
        out(f'investigation/evidence-{n}', evid(n), [64], 'EvidenceIndicator', png_scale=4, note='16x16')
    # cursors
    css = []
    for n in CURSORS:
        frames = 4 if n == 'busy' else 1
        for f in range(frames):
            c, hot = cursor(n, f)
            name = n if frames == 1 else f'{n}-{f}'
            out(f'cursors/{name}', c, [29], 'Cursors', png_scale=2, svg=True)
            write_cur(f'cursors/{name}.cur', c, hot, 2)
            css.append((name, hot))
    return dict(toolbar=TOOLBAR, nav=NAV, attach=ATTACH, threats=THREATS, evidence=EVIDENCE, cursors=css)
