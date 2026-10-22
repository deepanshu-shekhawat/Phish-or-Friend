"""Tiny pixel-art toolkit for the CyberDesk asset library.

Every asset is drawn on a Canvas (grid of hex colours / None) and exported as
crisp SVG (merged horizontal runs) and nearest-neighbour PNG.  Keeping all art
in code means: one palette, one pixel density, fully reproducible sources.
"""
import os, struct, io
from PIL import Image

# ---------------------------------------------------------------- palette
P = dict(
    face='#c0c0c0', hi='#ffffff', mid='#dfdfdf', shade='#808080', dark='#404040', black='#000000',
    navy='#000080', blue='#1084d0', sky='#7ec8ff', teal='#008080', deep='#004a4a',
    green='#33ff66', dgreen='#008a2e', lime='#9be564', red='#e02020', dred='#800000', pink='#ff8fa3',
    orange='#ff9020', yellow='#ffe040', gold='#c8960c', brown='#7a4a1e', tan='#d8b070',
    beige='#d9d0b8', dbeige='#a89f88', purple='#7a3fc0', white='#ffffff', paper='#fffff0',
    tip='#ffffe1', ink='#202040',
)
C = P  # alias


def hexrgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def rgbhex(t):
    return '#%02x%02x%02x' % t


# ---------------------------------------------------------------- fonts
_F5 = """
A:.###.|#...#|#...#|#####|#...#|#...#|#...#
B:####.|#...#|#...#|####.|#...#|#...#|####.
C:.###.|#...#|#....|#....|#....|#...#|.###.
D:####.|#...#|#...#|#...#|#...#|#...#|####.
E:#####|#....|#....|####.|#....|#....|#####
F:#####|#....|#....|####.|#....|#....|#....
G:.###.|#...#|#....|#.###|#...#|#...#|.###.
H:#...#|#...#|#...#|#####|#...#|#...#|#...#
I:.###.|..#..|..#..|..#..|..#..|..#..|.###.
J:..###|...#.|...#.|...#.|...#.|#..#.|.##..
K:#...#|#..#.|#.#..|##...|#.#..|#..#.|#...#
L:#....|#....|#....|#....|#....|#....|#####
M:#...#|##.##|#.#.#|#.#.#|#...#|#...#|#...#
N:#...#|##..#|#.#.#|#..##|#...#|#...#|#...#
O:.###.|#...#|#...#|#...#|#...#|#...#|.###.
P:####.|#...#|#...#|####.|#....|#....|#....
Q:.###.|#...#|#...#|#...#|#.#.#|#..#.|.##.#
R:####.|#...#|#...#|####.|#.#..|#..#.|#...#
S:.####|#....|#....|.###.|....#|....#|####.
T:#####|..#..|..#..|..#..|..#..|..#..|..#..
U:#...#|#...#|#...#|#...#|#...#|#...#|.###.
V:#...#|#...#|#...#|#...#|#...#|.#.#.|..#..
W:#...#|#...#|#...#|#.#.#|#.#.#|##.##|#...#
X:#...#|#...#|.#.#.|..#..|.#.#.|#...#|#...#
Y:#...#|#...#|.#.#.|..#..|..#..|..#..|..#..
Z:#####|....#|...#.|..#..|.#...|#....|#####
0:.###.|#...#|#..##|#.#.#|##..#|#...#|.###.
1:..#..|.##..|..#..|..#..|..#..|..#..|.###.
2:.###.|#...#|....#|...#.|..#..|.#...|#####
3:.###.|#...#|....#|..##.|....#|#...#|.###.
4:...#.|..##.|.#.#.|#..#.|#####|...#.|...#.
5:#####|#....|####.|....#|....#|#...#|.###.
6:..##.|.#...|#....|####.|#...#|#...#|.###.
7:#####|....#|...#.|..#..|.#...|.#...|.#...
8:.###.|#...#|#...#|.###.|#...#|#...#|.###.
9:.###.|#...#|#...#|.####|....#|...#.|.##..
.:.....|.....|.....|.....|.....|.##..|.##..
!:..#..|..#..|..#..|..#..|..#..|.....|..#..
?:.###.|#...#|....#|...#.|..#..|.....|..#..
-:.....|.....|.....|#####|.....|.....|.....
>:#....|.#...|..#..|...#.|..#..|.#...|#....
_:.....|.....|.....|.....|.....|.....|#####
/:....#|...#.|...#.|..#..|.#...|.#...|#....
+:.....|..#..|..#..|#####|..#..|..#..|.....
%:##..#|##..#|...#.|..#..|.#...|#..##|#..##
::.....|.##..|.##..|.....|.##..|.##..|.....
 :.....|.....|.....|.....|.....|.....|.....
"""
FONT5 = {}
for ln in _F5.strip('\n').split('\n'):
    ch, rows = ln.split(':', 1)
    FONT5[ch] = rows.split('|')

_F3 = """
A:.#.|#.#|###|#.#|#.#
B:##.|#.#|##.|#.#|##.
C:.##|#..|#..|#..|.##
D:##.|#.#|#.#|#.#|##.
E:###|#..|##.|#..|###
F:###|#..|##.|#..|#..
G:.##|#..|#.#|#.#|.##
H:#.#|#.#|###|#.#|#.#
I:###|.#.|.#.|.#.|###
J:..#|..#|..#|#.#|.#.
K:#.#|#.#|##.|#.#|#.#
L:#..|#..|#..|#..|###
M:#.#|###|###|#.#|#.#
N:##.|#.#|#.#|#.#|#.#
O:.#.|#.#|#.#|#.#|.#.
P:##.|#.#|##.|#..|#..
Q:.#.|#.#|#.#|##.|.##
R:##.|#.#|##.|#.#|#.#
S:.##|#..|.#.|..#|##.
T:###|.#.|.#.|.#.|.#.
U:#.#|#.#|#.#|#.#|###
V:#.#|#.#|#.#|#.#|.#.
W:#.#|#.#|###|###|#.#
X:#.#|#.#|.#.|#.#|#.#
Y:#.#|#.#|.#.|.#.|.#.
Z:###|..#|.#.|#..|###
0:###|#.#|#.#|#.#|###
1:.#.|##.|.#.|.#.|###
2:##.|..#|.#.|#..|###
3:##.|..#|.#.|..#|##.
4:#.#|#.#|###|..#|..#
5:###|#..|##.|..#|##.
6:.##|#..|###|#.#|###
7:###|..#|.#.|.#.|.#.
8:###|#.#|###|#.#|###
9:###|#.#|###|..#|##.
?:##.|..#|.#.|...|.#.
!:.#.|.#.|.#.|...|.#.
.:...|...|...|...|.#.
-:...|...|###|...|...
 :...|...|...|...|...
"""
FONT3 = {}
for ln in _F3.strip('\n').split('\n'):
    ch, rows = ln.split(':', 1)
    FONT3[ch] = rows.split('|')


# ---------------------------------------------------------------- canvas
class Canvas:
    def __init__(self, w, h, bg=None):
        self.w, self.h = w, h
        self.g = [[bg] * w for _ in range(h)]

    # -- primitives
    def px(self, x, y, c):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.g[y][x] = None if c == 'clear' else c
        return self

    def get(self, x, y):
        if 0 <= x < self.w and 0 <= y < self.h:
            return self.g[y][x]
        return None

    def rect(self, x, y, w, h, c):
        for j in range(y, y + h):
            for i in range(x, x + w):
                self.px(i, j, c)
        return self

    def box(self, x, y, w, h, c):
        self.rect(x, y, w, 1, c); self.rect(x, y + h - 1, w, 1, c)
        self.rect(x, y, 1, h, c); self.rect(x + w - 1, y, 1, h, c)
        return self

    def line(self, x0, y0, x1, y1, c):
        dx, dy = abs(x1 - x0), -abs(y1 - y0)
        sx, sy = (1 if x0 < x1 else -1), (1 if y0 < y1 else -1)
        err = dx + dy
        while True:
            self.px(x0, y0, c)
            if x0 == x1 and y0 == y1:
                break
            e2 = 2 * err
            if e2 >= dy: err += dy; x0 += sx
            if e2 <= dx: err += dx; y0 += sy
        return self

    def ell(self, cx, cy, rx, ry, c, fill=True):
        """Ellipse centred on pixel (cx,cy) (inclusive radii)."""
        for y in range(cy - ry, cy + ry + 1):
            for x in range(cx - rx, cx + rx + 1):
                d = ((x - cx) / (rx + .5)) ** 2 + ((y - cy) / (ry + .5)) ** 2
                if fill and d <= 1.0:
                    self.px(x, y, c)
                elif not fill and 0.62 <= d <= 1.0:
                    self.px(x, y, c)
        return self

    def poly(self, pts, c):
        ys = [p[1] for p in pts]
        n = len(pts)
        for y in range(min(ys), max(ys) + 1):
            xs = []
            for i in range(n):
                (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % n]
                if y0 == y1: continue
                if min(y0, y1) <= y < max(y0, y1) or (y == max(y0, y1) == max(ys)):
                    xs.append(x0 + (y - y0) * (x1 - x0) / (y1 - y0))
            xs.sort()
            for i in range(0, len(xs) - 1, 2):
                for x in range(int(round(xs[i])), int(round(xs[i + 1])) + 1):
                    self.px(x, y, c)
        return self

    def fill(self, x, y, c):
        t = self.get(x, y)
        if t == c: return self
        st = [(x, y)]
        while st:
            a, b = st.pop()
            if 0 <= a < self.w and 0 <= b < self.h and self.g[b][a] == t:
                self.g[b][a] = c
                st += [(a + 1, b), (a - 1, b), (a, b + 1), (a, b - 1)]
        return self

    def text(self, x, y, s, c, f=5, gap=1):
        font = FONT5 if f == 5 else FONT3
        cx = x
        for ch in s.upper():
            rows = font.get(ch, font[' '])
            for j, r in enumerate(rows):
                for i, v in enumerate(r):
                    if v == '#': self.px(cx + i, y + j, c)
            cx += len(rows[0]) + gap
        return self

    @staticmethod
    def text_width(s, f=5, gap=1):
        font = FONT5 if f == 5 else FONT3
        return sum(len(font.get(ch, font[' '])[0]) + gap for ch in s.upper()) - gap

    def bevel(self, x, y, w, h, raised=True, face=P['face']):
        """Windows-95 style 2px bevel."""
        tl1, tl2, br1, br2 = (P['hi'], P['mid'], P['black'], P['shade']) if raised else (P['black'], P['shade'], P['hi'], P['mid'])
        self.rect(x, y, w, h, face)
        self.rect(x, y, w, 1, tl1); self.rect(x, y, 1, h, tl1)
        self.rect(x + 1, y + 1, w - 2, 1, tl2); self.rect(x + 1, y + 1, 1, h - 2, tl2)
        self.rect(x, y + h - 1, w, 1, br1); self.rect(x + w - 1, y, 1, h, br1)
        self.rect(x + 1, y + h - 2, w - 2, 1, br2); self.rect(x + w - 2, y + 1, 1, h - 2, br2)
        return self

    def paste(self, o, x=0, y=0):
        for j in range(o.h):
            for i in range(o.w):
                v = o.g[j][i]
                if v is not None: self.px(x + i, y + j, v)
        return self

    def copy(self):
        n = Canvas(self.w, self.h)
        n.g = [r[:] for r in self.g]
        return n

    def outline(self, c=P['black'], diag=False):
        """Add a 1px outline around opaque pixels (grows within canvas)."""
        add = []
        for y in range(self.h):
            for x in range(self.w):
                if self.g[y][x] is None:
                    nb = [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
                    if diag: nb += [(x + 1, y + 1), (x - 1, y - 1), (x + 1, y - 1), (x - 1, y + 1)]
                    if any(self.get(a, b) is not None for a, b in nb): add.append((x, y))
        for x, y in add: self.g[y][x] = c
        return self

    def mapcolors(self, fn):
        n = self.copy()
        for y in range(n.h):
            for x in range(n.w):
                if n.g[y][x] is not None: n.g[y][x] = fn(n.g[y][x])
        return n

    def gray(self):
        def f(h):
            r, g, b = hexrgb(h)
            l = int(0.3 * r + 0.59 * g + 0.11 * b)
            l = int(110 + l * 0.45)
            return rgbhex((l, l, l))
        return self.mapcolors(f)

    def tint(self, amt=0.35, to=(255, 255, 255)):
        def f(h):
            r, g, b = hexrgb(h)
            return rgbhex(tuple(int(v + (t - v) * amt) for v, t in zip((r, g, b), to)))
        return self.mapcolors(f)

    def scaled(self, k):
        n = Canvas(self.w * k, self.h * k)
        for y in range(self.h):
            for x in range(self.w):
                v = self.g[y][x]
                if v is not None: n.rect(x * k, y * k, k, k, v)
        return n

    def flip(self):
        n = self.copy()
        n.g = [r[::-1] for r in n.g]
        return n

    # -- export
    def to_svg(self, scale=1, title=None):
        out = []
        for y in range(self.h):
            x = 0
            while x < self.w:
                v = self.g[y][x]
                if v is None: x += 1; continue
                x2 = x
                while x2 + 1 < self.w and self.g[y][x2 + 1] == v: x2 += 1
                out.append(f'<rect x="{x}" y="{y}" width="{x2 - x + 1}" height="1" fill="{v}"/>')
                x = x2 + 1
        t = f'<title>{title}</title>' if title else ''
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w * scale}" height="{self.h * scale}" '
                f'viewBox="0 0 {self.w} {self.h}" shape-rendering="crispEdges">{t}{"".join(out)}</svg>')

    def to_image(self, scale=1):
        im = Image.new('RGBA', (self.w, self.h), (0, 0, 0, 0))
        pix = im.load()
        for y in range(self.h):
            for x in range(self.w):
                v = self.g[y][x]
                if v is not None: pix[x, y] = hexrgb(v) + (255,)
        if scale != 1: im = im.resize((self.w * scale, self.h * scale), Image.NEAREST)
        return im


# ---------------------------------------------------------------- output
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'assets', 'cyberdesk')
ROOT = os.path.abspath(ROOT)
MANIFEST = []  # collected entries: dict(file, row, kind, size, component, note)


def out(path, canvas, rows, component='', png_scale=None, note='', svg=True, png=True):
    """Write canvas to <ROOT>/<path>.svg/.png and register in manifest.

    rows: list of inventory row numbers this file satisfies.
    """
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    if svg:
        with open(full + '.svg', 'w') as f: f.write(canvas.to_svg(title=os.path.basename(path)))
        MANIFEST.append(dict(file=f'assets/cyberdesk/{path}.svg', rows=rows, grid=f'{canvas.w}x{canvas.h}', component=component, note=note))
    if png:
        s = png_scale or max(1, 64 // max(canvas.w, canvas.h))
        canvas.to_image(s).save(full + '.png')
        MANIFEST.append(dict(file=f'assets/cyberdesk/{path}.png', rows=rows, grid=f'{canvas.w}x{canvas.h}@{s}x', component=component, note=note))


def write_text(path, text, rows, component='', note=''):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w') as f: f.write(text)
    MANIFEST.append(dict(file=f'assets/cyberdesk/{path}', rows=rows, grid='', component=component, note=note))


def write_image(path, im, rows, component='', note='', fmt=None):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    im.save(full)
    MANIFEST.append(dict(file=f'assets/cyberdesk/{path}', rows=rows, grid=f'{im.width}x{im.height}', component=component, note=note))


def write_cur(path, canvas, hot, scale=1):
    """Write a Windows .cur with an embedded PNG image."""
    im = canvas.to_image(scale)
    buf = io.BytesIO(); im.save(buf, 'PNG'); data = buf.getvalue()
    w, h = im.width, im.height
    hdr = struct.pack('<HHH', 0, 2, 1)
    ent = struct.pack('<BBBBHHII', w % 256, h % 256, 0, 0, hot[0] * scale, hot[1] * scale, len(data), 22)
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'wb') as f: f.write(hdr + ent + data)
