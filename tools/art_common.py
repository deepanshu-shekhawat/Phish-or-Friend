"""Reusable pixel-art parts shared by many assets."""
from pixel import Canvas, P


def shield(c, x, y, w, h, fill, border=P['black'], hi=None):
    """Shield: flat top, pointed bottom. Drawn inside box (x,y,w,h)."""
    mid = x + w // 2
    pts = [(x, y), (x + w - 1, y), (x + w - 1, y + h // 2), (mid, y + h - 1), (x, y + h // 2)]
    c.poly(pts, border)
    pts2 = [(x + 1, y + 1), (x + w - 2, y + 1), (x + w - 2, y + h // 2 - 1), (mid, y + h - 3), (x + 1, y + h // 2 - 1)]
    if w >= 8: c.poly(pts2, fill)
    else: c.rect(x + 1, y + 1, w - 2, h // 2 - 1, fill)
    if hi: c.rect(x + 2, y + 2, 1, max(1, h // 3), hi)
    return c


def check(c, x, y, col, size=5):
    """Check mark whose bottom vertex is at (x+size//2, y+size-1)."""
    m = size // 2
    c.line(x, y + m, x + m, y + size - 1, col)
    c.line(x + m, y + size - 1, x + size + m - 1, y, col)
    return c


def cross(c, x, y, col, size=5):
    c.line(x, y, x + size - 1, y + size - 1, col)
    c.line(x + size - 1, y, x, y + size - 1, col)
    return c


def crt(w=40, h=34, screen=P['black'], led=P['shade'], glow=False):
    """Beige CRT monitor sprite of size w x h (includes stand)."""
    c = Canvas(w, h)
    bh = h - 7
    c.rect(1, 0, w - 2, bh, P['beige']); c.rect(0, 1, w, bh - 2, P['beige'])
    c.rect(1, 0, w - 2, 1, P['hi']); c.rect(0, 1, 1, bh - 2, P['hi'])
    c.rect(w - 1, 1, 1, bh - 2, P['dbeige']); c.rect(1, bh - 1, w - 2, 1, P['dbeige'])
    # screen bezel + glass
    sx, sy, sw, sh = 4, 3, w - 8, bh - 9
    c.rect(sx - 1, sy - 1, sw + 2, sh + 2, P['dbeige'])
    c.rect(sx, sy, sw, sh, P['dark'])
    c.rect(sx + 1, sy + 1, sw - 2, sh - 2, screen)
    if glow:
        c.box(sx + 1, sy + 1, sw - 2, sh - 2, P['sky'])
    # shine
    c.rect(sx + 2, sy + 2, 3, 1, P['hi']); c.rect(sx + 2, sy + 3, 1, 2, P['hi'])
    # controls + led
    c.rect(w - 9, bh - 6, 2, 2, led)
    c.rect(5, bh - 6, 8, 2, P['dbeige'])
    # neck + base
    c.rect(w // 2 - 5, bh, 10, 2, P['dbeige'])
    c.rect(w // 2 - 9, bh + 2, 18, 3, P['beige'])
    c.rect(w // 2 - 9, bh + 2, 18, 1, P['hi'])
    c.rect(w // 2 - 9, bh + 4, 18, 1, P['dbeige'])
    c.rect(w // 2 - 8, bh + 5, 16, 1, P['dark'])
    return c


def page(c, x, y, w, h, fill=P['white'], fold=6, border=P['black'], lines=0):
    """Document page with folded top-right corner."""
    c.rect(x, y, w, h, border)
    c.rect(x + 1, y + 1, w - 2, h - 2, fill)
    fx = x + w - fold
    for r in range(fold):
        for k in range(fold):
            col = fx + k
            if k > r: c.px(col, y + r, 'clear')
            elif k == r: c.px(col, y + r, border)
            elif k == 0: c.px(col, y + r, border)
            else: c.px(col, y + r, P['mid'])
    c.rect(fx, y + fold, 1, 1, border)
    for i in range(lines):
        c.rect(x + 3, y + fold + 3 + 3 * i, w - 7, 1, P['shade'])
    return c


def folder(c, x, y, w, h, body=P['yellow'], dark=P['gold']):
    c.rect(x, y, w // 2, 3, P['black'])
    c.rect(x + 1, y + 1, w // 2 - 2, 2, dark)
    c.rect(x, y + 2, w, h - 2, P['black'])
    c.rect(x + 1, y + 3, w - 2, h - 4, body)
    c.rect(x + 1, y + 3, w - 2, 1, P['hi'])
    c.rect(x + 1, y + h - 2, w - 2, 1, dark)
    return c


def envelope(c, x, y, w, h, body=P['white'], line=P['shade']):
    c.rect(x, y, w, h, P['black'])
    c.rect(x + 1, y + 1, w - 2, h - 2, body)
    mid = x + w // 2
    for i in range(w // 2 - 1):
        c.px(x + 1 + i, y + 1 + i, line); c.px(x + w - 2 - i, y + 1 + i, line)
    return c


def gear(c, cx, cy, r, col=P['shade'], hi=P['face'], hole=P['black']):
    import math
    for a in range(0, 360, 45):
        dx, dy = round(math.cos(math.radians(a)) * (r)), round(math.sin(math.radians(a)) * (r))
        c.rect(cx + dx - 1, cy + dy - 1, 3, 3, col)
    c.ell(cx, cy, r - 1, r - 1, col)
    c.ell(cx, cy, r - 3, r - 3, hi)
    c.ell(cx, cy, 1, 1, hole)
    return c


def magnifier(c, cx, cy, r, lens=P['sky'], frame=P['dark']):
    c.ell(cx, cy, r, r, frame)
    c.ell(cx, cy, r - 1, r - 1, lens)
    c.px(cx - 2, cy - 2, P['hi']); c.px(cx - 1, cy - 2, P['hi'])
    c.line(cx + r - 1, cy + r - 1, cx + r + 5, cy + r + 5, P['brown'])
    c.line(cx + r, cy + r - 1, cx + r + 5, cy + r + 4, P['black'])
    return c


def speaker(c, x, y, col=P['shade']):
    c.rect(x, y + 3, 3, 4, col); c.poly([(x + 3, y + 3), (x + 6, y), (x + 6, y + 9), (x + 3, y + 6)], col)
    c.line(x + 8, y + 3, x + 8, y + 6, col); c.line(x + 10, y + 1, x + 10, y + 8, col)
    return c
