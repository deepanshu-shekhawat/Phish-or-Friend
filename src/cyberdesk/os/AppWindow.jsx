import React, { useRef } from 'react';
import { useStore } from '../engine/store.jsx';
import { APPS, appIcon } from '../engine/apps.js';
import { Px } from './ui.jsx';
import { audio } from '../engine/audio.js';

const HANDLES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
const MINW = 240, MINH = 150;

export default function AppWindow({ win, area, children }) {
  const { s, d, act } = useStore();
  const def = APPS[win.app];
  const active = s.focus === win.id && !win.minimized;
  const drag = useRef(null);

  const clamp = (x, y, w) => ({ x: Math.max(-w + 90, Math.min(area.w - 90, x)), y: Math.max(0, Math.min(area.h - 28, y)) });

  const startDrag = (e) => {
    if (e.target.closest('.wbtn') || win.maximized || e.button !== 0) return;
    drag.current = { sx: e.clientX, sy: e.clientY, x: win.x, y: win.y };
    e.currentTarget.setPointerCapture(e.pointerId);
    d({ type: 'win/patch', id: win.id, patch: { geoAnim: false, dragging: true } });
  };
  const onDrag = (e) => {
    const g = drag.current; if (!g) return;
    d({ type: 'win/patch', id: win.id, patch: clamp(g.x + e.clientX - g.sx, g.y + e.clientY - g.sy, win.w) });
  };
  const endDrag = (e) => { if (drag.current) { drag.current = null; d({ type: 'win/patch', id: win.id, patch: { dragging: false } }); } };

  const startResize = (h) => (e) => {
    if (win.maximized || e.button !== 0) return; e.stopPropagation(); e.preventDefault();
    const g = { h, sx: e.clientX, sy: e.clientY, x: win.x, y: win.y, w: win.w, hh: win.h };
    const el = e.currentTarget; el.setPointerCapture(e.pointerId);
    el.onpointermove = (ev) => {
      let { x, y, w, hh } = g; const dx = ev.clientX - g.sx, dy = ev.clientY - g.sy;
      if (h.includes('e')) w = Math.max(MINW, g.w + dx);
      if (h.includes('s')) hh = Math.max(MINH, g.hh + dy);
      if (h.includes('w')) { w = Math.max(MINW, g.w - dx); x = g.x + (g.w - w); }
      if (h.includes('n')) { hh = Math.max(MINH, g.hh - dy); y = Math.max(0, g.y + (g.hh - hh)); if (y === 0) hh = g.hh + g.y; }
      d({ type: 'win/patch', id: win.id, patch: { x, y, w, h: hh, geoAnim: false, dragging: true } });
    };
    el.onpointerup = () => { el.onpointermove = null; el.onpointerup = null; d({ type: 'win/patch', id: win.id, patch: { dragging: false } }); };
  };

  const style = win.maximized
    ? { left: 0, top: 0, width: area.w, height: area.h, zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  const cls = ['win', active ? 'active' : 'inactive', win.minimized ? 'minimized' : '', win.maximized ? 'maximized' : '', win.geoAnim && !win.dragging ? 'geo' : '', win.anim ? 'anim-' + win.anim : ''].join(' ');
  const toggleMax = () => { if (def.fixed) return; audio.play('window-open'); d({ type: 'win/max', id: win.id }); setTimeout(() => d({ type: 'win/patch', id: win.id, patch: { geoAnim: false } }), 260); };

  return (
    <section className={cls} style={style} role="dialog" aria-label={win.title} aria-hidden={win.minimized || undefined}
      onPointerDownCapture={() => { if (s.focus !== win.id) d({ type: 'win/focus', id: win.id }); }}
      onAnimationEnd={(e) => { if (e.target === e.currentTarget && win.anim && win.anim !== 'close' && win.anim !== 'minimize') d({ type: 'win/patch', id: win.id, patch: { anim: null } }); }}>
      <div className="titlebar" onPointerDown={startDrag} onPointerMove={onDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onDoubleClick={(e) => { if (!e.target.closest('.wbtn')) toggleMax(); }}>
        <Px src={appIcon(win.app)} size={16} className="ticon" />
        <span className="ttext">{win.title}</span>
        <button className="wbtn" aria-label="Minimize" onClick={() => act.minWin(win.id)}><span className="g min" /></button>
        <button className="wbtn" aria-label={win.maximized ? 'Restore' : 'Maximize'} disabled={def.fixed} onClick={toggleMax}><span className={`g ${win.maximized ? 'restore' : 'max'}`} /></button>
        <button className="wbtn close-btn" aria-label="Close" onClick={() => act.closeWin(win.id)}><span className="g close" /></button>
      </div>
      <div className="wbody">{children}</div>
      {!win.maximized && !def.fixed && HANDLES.map((h) => <div key={h} className={`rz rz-${h}`} onPointerDown={startResize(h)} aria-hidden="true" />)}
    </section>
  );
}
