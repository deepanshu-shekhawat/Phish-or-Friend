import React, { useState } from 'react';
import { audio } from '../engine/audio.js';

export default function Calculator() {
  const [disp, setDisp] = useState('0'); const [acc, setAcc] = useState(null); const [op, setOp] = useState(null); const [fresh, setFresh] = useState(true);
  const calc = (a, b, o) => ({ '+': a + b, '-': a - b, '*': a * b, '/': b === 0 ? NaN : a / b }[o]);
  const fmt = (n) => (Number.isFinite(n) ? String(+n.toPrecision(10)) : 'Error');
  const num = (c) => { setDisp(fresh || disp === '0' ? (c === '.' ? '0.' : c) : (c === '.' && disp.includes('.') ? disp : disp + c)); setFresh(false); };
  const oper = (o) => { const cur = parseFloat(disp); if (acc !== null && op && !fresh) { const r = calc(acc, cur, op); setAcc(r); setDisp(fmt(r)); } else setAcc(cur); setOp(o); setFresh(true); };
  const eq = () => { if (op === null || acc === null) return; const r = calc(acc, parseFloat(disp), op); setDisp(fmt(r)); setAcc(null); setOp(null); setFresh(true); };
  const clear = () => { setDisp('0'); setAcc(null); setOp(null); setFresh(true); };
  const keys = [['C', clear], ['±', () => setDisp(fmt(-parseFloat(disp)))], ['%', () => setDisp(fmt(parseFloat(disp) / 100))], ['÷', () => oper('/')],
    ...['7', '8', '9'].map((k) => [k, () => num(k)]), ['×', () => oper('*')], ...['4', '5', '6'].map((k) => [k, () => num(k)]), ['−', () => oper('-')],
    ...['1', '2', '3'].map((k) => [k, () => num(k)]), ['+', () => oper('+')], ['0', () => num('0')], ['.', () => num('.')], ['=', eq]];
  return (
    <div className="calc app-col"><output className="calc-disp" aria-live="polite">{disp}</output>
      <div className="calc-keys">{keys.map(([l, f], i) => <button key={i} className={`btn ${l === '=' ? 'default' : ''}`} onClick={() => { audio.play('click'); f(); }}>{l}</button>)}</div></div>
  );
}
