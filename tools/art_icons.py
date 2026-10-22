"""32x32 system / application / file-type icons and 16x16 status icons."""
import math
from pixel import Canvas, P, out
from art_common import crt, shield, check, cross, page, folder, envelope, gear, magnifier, speaker

K = P['black']


def new(): return Canvas(32, 32)


def globe(c, cx, cy, r, ocean=P['blue'], land=P['dgreen']):
    c.ell(cx, cy, r, r, K)
    c.ell(cx, cy, r - 1, r - 1, ocean)
    c.ell(cx - 2, cy - 2, 2, 2, land); c.rect(cx + 1, cy, 3, 3, land); c.rect(cx - 3, cy + 2, 2, 3, land)
    c.px(cx - r + 2, cy - r + 3, P['sky']); c.px(cx - r + 3, cy - r + 2, P['sky'])
    return c


# --------------------------------------------------------------- app icons
def app_mail_clean():
    c = new(); envelope(c, 2, 7, 28, 20, P['white'], P['shade'])
    c.rect(3, 8, 26, 1, P['hi']); c.rect(3, 24, 26, 2, P['mid'])
    for i in range(8): c.px(3 + i, 25 - i, P['shade']); c.px(28 - i, 25 - i, P['shade'])
    c.rect(24, 3, 5, 5, K); c.rect(25, 4, 3, 3, P['red'])  # stamp
    return c


def app_browser():
    c = new(); c.rect(1, 3, 30, 26, K); c.rect(2, 4, 28, 24, P['face'])
    c.rect(2, 4, 28, 5, P['navy']); c.rect(25, 5, 3, 3, P['face'])
    c.rect(3, 10, 26, 3, P['white']); c.rect(4, 11, 12, 1, P['shade'])
    c.rect(3, 14, 26, 13, P['white'])
    globe(c, 16, 21, 6)
    return c


def app_security():
    c = new(); shield(c, 4, 2, 24, 28, P['blue'], K, hi=P['sky'])
    c.rect(5, 3, 22, 1, P['gold'])
    check(c, 9, 10, P['white'], 7); check(c, 9, 11, P['white'], 7)
    c.rect(8, 6, 16, 1, P['sky'])
    return c


def app_files():
    c = new(); folder(c, 2, 6, 28, 22, P['yellow'], P['gold'])
    c.rect(6, 4, 20, 10, K); c.rect(7, 5, 18, 8, P['white'])
    for i in range(3): c.rect(9, 6 + i * 2, 12 - i * 2, 1, P['shade'])
    folder(c, 2, 12, 28, 16, P['yellow'], P['gold'])
    c.rect(3, 15, 26, 1, P['hi'])
    return c


def app_terminal():
    c = new(); c.rect(2, 4, 28, 24, K); c.rect(3, 5, 26, 22, P['face']); c.rect(3, 5, 26, 3, P['navy'])
    c.rect(5, 10, 22, 15, K); c.text(7, 12, '>_', P['green']); c.rect(7, 21, 8, 1, P['dgreen']); c.rect(7, 23, 5, 1, P['dgreen'])
    return c


def app_notes():
    c = new(); c.rect(5, 4, 22, 25, K); c.rect(6, 5, 20, 23, P['yellow']); c.rect(6, 5, 20, 5, P['red'])
    for i in range(4): c.rect(9 + i * 5, 2, 2, 6, K); c.rect(9 + i * 5, 3, 1, 4, P['face'])
    for i in range(4): c.rect(8, 13 + i * 4, 16, 1, P['gold'])
    return c


def app_calculator():
    c = new(); c.rect(5, 2, 22, 28, K); c.rect(6, 3, 20, 26, P['face']); c.rect(6, 3, 20, 1, P['hi'])
    c.rect(8, 5, 16, 6, K); c.rect(9, 6, 14, 4, P['green']); c.text(14, 6, '42', P['black'], 3)
    for r in range(4):
        for k in range(4):
            col = P['red'] if (r == 0 and k == 3) else P['white']
            c.rect(8 + k * 4, 13 + r * 4, 3, 3, K); c.rect(8 + k * 4, 13 + r * 4, 2, 2, col)
    return c


def app_downloads():
    c = new(); c.rect(3, 22, 26, 7, K); c.rect(4, 23, 24, 5, P['face']); c.rect(4, 23, 24, 1, P['hi'])
    c.rect(13, 3, 6, 10, K); c.rect(14, 4, 4, 9, P['green'])
    c.poly([(8, 12), (23, 12), (15, 21)], K); c.poly([(10, 13), (21, 13), (15, 19)], P['green'])
    return c


def app_help():
    c = new(); c.rect(4, 3, 24, 26, K); c.rect(5, 4, 22, 24, P['blue']); c.rect(5, 4, 3, 24, P['navy'])
    c.rect(9, 7, 16, 18, P['white'])
    c.ell(18, 12, 4, 4, P['yellow'], fill=True); c.text(16, 9, '?', K)
    c.rect(11, 22, 12, 1, P['shade'])
    return c


def app_settings():
    c = new(); gear(c, 16, 16, 11, P['shade'], P['face']); c.outline(K)
    c.ell(16, 16, 3, 3, K); c.ell(16, 16, 2, 2, P['teal'])
    return c


def app_inspector():
    c = new(); c.rect(1, 4, 24, 18, K); c.rect(2, 5, 22, 16, P['white']); c.rect(2, 5, 22, 3, P['navy'])
    c.rect(4, 10, 18, 4, P['mid']); c.text(5, 10, 'HTTP', P['blue'], 3)
    c.rect(4, 16, 12, 1, P['shade']); c.rect(4, 18, 9, 1, P['shade'])
    magnifier(c, 19, 19, 6, P['sky'], K)
    return c


def app_mission():
    c = new(); c.rect(5, 4, 22, 26, K); c.rect(6, 5, 20, 24, P['tan']); c.rect(7, 9, 18, 19, P['white'])
    c.rect(11, 2, 10, 5, K); c.rect(12, 3, 8, 3, P['shade'])
    for i in range(3):
        c.rect(9, 11 + i * 6, 4, 4, K); c.rect(10, 12 + i * 6, 2, 2, P['white'])
        c.rect(15, 12 + i * 6, 8, 1, P['shade']); c.rect(15, 14 + i * 6, 5, 1, P['mid'])
    check(c, 9, 11, P['dgreen'], 4)
    return c


APPS = [('mail', app_mail_clean), ('browser', app_browser), ('security', app_security), ('files', app_files), ('terminal', app_terminal),
        ('notes', app_notes), ('calculator', app_calculator), ('downloads', app_downloads), ('help', app_help), ('settings', app_settings),
        ('inspector', app_inspector), ('mission', app_mission)]


# --------------------------------------------------------------- system icons
def sys_my_computer():
    c = new(); m = crt(24, 22, P['teal']); c.paste(m, 2, 2)
    c.rect(18, 20, 12, 9, K); c.rect(19, 21, 10, 7, P['beige']); c.rect(20, 23, 8, 1, P['dbeige']); c.px(27, 26, P['green'])
    return c


def sys_network():
    c = new()
    for (x, y) in ((2, 2), (16, 2), (9, 16)):
        c.rect(x, y, 13, 10, K); c.rect(x + 1, y + 1, 11, 7, P['teal']); c.rect(x + 3, y + 10, 7, 2, P['shade']); c.rect(x + 1, y + 12, 11, 1, K)
    c.rect(8, 13, 1, 5, K); c.rect(8, 13, 8, 1, K); c.rect(22, 13, 1, 5, K); c.rect(16, 18, 7, 1, K)
    c.rect(8, 8, 1, 1, K)
    return c


def sys_hard_drive():
    c = new(); c.rect(2, 10, 28, 14, K); c.rect(3, 11, 26, 12, P['face']); c.rect(3, 11, 26, 1, P['hi'])
    c.rect(5, 15, 16, 4, P['shade']); c.rect(6, 16, 14, 2, P['dark']); c.rect(23, 17, 4, 2, K); c.px(24, 18, P['green'])
    c.rect(3, 22, 26, 1, P['shade'])
    return c


def sys_floppy():
    c = new(); c.rect(4, 3, 24, 26, K); c.rect(5, 4, 22, 24, P['navy'])
    c.rect(9, 4, 14, 9, P['shade']); c.rect(11, 5, 4, 7, P['dark']); c.rect(8, 17, 16, 11, P['white']); c.rect(10, 19, 12, 1, P['red']); c.rect(10, 22, 10, 1, P['shade'])
    c.px(5, 4, 'clear'); c.px(5, 5, 'clear')
    return c


def sys_cd():
    c = new(); c.ell(16, 16, 13, 13, K); c.ell(16, 16, 12, 12, '#c8d8e8'); c.ell(16, 16, 12, 12, '#b0c4de', fill=False)
    c.poly([(16, 16), (26, 8), (28, 14)], P['hi']); c.poly([(16, 16), (6, 24), (4, 18)], '#e0b0ff')
    c.ell(16, 16, 4, 4, K); c.ell(16, 16, 3, 3, 'clear'); c.ell(16, 16, 2, 2, K)
    c.ell(16, 16, 2, 2, 'clear'); c.ell(16, 16, 4, 4, K, fill=False)
    return c


def sys_control_panel():
    c = new(); c.rect(2, 4, 28, 24, K); c.rect(3, 5, 26, 22, P['face']); c.rect(3, 5, 26, 4, P['navy'])
    for i, col in enumerate((P['red'], P['blue'], P['green'])):
        x = 7 + i * 8; c.rect(x, 12, 2, 12, K); c.rect(x - 2, 14 + i * 3, 6, 3, P['shade']); c.rect(x - 2, 14 + i * 3, 6, 1, P['hi']); c.rect(x - 2, 16 + i * 3, 6, 1, K)
    return c


def sys_help():
    c = new(); c.ell(16, 16, 13, 13, K); c.ell(16, 16, 12, 12, P['blue']); c.ell(16, 16, 12, 12, P['sky'], fill=False)
    c2 = Canvas(5, 7).text(0, 0, '?', P['white']); c.paste(c2.scaled(2), 11, 7)
    return c


def sys_printer():
    c = new(); c.rect(7, 3, 18, 9, K); c.rect(8, 4, 16, 8, P['white']); c.rect(10, 6, 12, 1, P['shade']); c.rect(10, 8, 9, 1, P['shade'])
    c.rect(2, 12, 28, 12, K); c.rect(3, 13, 26, 10, P['beige']); c.rect(3, 13, 26, 1, P['hi']); c.rect(3, 22, 26, 1, P['dbeige'])
    c.px(25, 16, P['green']); c.rect(8, 22, 16, 7, K); c.rect(9, 23, 14, 5, P['white']); c.rect(11, 25, 9, 1, P['shade'])
    return c


def sys_search():
    c = new(); folder(c, 2, 8, 26, 20, P['yellow'], P['gold']); magnifier(c, 20, 14, 6, P['sky'], K)
    return c


def sys_documents():
    c = new(); folder(c, 2, 6, 28, 22, P['yellow'], P['gold']); c.rect(7, 3, 14, 12, K); c.rect(8, 4, 12, 10, P['white']); c.rect(10, 6, 8, 1, P['shade']); c.rect(10, 8, 6, 1, P['shade'])
    folder(c, 2, 12, 28, 16, P['yellow'], P['gold']); c.rect(3, 15, 26, 1, P['hi'])
    return c


def sys_clock():
    c = new(); c.ell(16, 16, 13, 13, K); c.ell(16, 16, 12, 12, P['white']); c.ell(16, 16, 12, 12, P['shade'], fill=False)
    for a in range(0, 360, 90):
        x, y = round(16 + math.sin(math.radians(a)) * 10), round(16 - math.cos(math.radians(a)) * 10); c.rect(x, y, 1, 1, K)
    c.line(16, 16, 16, 8, K); c.line(16, 16, 21, 19, P['red'])
    return c


def sys_speaker():
    c = new(); c.rect(3, 11, 7, 10, K); c.rect(4, 12, 5, 8, P['face']); c.poly([(10, 11), (19, 3), (19, 28), (10, 21)], K); c.poly([(10, 12), (18, 5), (18, 26), (10, 20)], P['face'])
    c.line(22, 11, 22, 20, K); c.line(25, 8, 25, 23, K); c.line(28, 5, 28, 26, K)
    return c


def sys_display():
    c = new(); c.rect(2, 3, 28, 20, K); c.rect(3, 4, 26, 18, P['face']); c.rect(5, 6, 22, 14, P['navy'])
    c.rect(6, 7, 8, 5, P['blue']); c.rect(16, 7, 9, 2, P['sky']); c.rect(12, 23, 8, 3, P['shade']); c.rect(8, 26, 16, 3, P['dark'])
    c.rect(5, 6, 22, 1, P['sky'])
    return c


def sys_power():
    c = new(); c.ell(16, 16, 13, 13, K); c.ell(16, 16, 12, 12, P['red']); c.ell(16, 16, 12, 12, '#ff6060', fill=False)
    c.ell(16, 17, 6, 6, P['white'], fill=False); c.rect(14, 18 - 14 + 6, 5, 7, P['red']); c.rect(15, 7, 2, 11, P['white'])
    return c


def sys_programs():
    c = new()
    for i in range(3):
        x, y = 2 + i * 5, 3 + i * 5
        c.rect(x, y, 18, 15, K); c.rect(x + 1, y + 1, 16, 13, P['face']); c.rect(x + 1, y + 1, 16, 3, P['navy'] if i == 2 else P['shade'])
    c.rect(13, 14, 14, 10, P['white'])
    return c


def sys_run():
    c = new(); c.rect(2, 5, 28, 20, K); c.rect(3, 6, 26, 18, P['face']); c.rect(3, 6, 26, 4, P['navy'])
    c.rect(6, 13, 20, 4, P['white']); c.text(7, 14, '>', P['blue'], 3)
    c.poly([(8, 19), (8, 23), (13, 21)], P['dgreen'])
    c.rect(16, 19, 9, 3, P['shade'])
    return c


def sys_user():
    c = new(); c.ell(16, 10, 6, 6, K); c.ell(16, 10, 5, 5, P['tan']); c.poly([(5, 29), (6, 21), (16, 18), (26, 21), (27, 29)], K)
    c.poly([(7, 28), (8, 22), (16, 19), (24, 22), (25, 28)], P['blue'])
    return c


def sys_internet():
    c = new(); globe(c, 16, 16, 13)
    c.rect(18, 18, 8, 6, 'clear'); c.rect(2, 3, 1, 1, P['yellow'])
    return c


SYSTEM = [('my_computer', sys_my_computer), ('network', sys_network), ('hard_drive', sys_hard_drive), ('floppy_drive', sys_floppy), ('cd_drive', sys_cd),
          ('control_panel', sys_control_panel), ('help', sys_help), ('printer', sys_printer), ('search', sys_search), ('documents', sys_documents),
          ('clock', sys_clock), ('speaker', sys_speaker), ('display', sys_display), ('power', sys_power), ('programs', sys_programs),
          ('run', sys_run), ('user', sys_user), ('internet', sys_internet)]


# --------------------------------------------------------------- file types
def ft_base(fill=P['white'], band=None, label=None, band_col=P['blue']):
    c = new(); page(c, 6, 2, 20, 28, fill, 7)
    if band:
        c.rect(7, 22, 18, 7, band_col)
    if label:
        w = Canvas.text_width(label, 3)
        c.text(16 - w // 2, 23, label, P['white'], 3)
    return c


def ft_folder():
    c = new(); folder(c, 2, 6, 28, 22, P['yellow'], P['gold']); return c


def ft_text():
    c = ft_base(); [c.rect(9, 12 + i * 3, 14 - (i % 2) * 4, 1, P['shade']) for i in range(5)]; return c


def ft_document():
    c = ft_base(band=True, label='DOC'); [c.rect(9, 11 + i * 3, 14 - (i % 2) * 4, 1, P['shade']) for i in range(3)]; return c


def ft_pdf():
    c = ft_base(band=True, label='PDF', band_col=P['red']); c.rect(9, 11, 14, 2, P['red']); c.rect(9, 15, 10, 1, P['shade']); c.rect(9, 17, 12, 1, P['shade']); return c


def ft_image():
    c = ft_base(); c.rect(9, 11, 14, 14, K); c.rect(10, 12, 12, 12, P['sky']); c.poly([(10, 23), (14, 17), (18, 23)], P['dgreen']); c.poly([(15, 23), (19, 19), (22, 23)], P['green']); c.ell(19, 15, 1, 1, P['yellow']); return c


def ft_spreadsheet():
    c = ft_base(band=True, label='XLS', band_col=P['dgreen'])
    for i in range(3):
        for j in range(3): c.rect(9 + j * 5, 10 + i * 4, 4, 3, P['lime'] if (i + j) % 2 == 0 else P['mid'])
    return c


def ft_archive():
    c = ft_base(fill=P['tan'])
    c.rect(15, 3, 2, 22, K)
    for i in range(0, 20, 4): c.rect(15, 4 + i, 2, 2, P['yellow']); c.rect(14, 6 + i, 4, 2, P['shade'])
    c.rect(13, 24, 6, 4, K); c.rect(14, 25, 4, 2, P['yellow'])
    return c


def ft_executable():
    c = new(); c.rect(3, 5, 26, 22, K); c.rect(4, 6, 24, 20, P['face']); c.rect(4, 6, 24, 4, P['navy'])
    gear(c, 16, 18, 5, P['shade'], P['face']); c.ell(16, 18, 2, 2, K)
    c.rect(5, 7, 2, 2, P['red'])
    return c


def ft_script():
    c = ft_base(fill=P['black']); c.text(9, 10, '>_', P['green']); c.rect(9, 19, 11, 1, P['dgreen']); c.rect(9, 22, 8, 1, P['dgreen']); c.rect(9, 25, 12, 1, P['dgreen']); return c


def ft_shortcut():
    c = ft_base(); [c.rect(9, 8 + i * 3, 14 - (i % 2) * 4, 1, P['shade']) for i in range(3)]
    c.rect(5, 21, 11, 11, K); c.rect(6, 22, 9, 9, P['white'])
    c.line(8, 29, 12, 25, P['blue']); c.line(8, 29, 8, 26, P['blue']); c.line(8, 29, 11, 29, P['blue']); c.line(12, 25, 12, 26, P['blue']); c.line(12, 25, 9, 25, P['blue'])
    return c


def ft_unknown():
    c = ft_base(fill=P['mid']); c2 = Canvas(5, 7).text(0, 0, '?', P['shade']).scaled(2); c.paste(c2, 11, 11); return c


def ft_attachment():
    c = ft_base(fill=P['white'])
    c.ell(16, 12, 3, 3, P['shade'], fill=False); c.rect(13, 12, 1, 10, P['shade']); c.rect(19, 12, 1, 12, P['shade']); c.rect(14, 24, 5, 1, P['shade']); c.rect(15, 15, 1, 6, P['shade'])
    return c


def ft_quarantine():
    c = ft_base(fill=P['mid'])
    for i in range(6): c.rect(7 + (i % 2) * 0, 4 + i * 4, 18, 2, P['yellow'])
    c.rect(11, 14, 10, 8, K); c.rect(12, 15, 8, 6, P['red']); c.rect(13, 10, 6, 5, K); c.rect(14, 11, 4, 4, P['mid'])
    c.rect(15, 17, 2, 3, P['white'])
    return c


FILETYPES = [('folder', ft_folder), ('text', ft_text), ('document', ft_document), ('pdf', ft_pdf), ('image', ft_image), ('spreadsheet', ft_spreadsheet),
             ('archive', ft_archive), ('executable', ft_executable), ('script', ft_script), ('shortcut', ft_shortcut), ('unknown', ft_unknown),
             ('attachment', ft_attachment), ('quarantined', ft_quarantine)]


# --------------------------------------------------------------- status icons (16x16)
def circ(c, fill, hi=None):
    c.ell(7, 7, 7, 7, K); c.ell(7, 7, 6, 6, fill)
    if hi: c.px(4, 3, hi); c.px(3, 4, hi); c.px(5, 3, hi)
    return c


def st(name):
    c = Canvas(16, 16)
    if name == 'info':
        circ(c, P['blue'], P['sky']); c.rect(7, 3, 2, 2, P['white']); c.rect(7, 6, 2, 6, P['white'])
    elif name == 'warning':
        c.poly([(8, 0), (15, 14), (0, 14)], K); c.poly([(8, 3), (13, 13), (3, 13)], P['yellow']); c.rect(7, 6, 2, 4, K); c.rect(7, 11, 2, 1, K)
    elif name == 'error':
        circ(c, P['red'], '#ff8080'); cross(c, 4, 4, P['white'], 7); cross(c, 5, 4, P['white'], 7)
    elif name == 'success':
        circ(c, P['dgreen'], P['lime']); check(c, 4, 4, P['white'], 7); check(c, 4, 5, P['white'], 7)
    elif name == 'suspicious':
        c.poly([(8, 0), (15, 8), (8, 15), (1, 8)], K); c.poly([(8, 2), (13, 8), (8, 13), (3, 8)], P['orange']); c.rect(7, 5, 2, 4, K); c.rect(7, 10, 2, 1, K)
    elif name == 'verified':
        shield(c, 1, 0, 14, 16, P['dgreen'], K, hi=P['lime']); check(c, 4, 4, P['white'], 7)
    elif name == 'blocked':
        circ(c, P['red'], '#ff8080'); c.line(3, 11, 11, 3, P['white']); c.line(4, 11, 12, 3, P['white']); c.line(3, 10, 10, 3, P['white'])
    elif name == 'unknown':
        circ(c, P['shade'], P['face']); c.paste(Canvas(5, 7).text(0, 0, '?', P['white']), 5, 3)
    elif name == 'shield':
        shield(c, 1, 0, 14, 16, P['blue'], K, hi=P['sky']); c.rect(7, 4, 2, 7, P['white']); c.rect(5, 6, 6, 2, P['white'])
    elif name == 'evidence':
        magnifier(c, 6, 6, 4, P['yellow'], K); c.px(6, 5, P['white']); c.rect(5, 4, 3, 1, P['orange']); c.px(6, 7, P['orange'])
    elif name == 'question':
        circ(c, P['navy'], P['blue']); c.paste(Canvas(5, 7).text(0, 0, '?', P['yellow']), 5, 3)
    elif name == 'pending':
        circ(c, P['white']); c.line(7, 7, 7, 3, K); c.line(7, 7, 10, 9, K)
    return c


STATUS = ['info', 'warning', 'error', 'success', 'suspicious', 'verified', 'blocked', 'unknown', 'shield', 'evidence', 'question', 'pending']


# --------------------------------------------------------------- misc 16x16 overlays
def overlay(name):
    c = Canvas(16, 16)
    if name == 'shortcut':
        c.rect(0, 0, 11, 11, K); c.rect(1, 1, 9, 9, P['white'])
        c.line(3, 8, 7, 4, P['blue']); c.line(3, 7, 7, 3, P['blue']); c.line(4, 8, 8, 4, P['blue'])
        c.rect(4, 3, 5, 1, P['blue']); c.rect(8, 3, 1, 5, P['blue'])
    elif name == 'blocked':
        c = st('blocked')
    elif name == 'quarantine':
        c.rect(0, 0, 14, 14, K); c.rect(1, 1, 12, 12, P['yellow'])
        for i in range(0, 14, 4): c.line(i, 13, i + 8, 5, K)
        c.rect(0, 0, 14, 1, K); c.rect(0, 13, 14, 1, K); c.rect(0, 0, 1, 14, K); c.rect(13, 0, 1, 14, K)
        c.rect(4, 5, 6, 5, K); c.rect(5, 6, 4, 3, P['red']); c.rect(5, 3, 4, 3, K); c.rect(6, 4, 2, 2, P['mid'])
    elif name == 'warning':
        c = st('warning')
    elif name == 'download':
        c.rect(0, 0, 14, 14, K); c.rect(1, 1, 12, 12, P['blue'])
        c.rect(6, 2, 2, 6, P['white']); c.poly([(3, 7), (10, 7), (6, 11)], P['white'])
    elif name == 'check':
        c = st('success')
    return c


# --------------------------------------------------------------- recycle bin
def recycle(full=False):
    c = new()
    c.poly([(6, 9), (26, 9), (24, 29), (8, 29)], K); c.poly([(8, 10), (24, 10), (22, 28), (10, 28)], P['face'])
    for x in (11, 15, 19): c.rect(x, 13, 1, 13, P['shade'])
    c.rect(8, 10, 1, 17, P['hi'])
    c.rect(5, 7, 22, 3, K); c.rect(6, 8, 20, 1, P['mid']); c.rect(13, 5, 6, 3, K); c.rect(14, 6, 4, 1, P['face'])
    if full:
        c.rect(9, 3, 8, 6, K); c.rect(10, 4, 6, 4, P['white']); c.rect(15, 2, 7, 5, K); c.rect(16, 3, 5, 3, P['paper'])
        c.rect(11, 6, 6, 2, K); c.rect(12, 6, 4, 1, P['tan'])
        c.rect(5, 7, 22, 3, K); c.rect(6, 8, 20, 1, P['mid'])
    # recycle arrows
    c.rect(14, 18, 4, 1, P['dgreen']); c.rect(13, 19, 1, 3, P['dgreen']); c.rect(18, 19, 1, 3, P['dgreen']); c.rect(14, 22, 4, 1, P['dgreen'])
    return c


def build():
    for n, f in APPS:
        out(f'icons/app/{n}', f(), [26], 'AppIcon', png_scale=2, note='32x32 app icon')
    for n, f in SYSTEM:
        out(f'icons/system/{n}', f(), [25], 'SystemIcon', png_scale=2, note='32x32 system icon')
    for n, f in FILETYPES:
        out(f'icons/filetype/{n}', f(), [27, 73], 'FileIcon', png_scale=2, note='32x32 file type icon (shared by rows 27 & 73)')
    for n in STATUS:
        out(f'icons/status/{n}', st(n), [28], 'StatusIcon', png_scale=4, note='16x16 status icon')
    for n in ('shortcut', 'blocked', 'quarantine', 'warning', 'download', 'check'):
        out(f'icons/overlay/{n}', overlay(n), [22, 27, 45, 73], 'IconOverlay', png_scale=4, note='16x16 overlay')
    out('desktop/recycle-empty', recycle(False), [23], 'RecycleBin', png_scale=2)
    out('desktop/recycle-full', recycle(True), [23], 'RecycleBin', png_scale=2)
    out('desktop/shortcut-arrow', overlay('shortcut'), [22], 'DesktopIcon', png_scale=4)
    return dict(apps=[n for n, _ in APPS], system=[n for n, _ in SYSTEM], filetypes=[n for n, _ in FILETYPES], status=STATUS)
