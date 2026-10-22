import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../engine/store.jsx';
import { A } from '../engine/assets.js';
import { audio } from '../engine/audio.js';
import { rankFor, nextRank } from '../engine/scoring.js';
import { Px, ProgressBar } from './ui.jsx';

const ICON = {
  email: () => A.app('mail'), security: () => A.status('warning'), download: () => A.app('downloads'), network: () => A.sys('network'), update: () => A.sys('control_panel'),
  xp: () => A.status('success'), task: () => A.status('success'), evidence: () => A.status('evidence'), error: () => A.status('error'),
};

function Toast({ t }) {
  const { d, act } = useStore();
  const [phase, setPhase] = useState('in'); // in -> visible -> out
  const hover = useRef(false);
  useEffect(() => {
    const a = setTimeout(() => setPhase('visible'), 280);
    let b; const arm = () => { b = setTimeout(() => { if (hover.current) return arm(); setPhase('out'); }, t.ms || 5200); }; arm();
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [t.id]);
  useEffect(() => { if (phase === 'out') { const c = setTimeout(() => d({ type: 'toast/remove', id: t.id }), 330); return () => clearTimeout(c); } }, [phase]);
  const src = t.kind === 'achievement' && t.achId ? A.ach(t.achId) : (ICON[t.kind] || ICON.task)();
  const open = () => { if (t.action) act.launch(t.action.app, t.action.props); setPhase('out'); };
  return (
    <div className={`toast kind-${t.kind} ${phase}`} role="status" onMouseEnter={() => { hover.current = true; }} onMouseLeave={() => { hover.current = false; }}>
      <Px src={src} size={t.kind === 'achievement' ? 32 : 32} className={t.kind === 'achievement' ? 'ach-pop' : ''} />
      <div className="toast-txt" onClick={t.action ? open : undefined} style={{ cursor: t.action ? 'var(--cd-cur-hand)' : undefined }}>
        <b>{t.title}</b><span>{t.text}</span>{t.action && <em>Click to open</em>}
      </div>
      <button className="wbtn sm" aria-label="Dismiss notification" onClick={() => setPhase('out')}><span className="g close" /></button>
    </div>
  );
}

export function Toasts() {
  const { s } = useStore();
  return <div className="toasts" aria-live="polite">{s.toasts.map((t) => <Toast key={t.id} t={t} />)}</div>;
}

export function useCountUp(value) {
  const { reduced } = useStore();
  const [shown, setShown] = useState(value); const prev = useRef(value); const [delta, setDelta] = useState(0);
  useEffect(() => {
    if (value === prev.current) return;
    const from = prev.current; prev.current = value; setDelta(value - from);
    if (reduced) { setShown(value); return; }
    const t0 = performance.now(); let raf; let lastV = from; let lastTick = 0;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 800); const v = Math.round(from + (value - from) * p); setShown(v);
      if (v !== lastV && t - lastTick > 85) { audio.play('xp'); lastTick = t; } lastV = v;
      if (p < 1) raf = requestAnimationFrame(step); else setTimeout(() => setDelta(0), 900);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, reduced]);
  return { shown, delta };
}

/** Large XP counter + progress bar (debrief, summary, system properties). */
export function XpCounter({ big }) {
  const { s } = useStore();
  const { shown, delta } = useCountUp(s.xp);
  const r = rankFor(shown); const n = nextRank(shown);
  const pct = n ? ((shown - r.xp) / (n.xp - r.xp)) * 100 : 100;
  return (
    <div className={`xp ${big ? 'big' : ''}`}>
      <div className="xp-row"><Px src={A.rank(r.id)} size={big ? 48 : 32} /><div>
        <div className="xp-num" aria-live="polite">{String(shown).padStart(4, '0')}<small> XP</small>{delta > 0 && <span className="xp-delta">+{delta}</span>}</div>
        <div className="xp-rank">{r.name}</div></div></div>
      <ProgressBar value={pct} label="Progress to next rank" />
      <div className="xp-next">{n ? `${n.xp - shown} XP to ${n.name}` : 'Top rank reached'}</div>
    </div>
  );
}

export function XpMini() {
  const { s, act } = useStore();
  const { shown, delta } = useCountUp(s.xp); const r = rankFor(shown); const n = nextRank(shown);
  const pct = n ? ((shown - r.xp) / (n.xp - r.xp)) * 100 : 100;
  return (
    <button className={`xpmini ${delta ? 'flash' : ''}`} onClick={() => act.launch('sysprops')} aria-label={`${shown} XP, rank ${r.name}`} title={`${r.name} - ${shown} XP`}>
      <Px src={A.rank(r.id)} size={16} /><span className="xpn">{shown}</span><span className="xpb"><i style={{ width: pct + '%' }} /></span>
    </button>
  );
}
