import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useStore } from '../engine/store.jsx';
import { DESKTOP_ICONS, APPS, appIcon } from '../engine/apps.js';
import { A, WALLPAPERS, asset } from '../engine/assets.js';
import { MISSION } from '../engine/scenario.js';
import { objectiveState } from '../engine/scoring.js';
import { audio } from '../engine/audio.js';
import { Px, useUI } from './ui.jsx';
import AppWindow from './AppWindow.jsx';
import { REGISTRY } from './registry.jsx';

function Wallpaper({ id }) {
  const [prev, setPrev] = useState(null); const last = useRef(id);
  useEffect(() => { if (last.current !== id) { setPrev(last.current); last.current = id; const t = setTimeout(() => setPrev(null), 700); return () => clearTimeout(t); } }, [id]);
  const st = (w) => (w === 'teal' ? { background: 'var(--cd-desktop)' } : { backgroundImage: `url(${A.wall(w)})` });
  return (
    <div className="wallpaper" aria-hidden="true">
      {prev && <div className="wp prev" style={st(prev)} />}
      <div key={id} className={`wp ${prev ? 'fade-in' : ''}`} style={st(id)} />
      <div className="ambient" />
    </div>
  );
}

export function MissionCard() {
  const { s, d } = useStore();
  const obj = objectiveState(s);
  const done = MISSION.objectives.filter((o) => obj[o.id]).length;
  if (!s.missionOpen) return null;
  return (
    <aside className="mission win active" aria-label="Mission">
      <div className="titlebar"><Px src={A.app('mission')} size={16} className="ticon" /><span className="ttext">{MISSION.title}</span>
        <button className="wbtn" aria-label="Hide mission card" onClick={() => d({ type: 'mission', open: false })}><span className="g min" /></button></div>
      <div className="mission-body">
        <Px src={A.finn('idle')} size={48} className="mission-finn" />
        <p>{MISSION.brief}</p>
        <ul className="objs">
          {MISSION.objectives.map((o) => <li key={o.id} className={obj[o.id] ? 'done' : ''}><span className="ob" aria-hidden="true">{obj[o.id] ? '✔' : ''}</span>{o.label}</li>)}
        </ul>
        <div className="mission-foot">{done}/{MISSION.objectives.length} objectives</div>
      </div>
    </aside>
  );
}

export default function Desktop({ reveal, onShutdown }) {
  const { s, act } = useStore(); const ui = useUI();
  const areaRef = useRef(); const [area, setArea] = useState({ w: 1000, h: 600 });
  const [sel, setSel] = useState([]); const [band, setBand] = useState(null);
  const iconRefs = useRef({});

  useLayoutEffect(() => {
    const el = areaRef.current; const m = () => setArea({ w: el.clientWidth, h: el.clientHeight });
    m(); const ro = new ResizeObserver(m); ro.observe(el); return () => ro.disconnect();
  }, []);

  const trash = s.files.some((f) => f.folder === '__trash') || Object.values(s.mail).some((m) => m.folder === 'trash');
  const open = (ic) => { if (ic.special === 'recycle') act.launch('files', { folder: 'Recycle Bin' }); else if (ic.shortcut) act.launch('notes', { file: 'f1' }); else act.launch(ic.app); };

  const startBand = (e) => {
    if (e.target.closest('.dicon') || e.button !== 0) return;
    const r = areaRef.current.getBoundingClientRect(); const sx = e.clientX - r.left, sy = e.clientY - r.top;
    setSel([]);
    const move = (ev) => {
      const x = ev.clientX - r.left, y = ev.clientY - r.top; const b = { x: Math.min(sx, x), y: Math.min(sy, y), w: Math.abs(x - sx), h: Math.abs(y - sy) };
      setBand(b);
      setSel(DESKTOP_ICONS.filter((ic) => { const el = iconRefs.current[ic.id]; if (!el) return false; const q = el.getBoundingClientRect(); const qx = q.left - r.left, qy = q.top - r.top; return qx < b.x + b.w && qx + q.width > b.x && qy < b.y + b.h && qy + q.height > b.y; }).map((i) => i.id));
    };
    const up = () => { setBand(null); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  };

  const deskMenu = (e) => ui.menu(e, [
    { label: 'Refresh', onClick: () => act.log('Desktop refreshed') },
    { sep: 1 },
    ...WALLPAPERS.map((w) => ({ label: `Wallpaper: ${w.name}${s.settings.wallpaper === w.id ? ' ✓' : ''}`, onClick: () => act.set({ wallpaper: w.id }) })),
    { sep: 1 }, { label: 'Mission Brief', icon: A.app('mission'), onClick: () => act.launch('mission') },
    { label: 'Display & Sound…', icon: A.app('settings'), onClick: () => act.launch('settings') }, { label: 'Shut Down…', icon: A.sys('power'), onClick: onShutdown },
  ]);
  const iconMenu = (ic) => (e) => { setSel([ic.id]); ui.menu(e, [
    { label: 'Open', onClick: () => open(ic) },
    ...(ic.special === 'recycle' ? [{ label: 'Empty Recycle Bin', disabled: !trash, onClick: async () => { const r = await ui.dialog({ kind: 'confirm', title: 'Empty Recycle Bin', text: 'Permanently delete the items in the Recycle Bin?', buttons: [{ label: 'Yes', value: 'y', def: true }, { label: 'No', value: 'n', cancel: true }] }); if (r === 'y') { act.emptyRecycle?.(); } } }] : []),
  ]); };

  return (
    <div className={`desktop ${reveal ? 'reveal' : ''}`}>
      <div className="workarea" ref={areaRef} onPointerDown={startBand} onContextMenu={deskMenu}>
        <Wallpaper id={s.settings.wallpaper} />
        <div className="icons" role="list" aria-label="Desktop icons">
          {DESKTOP_ICONS.map((ic) => {
            const src = ic.special === 'recycle' ? asset(`desktop/recycle-${trash ? 'full' : 'empty'}.svg`) : appIcon(ic.app);
            return (
              <button key={ic.id} role="listitem" ref={(el) => { iconRefs.current[ic.id] = el; }} className={`dicon ${sel.includes(ic.id) ? 'sel' : ''}`}
                onClick={(e) => { setSel([ic.id]); if (s.settings.touch) open(ic); }} onDoubleClick={() => open(ic)} onContextMenu={iconMenu(ic)}
                onKeyDown={(e) => { if (e.key === 'Enter') open(ic); }} onFocus={() => setSel([ic.id])} aria-label={`${ic.label}${ic.special === 'recycle' ? (trash ? ', full' : ', empty') : ''}`}>
                <span className="dimg"><Px src={src} size={32} />{ic.shortcut && <Px src={A.overlay('shortcut')} size={10} className="sc-arrow" />}</span>
                <span className="dlabel">{ic.label}</span>
              </button>
            );
          })}
        </div>
        {band && <div className="band" style={{ left: band.x, top: band.y, width: band.w, height: band.h }} />}
        <MissionCard />
        {s.windows.map((w) => { const C = REGISTRY[w.app]; return <AppWindow key={w.id} win={w} area={area}><C win={w} {...w.props} /></AppWindow>; })}
      </div>
    </div>
  );
}
