import { asset } from './assets.js';

const cache = new Map();
let ambience = null;
const canOgg = (() => { try { return !!new Audio().canPlayType('audio/ogg; codecs="vorbis"'); } catch { return false; } })();
const url = (id) => asset(`audio/${id}.${canOgg ? 'ogg' : 'wav'}`);
const VOL = { startup: .6, shutdown: .6, click: .5, hover: .15, 'window-open': .45, 'window-close': .45, 'menu-open': .35, 'dialog-pop': .45, warning: .55, error: .55, success: .5, email: .5, notify: .45, typing: .3, evidence: .5, report: .5, xp: .3, achievement: .6, 'download-done': .4, ambience: .08 };

export const audio = {
  settings: { sound: true, volume: 0.6 },
  play(id) {
    if (!this.settings.sound) return;
    try {
      let a = cache.get(id);
      if (!a) { a = new Audio(url(id)); a.preload = 'auto'; cache.set(id, a); }
      const n = a.cloneNode(); n.volume = Math.min(1, (VOL[id] ?? .4) * this.settings.volume * 1.4);
      const p = n.play(); if (p && p.catch) p.catch(() => {});
    } catch { /* audio unavailable */ }
  },
  startAmbience() {
    if (!this.settings.sound || ambience) return;
    try { ambience = new Audio(url('ambience')); ambience.loop = true; ambience.volume = VOL.ambience * this.settings.volume; const p = ambience.play(); if (p && p.catch) p.catch(() => { ambience = null; }); } catch { ambience = null; }
  },
  stopAmbience() { if (ambience) { try { ambience.pause(); } catch {} ambience = null; } },
  sync(settings) {
    this.settings = { ...this.settings, ...settings };
    if (!this.settings.sound) this.stopAmbience(); else if (ambience) ambience.volume = VOL.ambience * this.settings.volume;
  },
};
