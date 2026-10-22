import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../engine/store.jsx';
import { A, asset } from '../engine/assets.js';
import { audio } from '../engine/audio.js';
import { Px, Button, ProgressBar } from './ui.jsx';

export function CrtOverlay({ flicker }) {
  const { s } = useStore();
  if (!s.settings.scanlines) return null;
  return <div className={`crt ${flicker ? 'flicker' : ''}`} aria-hidden="true" />;
}

/** Startup warning: black screen -> dialog pops in -> button becomes active. */
export function WarningScreen({ onStart }) {
  const [step, setStep] = useState(0); // 0 empty, 1 dialog, 2 button active
  useEffect(() => { const a = setTimeout(() => setStep(1), 350); const b = setTimeout(() => setStep(2), 1100); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  return (
    <div className="screen black center" data-step={step}>
      {step >= 1 && (
        <div className="win active dialog warn-dialog pop" role="alertdialog" aria-labelledby="warn-t" aria-describedby="warn-d">
          <div className="titlebar"><Px src={A.status('warning')} size={16} className="ticon" /><span className="ttext" id="warn-t">CyberDesk - Training Simulation</span></div>
          <div className="dlg-body">
            <Px src={A.status('warning')} size={32} className="dlg-icon" />
            <div className="dlg-text" id="warn-d">
              <p><b>Friend or Phish? is a security-awareness simulation.</b></p>
              <p>Every site, person, company and file you will see is fictional. No real accounts are used, no passwords are stored, and no real malware is involved.</p>
              <p>Sound effects are on by default. You can mute them from the tray at any time.</p>
            </div>
          </div>
          <div className="dlg-btns"><Button def disabled={step < 2} className={step < 2 ? 'inactive' : 'ready'} onClick={onStart} autoFocus>Start CyberDesk</Button></div>
        </div>
      )}
    </div>
  );
}

const CHECKS = [
  ['memory', 'Memory test ............ 65536 KB OK'], ['storage', 'Storage ................ 2 volumes OK'], ['network', 'Network adapter ....... linked (simulated)'],
  ['audio', 'Audio device .......... ready'], ['display', 'Display ............... 640x480 OK'], ['security', 'Security module ....... training mode'],
];

export function BootScreen({ onDone }) {
  const { reduced } = useStore();
  const [frame, setFrame] = useState(1); const [lines, setLines] = useState(0); const [states, setStates] = useState(CHECKS.map(() => 'gray'));
  const [bar, setBar] = useState(0); const [diag, setDiag] = useState(false); const [fin, setFin] = useState(false); const [led, setLed] = useState(false); const [flick, setFlick] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    const k = reduced ? 0.35 : 1; const T = []; const at = (ms, fn) => T.push(setTimeout(fn, ms * k));
    at(450, () => setFrame(2)); at(950, () => { setFrame(3); if (!reduced) setFlick(true); });
    at(1500, () => setDiag(true));
    CHECKS.forEach((_, i) => {
      const t = 1800 + i * 420;
      at(t, () => { setLines(i + 1); setLed(true); }); at(t + 120, () => setLed(false));
      at(t + 160, () => setStates((s) => s.map((v, j) => (j === i ? 'color' : v)))); at(t + 330, () => setStates((s) => s.map((v, j) => (j === i ? 'check' : v))));
    });
    at(2000, () => setBar(25)); at(3200, () => setBar(60)); at(4500, () => setBar(100));
    at(4400, () => setFin(true));
    at(5100, () => finish());
    return () => T.forEach(clearTimeout);
  }, [reduced]);
  const finish = () => { if (done.current) return; done.current = true; onDone(); };
  useEffect(() => { const k = (e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish(); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);

  return (
    <div className={`screen boot ${flick ? 'flicker-once' : ''}`} onPointerDown={finish} role="status" aria-label="CyberDesk is starting. Press any key to skip.">
      <div className="boot-bg" style={{ backgroundImage: `url(${asset('boot/boot-bg.png')})` }} />
      <div className="boot-logo-wrap">
        <Px src={asset(`boot/logo-frame${frame}.svg`)} className={`boot-logo f${frame}`} w={384} alt="CyberDesk" />
        <Px src={asset('boot/emblem.svg')} size={32} className={`boot-emblem ${frame === 3 ? 'pulse' : ''}`} />
      </div>
      {diag && (
        <div className="diag" aria-hidden="true">
          {CHECKS.slice(0, lines).map(([k, t], i) => (
            <div key={k} className="diag-line"><Px src={A.init(k, states[i] === 'gray' ? 'gray' : states[i] === 'check' ? 'check' : '')} size={16} /><span>{t}</span></div>
          ))}
          {fin ? <div className="diag-line ok">All checks complete.<span className="cursor" /></div> : <div className="diag-line"><span className="cursor" /></div>}
        </div>
      )}
      <div className="boot-bar"><ProgressBar value={bar} segments label="Loading" /><span className="led-wrap"><Px src={asset(`boot/disk-led-${led ? 'on' : 'off'}.svg`)} size={8} /></span></div>
      <div className="boot-hint">Click or press any key to skip</div>
    </div>
  );
}

/** Desktop dims -> shutdown text -> black -> onExit. */
export function ShutdownScreen({ onExit }) {
  const { reduced } = useStore(); const [step, setStep] = useState(0);
  useEffect(() => {
    audio.play('shutdown'); audio.stopAmbience();
    const k = reduced ? 0.3 : 1; const T = [setTimeout(() => setStep(1), 700 * k), setTimeout(() => setStep(2), 2800 * k), setTimeout(() => onExit && onExit(), 3600 * k)];
    return () => T.forEach(clearTimeout);
  }, []);
  return (
    <div className={`screen shutdown step${step}`} role="status" aria-label="CyberDesk is shutting down">
      <div className="sd-center">
        <Px src={asset('boot/emblem.svg')} size={64} className="sd-logo" />
        <p>YOU MAY NOW SAFELY</p><p>POWER OFF CYBERDESK</p>
      </div>
    </div>
  );
}
