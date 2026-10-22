"""Avatars (people + fictional organisations), mascot 'Finn', rank badges, achievements."""
import json
from PIL import Image
from pixel import Canvas, P, out, write_image, write_text
from art_common import shield, check
import art_ui as UI
import art_icons as AI

K = P['black']

# ------------------------------------------------------------------ avatars
PEOPLE = [
    # id, display name, role, skin, hair, style, shirt, glasses, bg
    ('maya-okafor', 'Dr. Maya Okafor', 'Professor, Computer Science', '#8d5524', '#1b1b1b', 'curly', '#7a3fc0', True, '#2d4a7a'),
    ('liam-chen', 'Liam Chen', 'Teaching Assistant', '#e0b080', '#1b1b1b', 'short', '#2f80c8', True, '#2f6a4a'),
    ('sam-rivera', 'Sam Rivera', 'Classmate', '#c68642', '#4a2c14', 'cap', '#e02020', False, '#5a3a7a'),
    ('priya-nair', 'Priya Nair', 'Lab Partner', '#a9693a', '#101010', 'long', '#ff9020', False, '#7a4a2a'),
    ('jordan-blake', 'Jordan Blake', 'Team Manager', '#f0c8a0', '#8a5a2a', 'short', '#404040', False, '#3a3a5a'),
    ('alex-kim', 'Alex Kim', 'IT Support', '#f0d0a8', '#202020', 'short', '#008a2e', True, '#1a3a3a'),
    ('dana-whitfield', 'Dana Whitfield', 'Registrar Office', '#f5d5b8', '#c8960c', 'bun', '#1084d0', False, '#6a2a3a'),
    ('tom-becker', 'Tom Becker', 'Facilities', '#d9a37a', '#707070', 'bald', '#a8672d', False, '#3a4a2a'),
    ('rosa-martinez', 'Rosa Martinez', 'Career Services', '#b5784a', '#3a1c0a', 'long', '#e02020', True, '#2a4a6a'),
    ('ken-watanabe', 'Ken Watanabe', 'Library', '#f0cfa0', '#101010', 'short', '#808080', True, '#4a3a2a'),
    ('nora-hughes', 'Nora Hughes', 'Finance Office', '#f5d5b8', '#8a2a1a', 'bun', '#7a3fc0', False, '#2a3a5a'),
    ('omar-haddad', 'Omar Haddad', 'Student Union', '#c68642', '#1b1b1b', 'curly', '#008080', False, '#5a2a4a'),
    ('ivy-park', 'Ivy Park', 'Classmate', '#f0d0a8', '#2b1b3b', 'long', '#ff8fa3', False, '#2a5a5a'),
    ('chris-novak', 'Chris Novak', 'Unknown Sender', '#d9a37a', '#303030', 'cap', '#202020', False, '#404040'),
]


def person(skin, hair, style, shirt, glasses, bg):
    c = Canvas(32, 32)
    c.rect(0, 0, 32, 32, K); c.rect(1, 1, 30, 30, bg); c.rect(1, 1, 30, 1, P['hi'])
    dark = lambda h, k=0.6: '#%02x%02x%02x' % tuple(int(int(h[i:i + 2], 16) * k) for i in (1, 3, 5))
    if style == 'long':
        c.rect(7, 9, 18, 18, K); c.rect(8, 10, 16, 17, hair)
    # shoulders
    c.poly([(3, 31), (5, 24), (11, 21), (21, 21), (27, 24), (29, 31)], K)
    c.poly([(4, 31), (6, 25), (12, 22), (20, 22), (26, 25), (28, 31)], shirt)
    c.rect(12, 22, 8, 1, dark(shirt)); c.rect(14, 22, 4, 2, skin)
    # neck
    c.rect(13, 19, 6, 4, K); c.rect(14, 19, 4, 3, dark(skin, .85))
    # head
    c.ell(16, 13, 7, 8, K); c.ell(16, 13, 6, 7, skin)
    # hair
    if style in ('short', 'cap', 'curly', 'bun', 'long'):
        c.rect(9, 5, 14, 4, K); c.rect(10, 6, 12, 3, hair)
        c.rect(9, 8, 3, 3, hair); c.rect(20, 8, 3, 3, hair) if style != 'cap' else None
        c.rect(10, 6, 12, 1, hair)
    if style == 'curly':
        for x in range(8, 25, 3): c.rect(x, 4, 3, 3, hair); c.rect(x, 3, 3, 1, K)
        c.rect(8, 7, 3, 5, hair); c.rect(21, 7, 3, 5, hair)
    if style == 'bun':
        c.ell(16, 3, 3, 2, K); c.ell(16, 3, 2, 1, hair)
    if style == 'cap':
        c.rect(8, 6, 16, 4, K); c.rect(9, 7, 14, 2, shirt if shirt != '#202020' else '#e02020'); c.rect(18, 9, 8, 2, K); c.rect(19, 9, 6, 1, shirt if shirt != '#202020' else '#e02020')
    if style == 'bald':
        c.rect(12, 6, 6, 1, P['hi'])
    # face
    c.rect(13, 13, 2, 2, K); c.rect(18, 13, 2, 2, K); c.px(13, 13, P['white'])
    c.rect(14, 18, 5, 1, dark(skin, .55))
    c.px(13, 17, dark(skin, .75)); c.px(19, 17, dark(skin, .75))
    if glasses:
        c.box(11, 12, 6, 4, K); c.box(17, 12, 6, 4, K); c.rect(16, 13, 1, 1, K)
    return c


ORGS = [
    ('northvale-bank', 'Northvale Bank', 'bank', '#0a3a7a'),
    ('eastbrook-university', 'Eastbrook University', 'uni', '#7a1a2a'),
    ('parcelpoint', 'ParcelPoint Delivery', 'box', '#c8700c'),
    ('nimbusdrive', 'NimbusDrive Cloud', 'cloud', '#1084d0'),
    ('it-helpdesk', 'IT Help Desk', 'headset', '#006a3a'),
    ('paysure-hr', 'PaySure Payroll', 'coin', '#5a2a8a'),
]


def org(kind, bg):
    c = Canvas(32, 32)
    c.rect(0, 0, 32, 32, K); c.rect(1, 1, 30, 30, bg)
    if kind == 'bank':
        c.poly([(16, 5), (28, 12), (4, 12)], P['white']); c.rect(5, 12, 22, 2, P['white'])
        for x in (7, 12, 17, 22): c.rect(x, 15, 3, 9, P['white'])
        c.rect(4, 25, 24, 3, P['white']); c.ell(16, 10, 1, 1, bg)
    elif kind == 'uni':
        c.poly([(16, 7), (29, 13), (16, 19), (3, 13)], P['white']); c.rect(9, 17, 14, 6, P['white']); c.rect(11, 19, 10, 3, bg)
        c.rect(27, 13, 1, 9, P['yellow']); c.rect(26, 22, 3, 3, P['yellow'])
    elif kind == 'box':
        c.rect(5, 10, 22, 16, K); c.rect(6, 11, 20, 14, P['tan']); c.rect(14, 11, 4, 14, P['paper']); c.rect(6, 15, 20, 1, P['brown'])
        c.poly([(4, 10), (16, 5), (28, 10)], K); c.poly([(6, 10), (16, 7), (26, 10)], P['tan'])
    elif kind == 'cloud':
        c.ell(11, 18, 6, 5, P['white']); c.ell(19, 14, 7, 7, P['white']); c.ell(23, 19, 5, 4, P['white']); c.rect(8, 19, 17, 5, P['white'])
        c.rect(10, 22, 14, 1, P['mid'])
    elif kind == 'headset':
        c.ell(16, 15, 9, 9, P['white'], fill=False); c.ell(16, 15, 10, 10, P['white'], fill=False)
        c.rect(5, 14, 5, 9, P['white']); c.rect(22, 14, 5, 9, P['white']); c.rect(22, 23, 1, 3, P['white']); c.rect(18, 26, 5, 2, P['white'])
        c.rect(6, 12, 3, 2, P['white'])
    elif kind == 'coin':
        c.ell(16, 16, 11, 11, K); c.ell(16, 16, 10, 10, P['yellow']); c.ell(16, 16, 7, 7, P['gold'], fill=False)
        c.paste(Canvas(5, 7).text(0, 0, 'S', P['gold']).scaled(2), 12, 11); c.rect(16, 9, 1, 14, P['gold'])
    return c


# ------------------------------------------------------------------ mascot 'Finn' (security fish)
def finn(expr):
    c = Canvas(32, 32)
    body, belly, fin = '#2aa7c9', '#bfeaf5', '#1c7a9a'
    # tail
    c.poly([(1, 10), (9, 18), (1, 26)], K); c.poly([(3, 13), (8, 18), (3, 23)], fin)
    # body
    c.ell(17, 18, 13, 9, K); c.ell(17, 18, 12, 8, body)
    c.ell(18, 22, 9, 3, belly)
    c.rect(8, 21, 6, 2, body)
    # dorsal fin
    c.poly([(12, 10), (18, 3), (24, 10)], K); c.poly([(14, 10), (18, 5), (22, 10)], fin)
    # pectoral fin
    c.poly([(14, 19), (19, 22), (13, 25)], K); c.poly([(15, 20), (17, 22), (15, 24)], fin)
    # badge
    c.rect(18, 20, 3, 3, P['yellow']); c.px(19, 21, K)
    # eye
    if expr in ('idle', 'warning', 'thinking'):
        c.ell(23, 15, 3, 3, K); c.ell(23, 15, 2, 2, P['white'])
        c.px(24 if expr != 'thinking' else 24, 15 if expr != 'thinking' else 14, K); c.px(24, 16 if expr != 'thinking' else 14, K) if expr != 'thinking' else None
    elif expr == 'blink':
        c.ell(23, 15, 3, 3, body); c.rect(21, 16, 5, 1, K)
    elif expr == 'happy':
        c.ell(23, 15, 3, 3, body); c.rect(21, 16, 1, 1, K); c.rect(22, 15, 1, 1, K); c.rect(23, 14, 2, 1, K); c.rect(25, 15, 1, 1, K); c.rect(26, 16, 1, 1, K)
        c.px(5, 3, P['yellow']); c.rect(4, 4, 3, 1, P['yellow']); c.px(5, 5, P['yellow'])  # sparkle
    elif expr == 'alert':
        c.ell(23, 15, 3, 3, K); c.ell(23, 15, 2, 2, P['white']); c.rect(24, 15, 2, 2, K)
    # mouth
    if expr in ('idle', 'blink'):
        c.rect(26, 20, 3, 1, K); c.px(29, 19, K)
    elif expr == 'happy':
        c.rect(25, 20, 5, 1, K); c.rect(26, 21, 3, 1, K); c.rect(26, 20, 3, 1, P['white'])
    elif expr == 'alert':
        c.rect(27, 20, 2, 3, K); c.rect(27, 21, 2, 1, P['red'])
    elif expr == 'thinking':
        c.rect(26, 21, 3, 1, K)
    elif expr == 'warning':
        c.rect(26, 21, 3, 1, K); c.px(26, 20, K); c.px(29, 20, K)
    # extras
    if expr == 'alert':
        c.rect(26, 2, 3, 7, K); c.rect(27, 3, 1, 5, P['red']); c.rect(26, 10, 3, 2, K); c.rect(27, 10, 1, 1, P['red'])
        c.rect(27, 3, 1, 4, P['red']); c.rect(27, 9, 1, 1, P['red'])
    if expr == 'thinking':
        c.px(27, 10, K); c.rect(28, 7, 2, 2, K); c.rect(26, 2, 6, 5, K); c.rect(27, 3, 4, 3, P['white']); c.px(28, 4, K); c.px(29, 4, K); c.px(29, 5, K)
        c.rect(28, 3, 2, 1, K); c.px(29, 4, K); c.px(28, 5, K)
    if expr == 'warning':
        c.rect(25, 8, 2, 3, P['sky']); c.px(25, 7, P['sky']); c.rect(25, 8, 1, 2, P['hi'])
        c.rect(2, 2, 7, 6, K); c.rect(3, 3, 5, 4, P['yellow']); c.rect(5, 3, 1, 2, K); c.rect(5, 6, 1, 1, K)
    return c


MASCOT = ['idle', 'blink', 'happy', 'alert', 'thinking', 'warning']


# ------------------------------------------------------------------ ranks
RANKS = [('trainee', 'Trainee', 0), ('junior', 'Junior Analyst', 100), ('analyst', 'Analyst', 250), ('senior', 'Senior Analyst', 500),
         ('specialist', 'Specialist', 900), ('investigator', 'Investigator', 1400), ('chief', 'Chief Inspector', 2100), ('sage', 'Cyber Sage', 3000)]
TIERS = [('#a8672d', '#e0a060'), ('#a8672d', '#e0a060'), ('#9aa0a8', '#e8ecf0'), ('#9aa0a8', '#e8ecf0'),
         ('#c8960c', '#ffe040'), ('#c8960c', '#ffe040'), ('#20a8c0', '#a0f0ff'), ('#7a3fc0', '#e0b0ff')]


def rank(i):
    c = Canvas(32, 32)
    dark, light = TIERS[i]
    shield(c, 4, 1, 24, 30, dark, K, hi=light)
    c.rect(6, 3, 20, 2, light); c.rect(6, 5, 20, 1, dark)
    # star
    cx, cy = 16, 14
    c.poly([(cx, cy - 6), (cx + 2, cy - 2), (cx + 6, cy - 2), (cx + 3, cy + 1), (cx + 4, cy + 5), (cx, cy + 3), (cx - 4, cy + 5), (cx - 3, cy + 1), (cx - 6, cy - 2), (cx - 2, cy - 2)], K)
    c.poly([(cx, cy - 4), (cx + 1, cy - 1), (cx + 4, cy - 1), (cx + 2, cy + 1), (cx + 3, cy + 3), (cx, cy + 2), (cx - 3, cy + 3), (cx - 2, cy + 1), (cx - 4, cy - 1), (cx - 1, cy - 1)], P['white'])
    n = i + 1
    row1, row2 = min(n, 4), max(0, n - 4)
    for r, cnt in enumerate((row1, row2)):
        for k in range(cnt):
            x = 16 - (cnt * 3 - 1) // 2 + k * 3
            c.rect(x, 21 + r * 3, 2, 2, light if r == 0 else P['white']); c.px(x + 1, 22 + r * 3, K)
    return c


# ------------------------------------------------------------------ achievements
def small(name):
    c = Canvas(16, 16)
    if name == 'flag': return UI.tb('report')
    if name == 'magnifier': return AI.st('evidence')
    if name == 'shield': return AI.st('verified')
    if name == 'star': return UI.tb('star')
    if name == 'mail': return UI.tb('mark_unread')
    if name == 'lock': return UI.tb('lock')
    if name == 'key':
        c.ell(4, 8, 3, 3, K); c.ell(4, 8, 2, 2, P['yellow']); c.rect(7, 7, 8, 3, K); c.rect(7, 8, 8, 1, P['yellow']); c.rect(11, 10, 2, 3, K); c.rect(14, 10, 1, 2, K)
    elif name == 'bolt':
        c.poly([(9, 0), (3, 9), (7, 9), (5, 15), (13, 6), (8, 6), (11, 0)], K); c.poly([(9, 2), (5, 8), (9, 8), (7, 12), (11, 7), (7, 7), (9, 3)], P['yellow'])
    elif name == 'trophy':
        c.rect(3, 1, 10, 7, K); c.rect(4, 2, 8, 6, P['yellow']); c.rect(1, 2, 3, 4, K); c.rect(12, 2, 3, 4, K); c.rect(6, 8, 4, 4, K); c.rect(7, 8, 2, 3, P['gold']); c.rect(4, 12, 8, 3, K); c.rect(5, 13, 6, 1, P['gold'])
        c.rect(5, 3, 1, 3, P['hi'])
    elif name == 'chain':
        c.ell(5, 9, 4, 3, K, fill=False); c.ell(10, 6, 4, 3, K, fill=False); c.rect(5, 7, 5, 3, P['white']); c.line(5, 9, 10, 6, K)
    elif name == 'clip':
        c.rect(5, 1, 6, 14, P['shade']); c.rect(6, 2, 4, 12, 'clear'); c.rect(7, 4, 2, 9, P['shade']); c.outline(K)
    elif name == 'target':
        c.ell(7, 7, 7, 7, K); c.ell(7, 7, 6, 6, P['white']); c.ell(7, 7, 4, 4, P['red']); c.ell(7, 7, 2, 2, P['white']); c.px(7, 7, P['red'])
    elif name == 'book':
        c.rect(1, 2, 14, 12, K); c.rect(2, 3, 6, 10, P['white']); c.rect(8, 3, 6, 10, P['paper']); c.rect(7, 2, 2, 12, K); [c.rect(3, 5 + i * 2, 4, 1, P['shade']) for i in range(3)]; [c.rect(9, 5 + i * 2, 4, 1, P['shade']) for i in range(3)]
    elif name == 'eye':
        c.ell(7, 8, 7, 4, K); c.ell(7, 8, 6, 3, P['white']); c.ell(7, 8, 2, 2, P['blue']); c.px(7, 8, K)
    elif name == 'crown':
        c.poly([(1, 13), (1, 4), (5, 8), (8, 2), (11, 8), (15, 4), (15, 13)], K); c.poly([(2, 12), (2, 6), (5, 9), (8, 4), (11, 9), (14, 6), (14, 12)], P['yellow']); c.px(8, 8, P['red'])
    elif name == 'clock':
        c.ell(7, 7, 7, 7, K); c.ell(7, 7, 6, 6, P['white']); c.line(7, 7, 7, 3, K); c.line(7, 7, 10, 9, P['red'])
    return c


ACH = [('first_report', 'First Report', 'flag', '#c02020'), ('sharp_eyes', 'Sharp Eyes', 'magnifier', '#1084d0'), ('link_sleuth', 'Link Sleuth', 'chain', '#008a2e'),
       ('safe_clicker', 'Safe Clicker', 'shield', '#0a3a7a'), ('speed_reader', 'Speed Reader', 'bolt', '#7a3fc0'), ('perfect_run', 'Perfect Run', 'star', '#c8700c'),
       ('champion', 'Champion', 'trophy', '#c8960c'), ('key_keeper', 'Key Keeper', 'key', '#006a3a'), ('inbox_clear', 'Inbox Clear', 'mail', '#2f6a9a'),
       ('attachment_hawk', 'Attachment Hawk', 'clip', '#5a3a2a'), ('on_the_clock', 'On the Clock', 'clock', '#404060'), ('bullseye', 'Bullseye', 'target', '#a02060'),
       ('bookworm', 'Bookworm', 'book', '#3a5a2a'), ('lockdown', 'Lockdown', 'lock', '#404040'), ('all_seeing', 'All-Seeing', 'eye', '#20808a'), ('cyber_royalty', 'Cyber Royalty', 'crown', '#802020')]


def ach(glyph, col):
    c = Canvas(32, 32)
    c.ell(16, 16, 15, 15, K); c.ell(16, 16, 14, 14, P['gold']); c.ell(16, 16, 12, 12, K); c.ell(16, 16, 11, 11, col)
    c.ell(16, 16, 14, 14, P['yellow'], fill=False)
    s = small(glyph).scaled(1)
    c.paste(s, 8, 8)
    c.rect(9, 6, 6, 1, P['hi'])
    return c


def build():
    contacts = []
    for pid, name, role, skin, hair, style, shirt, gl, bg in PEOPLE:
        out(f'mail/avatars/{pid}', person(skin, hair, style, shirt, gl, bg), [42], 'Avatar', png_scale=2, note=name)
        contacts.append(dict(id=pid, name=name, role=role, kind='person'))
    for oid, name, kind, bg in ORGS:
        out(f'mail/avatars/{oid}', org(kind, bg), [42], 'Avatar', png_scale=2, note=name)
        contacts.append(dict(id=oid, name=name, role='Organisation', kind='org'))
    # mascot frames + sheet
    sheet = Canvas(32 * len(MASCOT), 32)
    for i, e in enumerate(MASCOT):
        f = finn(e)
        out(f'mascot/finn-{e}', f, [88], 'Mascot', png_scale=3, note=f'frame {i + 1}')
        sheet.paste(f, i * 32, 0)
    out('mascot/finn-sheet', sheet, [88], 'Mascot', png_scale=3, note='6 frames x 32px: ' + ','.join(MASCOT))
    # ranks
    for i, (rid, name, xp) in enumerate(RANKS):
        r = rank(i)
        out(f'progression/ranks/{rid}', r, [80], 'RankBadge', png_scale=2, note=f'{name} @ {xp} XP')
        out(f'progression/ranks/{rid}-locked', r.gray(), [80], 'RankBadge', png_scale=2, note='locked frame')
    for aid, name, glyph, col in ACH:
        a = ach(glyph, col)
        out(f'progression/achievements/{aid}', a, [81], 'AchievementIcon', png_scale=2, note=name)
        out(f'progression/achievements/{aid}-locked', a.gray(), [81], 'AchievementIcon', png_scale=2, note='locked frame')
    return dict(contacts=contacts, ranks=[dict(id=r, name=n, xp=x) for r, n, x in RANKS], achievements=[dict(id=a, name=n) for a, n, _, _ in ACH], mascot=MASCOT)
