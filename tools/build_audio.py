"""Synthesises the CyberDesk sound library (original, royalty-free: generated from maths).

Outputs WAV (22.05 kHz mono 16-bit) + OGG Vorbis and audio/audio.json describing
trigger, duration, volume and loop behaviour for every clip.
"""
import json, os, subprocess, wave
import numpy as np
from scipy.signal import butter, lfilter

SR = 22050
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'public', 'assets', 'cyberdesk', 'audio'))
os.makedirs(ROOT, exist_ok=True)
rng = np.random.default_rng(1998)


def t(d): return np.arange(int(SR * d)) / SR
def env(n, a=.005, dec=.05, s=.6, r=.08):
    e = np.ones(n); na, nd, nr = int(a * SR), int(dec * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, max(na, 1));
    if nd: e[na:na + nd] = np.linspace(1, s, nd)[:max(0, n - na)]
    e[na + nd:] = s
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def sine(f, d, **k): x = t(d); return np.sin(2 * np.pi * f * x) * env(len(x), **k)
def square(f, d, **k): x = t(d); return np.sign(np.sin(2 * np.pi * f * x)) * .6 * env(len(x), **k)
def tri(f, d, **k): x = t(d); return (2 / np.pi) * np.arcsin(np.sin(2 * np.pi * f * x)) * env(len(x), **k)
def noise(d, **k): x = t(d); return rng.uniform(-1, 1, len(x)) * env(len(x), **k)
def lp(x, fc): b, a = butter(2, fc / (SR / 2)); return lfilter(b, a, x)
def hp(x, fc): b, a = butter(2, fc / (SR / 2), 'high'); return lfilter(b, a, x)
def cat(*xs): return np.concatenate(xs)
def mix(*xs):
    n = max(len(x) for x in xs); o = np.zeros(n)
    for x in xs: o[:len(x)] += x
    return o
def delay(x, at): return np.concatenate([np.zeros(int(at * SR)), x])
def sweep(f0, f1, d, wave_='sine', **k):
    x = t(d); f = np.linspace(f0, f1, len(x)); ph = 2 * np.pi * np.cumsum(f) / SR
    w = np.sin(ph) if wave_ == 'sine' else np.sign(np.sin(ph)) * .6
    return w * env(len(x), **k)
def echo(x, d=.12, g=.35, n=3):
    o = x.copy()
    for i in range(1, n + 1): o = mix(o, delay(x, d * i) * g ** i)
    return o


N = dict(C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.0, A4=440.0, B4=493.88, C5=523.25, D5=587.33, E5=659.25, G5=783.99, A5=880.0, C6=1046.5, E6=1318.5, G3=196.0, C3=130.81, E3=164.81)


def chord(fs, d, w=sine, **k): return sum(w(f, d, **k) for f in fs) / len(fs)


CLIPS = {}


def clip(name, trigger, vol, loop=False):
    def deco(fn):
        CLIPS[name] = (fn, trigger, vol, loop); return fn
    return deco


@clip('startup', 'Boot completes (desktop reveal)', .6)
def _():
    notes = [N['C4'], N['G4'], N['E5'], N['C5'], N['G5']]
    parts = [delay(tri(f, 1.4, a=.02, dec=.3, s=.35, r=.9) * .5 + sine(f * 2, 1.4, a=.02, dec=.3, s=.15, r=.9) * .2, i * .22) for i, f in enumerate(notes)]
    pad = chord([N['C4'], N['E4'], N['G4'], N['C5']], 2.6, sine, a=.3, dec=.4, s=.5, r=1.2) * .5
    return echo(mix(*parts, pad), .2, .3, 2)


@clip('shutdown', 'Shutdown confirmed', .6)
def _():
    notes = [N['G5'], N['E5'], N['C5'], N['G4'], N['C4']]
    parts = [delay(tri(f, .9, a=.01, dec=.2, s=.3, r=.6) * .6, i * .24) for i, f in enumerate(notes)]
    return echo(mix(*parts, chord([N['C3'], N['G3']], 2, sine, a=.3, s=.5, r=1.0) * .4), .18, .3, 2)


@clip('click', 'Any button / icon press', .5)
def _(): return mix(hp(noise(.03, a=.001, dec=.02, s=0, r=.005), 1200) * .8, square(900, .02, a=.001, dec=.015, s=0, r=.005) * .3)


@clip('hover', 'Menu row / icon hover (optional, quiet)', .15)
def _(): return sine(1400, .02, a=.002, dec=.015, s=0, r=.003) * .5


@clip('window-open', 'Window opens', .45)
def _(): return mix(sweep(300, 900, .12, 'sine', a=.004, dec=.1, s=.2, r=.03) * .6, hp(noise(.1, a=.003, dec=.08, s=0, r=.02), 2500) * .15)


@clip('window-close', 'Window closes / minimizes', .45)
def _(): return mix(sweep(800, 260, .12, 'sine', a=.004, dec=.1, s=.2, r=.03) * .6, hp(noise(.1, a=.003, dec=.08, s=0, r=.02), 2500) * .12)


@clip('menu-open', 'Start menu / context menu opens', .35)
def _(): return cat(sine(700, .035, a=.002, dec=.03, s=0, r=.005), sine(1000, .04, a=.002, dec=.03, s=0, r=.008)) * .5


@clip('dialog-pop', 'Dialog pop-in', .45)
def _(): return mix(sine(520, .09, a=.003, dec=.08, s=.2, r=.03), delay(sine(780, .12, a=.003, dec=.1, s=.2, r=.04), .06)) * .6


@clip('warning', 'Warning dialog / blocked action', .55)
def _(): return cat(square(440, .12, a=.003, dec=.1, s=.5, r=.02), np.zeros(int(.04 * SR)), square(330, .22, a=.003, dec=.15, s=.5, r=.05)) * .6


@clip('error', 'Error dialog / wrong decision', .55)
def _(): return lp(mix(square(140, .35, a=.003, dec=.2, s=.6, r=.1), square(150, .35, a=.003, dec=.2, s=.6, r=.1)), 900) * .8


@clip('success', 'Correct decision / task complete', .5)
def _(): return mix(sine(N['C5'], .3, a=.003, dec=.2, s=.3, r=.1), delay(sine(N['E5'], .3, a=.003, dec=.2, s=.3, r=.1), .1), delay(sine(N['G5'], .5, a=.003, dec=.2, s=.3, r=.25), .2)) * .6


@clip('email', 'New email notification', .5)
def _(): return echo(mix(sine(N['E5'], .35, a=.002, dec=.2, s=.2, r=.15) * .6, delay(sine(N['C5'], .5, a=.002, dec=.2, s=.2, r=.3) * .6, .16)), .22, .25, 2)


@clip('notify', 'Generic system notification', .45)
def _(): return mix(tri(N['G5'], .18, a=.002, dec=.12, s=.2, r=.05), delay(tri(N['C6'], .3, a=.002, dec=.15, s=.2, r=.15), .1)) * .5


@clip('typing', 'Typing in editor / text field (one key)', .3)
def _(): return mix(hp(noise(.025, a=.0005, dec=.02, s=0, r=.004), 1800) * .7, square(300, .012, a=.0005, dec=.01, s=0, r=.002) * .25)


@clip('evidence', 'Evidence discovered', .5)
def _(): return echo(mix(*[delay(sine(f, .25, a=.002, dec=.12, s=.2, r=.12) * .5, i * .07) for i, f in enumerate([N['E5'], N['G5'], N['C6'], N['E6']])]), .12, .3, 2)


@clip('report', 'Report submitted', .5)
def _(): return mix(hp(noise(.25, a=.05, dec=.15, s=.1, r=.05), 1500) * .25, delay(sine(N['A4'], .15, a=.003, dec=.1, s=.3, r=.04), .18), delay(sine(N['E5'], .35, a=.003, dec=.2, s=.3, r=.18), .3)) * .8


@clip('xp', 'XP counter tick (repeat while counting)', .3)
def _(): return mix(square(1200, .035, a=.001, dec=.03, s=0, r=.005) * .4, delay(square(1800, .05, a=.001, dec=.04, s=0, r=.01) * .4, .03))


@clip('achievement', 'Achievement unlocked', .6)
def _():
    notes = [N['C5'], N['E5'], N['G5'], N['C6']]
    seq = [delay(tri(f, .35, a=.003, dec=.15, s=.4, r=.2) * .5, i * .1) for i, f in enumerate(notes)]
    final = chord([N['C5'], N['E5'], N['G5'], N['C6']], 1.0, tri, a=.01, dec=.3, s=.4, r=.6) * .6
    return echo(mix(*seq, delay(final, .4)), .15, .3, 2)


@clip('download-done', 'Download completed', .4)
def _(): return mix(sine(N['G4'], .12, a=.002, dec=.08, s=.3, r=.03), delay(sine(N['C5'], .25, a=.002, dec=.12, s=.3, r=.12), .1)) * .7


@clip('ambience', 'Looping CRT / room hum while desktop is shown (very quiet)', .08, True)
def _():
    d = 4.0; x = t(d)
    hum = np.sin(2 * np.pi * 60 * x) * .35 + np.sin(2 * np.pi * 120 * x) * .15 + np.sin(2 * np.pi * 15734 / 8 * x) * .02
    air = lp(rng.uniform(-1, 1, len(x)), 400) * .35
    out = hum + air
    # loop-safe fade
    k = int(.05 * SR); out[:k] *= np.linspace(0, 1, k); out[-k:] *= np.linspace(1, 0, k)
    return out


def write(name, x, vol):
    x = np.asarray(x, dtype=np.float64)
    peak = np.max(np.abs(x)) or 1
    x = x / peak * 0.9
    pcm = (np.clip(x, -1, 1) * 32767).astype('<i2')
    p = os.path.join(ROOT, name + '.wav')
    with wave.open(p, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', p, '-c:a', 'libvorbis', '-q:a', '3', os.path.join(ROOT, name + '.ogg')], check=True)
    return len(pcm) / SR


def main():
    meta = []
    for name, (fn, trig, vol, loop) in CLIPS.items():
        dur = write(name, fn(), vol)
        meta.append(dict(id=name, trigger=trig, duration=round(dur, 2), volume=vol, loop=loop, muteable=True,
                         files=[f'assets/cyberdesk/audio/{name}.ogg', f'assets/cyberdesk/audio/{name}.wav']))
    with open(os.path.join(ROOT, 'audio.json'), 'w') as f: json.dump(meta, f, indent=2)
    print('audio clips:', len(meta))
    return meta


if __name__ == '__main__':
    main()
