import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../engine/store.jsx';
import { APPS, appIcon } from '../engine/apps.js';
import { A } from '../engine/assets.js';
import { Px, useUI, Tip } from './ui.jsx';
import { audio } from '../engine/audio.js';
import { XpMini } from './Notifications.jsx';

export function Clock({ onToggle, open }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <button className={`clock ${open ? 'pressed' : ''}`} onClick={onToggle} aria-label={`Clock ${now.toLocaleTimeString()}, open calendar`} aria-expanded={open}>
      {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </button>
  );
}

export function Calendar({ onClose }) {
  const now = new Date(); const [cur, setCur] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const ref = useRef();
  useEffect(() => {
    const down = (e) => { if (!ref.current.contains(e.target) && !e.target.closest('.clock')) onClose(); };
    const key = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('mousedown', down); window.addEventListener('keydown', key);
    return () => { window.removeEventListener('mousedown', down); window.removeEventListener('keydown', key); };
  }, [onClose]);
  const first = cur.getDay(); const days = new Date(cur.getFullYear(), cur.getMonth() + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const isToday = (n) => n && cur.getFullYear() === now.getFullYear() && cur.getMonth() === now.getMonth() && n === now.getDate();
  return (
    <div className="calendar" ref={ref} role="dialog" aria-label="Calendar">
      <div className="cal-head">
        <button className="btn sm" aria-label="Previous month" onClick={() => setCur(new Date(cur.getFullYear(), cur.getMonth() - 1, 1))}><span className="g left" /></button>
        <strong>{cur.toLocaleDateString([], { month: 'long', year: 'numeric' })}</strong>
        <button className="btn sm" aria-label="Next month" onClick={() => setCur(new Date(cur.getFullYear(), cur.getMonth() + 1, 1))}><span className="g right" /></button>
      </div>
      <div className="cal-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="dow">{d}</span>)}
        {cells.map((n, i) => <span key={i} className={`day ${isToday(n) ? 'today' : ''}`}>{n}</span>)}
      </div>
      <div className="cal-foot">{now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</div>
    </div>
  );
}

export function Tray({ onCal, calOpen }) {
  const { s, act } = useStore();
  const down = s.tray.network === 'down'; const alert = s.tray.security === 'alert';
  return (
    <div className="tray" role="group" aria-label="System tray">
      <Tip text={down ? 'Network: disconnected' : 'Network: connected'}>
        <span className="tray-ico" tabIndex={0} aria-label={down ? 'Network disconnected' : 'Network connected'}>
          <Px src={A.sys('network')} size={16} className={down ? 'dim' : ''} />{down && <Px src={A.status('blocked')} size={8} className="tray-x" />}
        </span>
      </Tip>
      <Tip text={s.settings.sound ? 'Volume: on (click to mute)' : 'Volume: muted (click to unmute)'}>
        <button className="tray-ico" onClick={() => act.set({ sound: !s.settings.sound })} aria-label={s.settings.sound ? 'Mute sound' : 'Unmute sound'} aria-pressed={!s.settings.sound}>
          <Px src={A.sys('speaker')} size={16} className={s.settings.sound ? '' : 'dim'} />{!s.settings.sound && <Px src={A.status('blocked')} size={8} className="tray-x" />}
        </button>
      </Tip>
      <Tip text={alert ? 'Security: alert' : 'Security: protected (training mode)'}>
        <button className={`tray-ico ${alert ? 'pulse' : ''}`} onClick={() => act.launch('security')} aria-label={alert ? 'Security alert' : 'Security status ok'}>
          <Px src={A.status(alert ? 'warning' : 'shield')} size={16} />
        </button>
      </Tip>
      <XpMini />
      <Clock onToggle={onCal} open={calOpen} />
    </div>
  );
}

export function StartMenu({ onClose, onShutdown }) {
  const { act } = useStore(); const ref = useRef();
  useEffect(() => {
    const down = (e) => { if (!ref.current.contains(e.target) && !e.target.closest('.start-btn')) onClose(); };
    const key = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('mousedown', down); window.addEventListener('keydown', key);
    ref.current.querySelector('button')?.focus();
    return () => { window.removeEventListener('mousedown', down); window.removeEventListener('keydown', key); };
  }, [onClose]);
  const go = (fn) => () => { onClose(); fn(); };
  const rows = [
    { l: 'Mission Brief', i: A.app('mission'), f: () => act.launch('mission') }, { l: 'CyberMail', i: A.app('mail'), f: () => act.launch('mail') }, { l: 'CyberSurf', i: A.app('browser'), f: () => act.launch('browser') },
    { l: 'Link Inspector', i: A.app('inspector'), f: () => act.launch('inspector') }, { l: 'Security Center', i: A.app('security'), f: () => act.launch('security') },
    { sep: 1 }, { l: 'Files', i: A.app('files'), f: () => act.launch('files') }, { l: 'Notes', i: A.app('notes'), f: () => act.launch('notes') }, { l: 'Calculator', i: A.app('calculator'), f: () => act.launch('calculator') },
    { l: 'Downloads', i: A.app('downloads'), f: () => act.launch('downloads') }, { l: 'System Log', i: A.app('terminal'), f: () => act.launch('terminal') },
    { sep: 1 }, { l: 'Display & Sound', i: A.app('settings'), f: () => act.launch('settings') }, { l: 'System Properties', i: A.sys('my_computer'), f: () => act.launch('sysprops') }, { l: 'Help', i: A.app('help'), f: () => act.launch('help') },
    { l: 'Session Summary', i: A.sys('documents'), f: () => act.launch('summary') },
    { sep: 1 }, { l: 'Shut Down…', i: A.sys('power'), f: onShutdown },
  ];
  return (
    <div className="startmenu" ref={ref} role="menu" aria-label="Start menu">
      <div className="sm-side"><span>CyberDesk</span></div>
      <div className="sm-rows">
        {rows.map((r, i) => r.sep ? <div key={i} className="msep" /> : (
          <button key={i} role="menuitem" className="mrow big" onClick={go(r.f)}><Px src={r.i} size={24} /><span>{r.l}</span></button>
        ))}
      </div>
    </div>
  );
}

export function Taskbar({ onShutdown }) {
  const { s, d, act } = useStore();
  const [start, setStart] = useState(false); const [cal, setCal] = useState(false);
  const click = (w) => {
    audio.play('click');
    if (w.minimized) d({ type: 'win/restore', id: w.id });
    else if (s.focus === w.id) act.minWin(w.id);
    else d({ type: 'win/focus', id: w.id });
  };
  return (
    <>
      {start && <StartMenu onClose={() => setStart(false)} onShutdown={onShutdown} />}
      {cal && <Calendar onClose={() => setCal(false)} />}
      <nav className="taskbar" aria-label="Taskbar">
        <button className={`start-btn btn ${start ? 'pressed' : ''}`} aria-haspopup="menu" aria-expanded={start} onClick={() => { audio.play('menu-open'); setStart(!start); setCal(false); }}>
          <Px src={A.sys('programs')} size={20} /><b>Start</b>
        </button>
        <span className="tb-sep" />
        <div className="tb-wins" role="tablist" aria-label="Open windows">
          {s.windows.map((w) => {
            const on = s.focus === w.id && !w.minimized;
            return (
              <button key={w.id} role="tab" aria-selected={on} className={`tb-win btn ${on ? 'pressed' : ''}`} onClick={() => click(w)} title={w.title}>
                <Px src={appIcon(w.app)} size={16} /><span>{w.title}</span>
              </button>
            );
          })}
        </div>
        <Tray onCal={() => { setCal(!cal); setStart(false); }} calOpen={cal} />
      </nav>
    </>
  );
}
