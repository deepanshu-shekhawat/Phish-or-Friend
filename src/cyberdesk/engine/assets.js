import idx from '../assetIndex.json';

let base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : './') + 'assets/cyberdesk/';
/** Override when the host site serves assets from another path/CDN. */
export const setAssetBase = (b) => { base = b.endsWith('/') ? b : b + '/'; };
export const asset = (p) => base + p;
export const A = {
  app: (n) => asset(`icons/app/${n}.svg`),
  sys: (n) => asset(`icons/system/${n}.svg`),
  file: (n) => asset(`icons/filetype/${n}.svg`),
  status: (n) => asset(`icons/status/${n}.svg`),
  overlay: (n) => asset(`icons/overlay/${n}.svg`),
  attach: (n) => asset(`icons/attach/${n}.svg`),
  tb: (n) => asset(`toolbar/${n}.svg`),
  threat: (n) => asset(`security/threat-${n}.svg`),
  evidence: (n) => asset(`investigation/evidence-${n}.svg`),
  avatar: (n) => asset(`mail/avatars/${n}.svg`),
  rank: (n, locked) => asset(`progression/ranks/${n}${locked ? '-locked' : ''}.svg`),
  ach: (n, locked) => asset(`progression/achievements/${n}${locked ? '-locked' : ''}.svg`),
  init: (n, s) => asset(`boot/init/${n}${s ? '-' + s : ''}.svg`),
  glyph: (n) => asset(`window/glyph-${n}.svg`),
  sprite: (p) => asset(`sprites/${p}.svg`),
  wall: (n) => asset(`wallpapers/${n}.webp`),
  wallThumb: (n) => asset(`wallpapers/${n}-thumb.png`),
  finn: (e) => asset(`mascot/finn-${e}.svg`),
  finnSheet: () => asset('mascot/finn-sheet.png'),
};
export const WALLPAPERS = [
  { id: 'landscape', name: 'Retro Landscape' }, { id: 'campus', name: 'Campus' }, { id: 'night-city', name: 'Night City' },
  { id: 'computer-room', name: 'Computer Room' }, { id: 'teal', name: 'Classic Teal' },
];
export const index = idx;

/** CSS custom properties for crisp, standard-sized system cursors. */
export function cursorVars() {
  const v = {};
  v['--cd-cur-arrow'] = 'default';
  v['--cd-cur-hand'] = 'pointer';
  v['--cd-cur-ibeam'] = 'text';
  v['--cd-cur-forbidden'] = 'not-allowed';
  v['--cd-cur-ns'] = 'ns-resize';
  v['--cd-cur-ew'] = 'ew-resize';
  v['--cd-cur-nwse'] = 'nwse-resize';
  v['--cd-cur-nesw'] = 'nesw-resize';
  v['--cd-cur-cross'] = 'crosshair';
  ['min:minimize', 'max:maximize', 'restore:restore', 'close:close', 'check:check', 'radio:radio', 'up:arrow-up', 'down:arrow-down', 'left:arrow-left', 'right:arrow-right'].forEach((k) => { const [n, f] = k.split(':'); v[`--cd-g-${n}`] = `url(${asset(`window/glyph-${f}.svg`)})`; });
  for (let i = 0; i < 4; i++) v[`--cd-cur-busy${i}`] = 'wait';
  return v;
}
