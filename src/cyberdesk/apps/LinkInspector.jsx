import { useBusyCursor } from '../engine/busy.js';
import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../engine/store.jsx';
import { EVIDENCE, emailById } from '../engine/scenario.js';
import { analyse, parseUrl } from '../engine/urlTools.js';
import { A } from '../engine/assets.js';
import { Px, Button, Input, Tabs, Checkbox, ProgressBar, useUI } from '../os/ui.jsx';

const STAGES = ['Parsing URL…', 'Checking simulated reputation data…', 'Following redirects (simulated)…', 'Done'];
const PART_HELP = {
  protocol: 'The protocol: https means the connection is encrypted. It says nothing about whether the site is honest.',
  subdomain: 'Subdomains are chosen freely by whoever owns the domain. "eastbrook" here is just a label, not proof.',
  registrable: 'The registrable domain is the part that is actually bought and owned. This is the part to compare with the real organisation.',
  path: 'The path points to a page on that site. It can look official but proves nothing.',
  params: 'Parameters carry extra data, such as tracking IDs or where to send you after login.',
};

function CertBody({ site, host }) {
  const [t, setT] = useState('general'); const c = site?.cert;
  if (!c) return <p>No simulated certificate data for {host}.</p>;
  return (
    <Tabs tabs={[{ id: 'general', label: 'General' }, { id: 'details', label: 'Details' }]} value={t} onChange={setT}>
      {t === 'general' ? (<div className="cert"><Px src={A.evidence('cert')} size={32} /><div>
        <p><b>{c.valid && !c.mismatch ? 'This certificate is valid for this site.' : c.valid ? 'Valid, but not tied to a verified organisation.' : 'This certificate is not valid.'}</b></p>
        <p>Issued to: {c.subject}</p><p>Organisation: {c.org}</p><p>Issued by: {c.issuer}</p><p>Valid: {c.from} to {c.to}</p></div></div>)
        : (<table className="props"><tbody><tr><th>Version</th><td>V3</td></tr><tr><th>Subject</th><td>CN={c.subject}</td></tr><tr><th>Organisation</th><td>{c.org}</td></tr><tr><th>Issuer</th><td>{c.issuer}</td></tr><tr><th>Valid from</th><td>{c.from}</td></tr><tr><th>Valid to</th><td>{c.to}</td></tr><tr><th>Alt names</th><td>{c.san.join(', ')}</td></tr></tbody></table>)}
      <p className="sim">Fictional certificate for training purposes.</p>
    </Tabs>
  );
}

function Chain({ result, reveal }) {
  const nodes = result.chain; const w = 320, h = 44, gap = 34;
  return (
    <svg className="chain" width={w + 20} height={nodes.length * (h + gap) + 6} role="img" aria-label={`Redirect chain with ${nodes.length} step${nodes.length > 1 ? 's' : ''}`}>
      <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#000" /></marker></defs>
      {nodes.map((n, i) => { const p = parseUrl(n); const y = 3 + i * (h + gap); const last = i === nodes.length - 1; const bad = result.reputation === 'suspicious' && last;
        return (
          <g key={i} className={`cnode ${i < reveal ? 'in' : ''}`} style={{ transitionDelay: '0ms' }}>
            {i > 0 && <line x1={w / 2 + 10} y1={y - gap + h} x2={w / 2 + 10} y2={y - 4} stroke="#000" strokeWidth="2" markerEnd="url(#arr)" className="carrow" />}
            <rect x="10" y={y} width={w} height={h} fill={bad ? '#ffd0d0' : last ? '#d8f0d8' : '#fff'} stroke="#000" strokeWidth="2" />
            <text x="16" y={y + 16} fontFamily="CyberDesk Mono, monospace" fontSize="15" fill="#000">{i + 1}. {p.ok ? p.hostname : n}</text>
            <text x="16" y={y + 34} fontFamily="CyberDesk Mono, monospace" fontSize="13" fill="#555">{p.ok ? (p.path + p.search).slice(0, 44) : ''}</text>
          </g>); })}
    </svg>
  );
}

export default function LinkInspector({ win, url, text, emailId, nonce }) {
  const { s, act } = useStore(); const ui = useUI();
  const [input, setInput] = useState(url || ''); const [stage, setStage] = useState(0); const [busy, setBusy] = useState(false); const [res, setRes] = useState(null); useBusyCursor(busy);
  const [tab, setTab] = useState('overview'); const [reveal, setReveal] = useState(0); const [rchain, setRchain] = useState(0); const [part, setPart] = useState(null);
  const [ctxEmail, setCtxEmail] = useState(emailId || null); const [shown, setShown] = useState(text || null);
  const T = useRef([]); useEffect(() => () => T.current.forEach(clearTimeout), []);

  const run = (u = input, t = shown, em = ctxEmail) => {
    if (!u.trim() || busy) return; T.current.forEach(clearTimeout); T.current = [];
    setBusy(true); setRes(null); setReveal(0); setRchain(0); setStage(0); setTab('overview');
    const r = analyse(u.trim(), t);
    [450, 950, 1450].forEach((ms, i) => T.current.push(setTimeout(() => setStage(i + 1), ms)));
    T.current.push(setTimeout(() => {
      setRes(r); setBusy(false); act.analyse(u.trim()); act.log(`Link Inspector analysed ${u.trim()} -> ${r.reputation}`);
      if (em && r.evidence.length) act.discover(em, r.evidence);
      r.findings.forEach((_, i) => T.current.push(setTimeout(() => setReveal(i + 1), 250 * (i + 1))));
    }, 1750));
  };
  useEffect(() => { if (url) { setInput(url); setShown(text || null); setCtxEmail(emailId || null); run(url, text || null, emailId || null); } }, [nonce]);
  useEffect(() => { if (tab === 'redirects' && res) { setRchain(0); res.chain.forEach((_, i) => T.current.push(setTimeout(() => setRchain(i + 1), 350 * (i + 1)))); } }, [tab, res]);

  const key = ctxEmail || input || 'general'; const note = s.notes[key] || { checked: [], text: '' };
  const toggle = (id, v) => { act.setNote(key, { checked: v ? [...note.checked, id] : note.checked.filter((x) => x !== id) }); };
  const p = res?.parsed;
  const urlParts = p?.ok ? [['protocol', p.protocol + '://'], ['subdomain', p.subdomain ? p.subdomain + '.' : ''], ['registrable', p.registrable], ['path', p.path], ['params', p.search]].filter((x) => x[1]) : [];
  const repIcon = res ? (res.reputation === 'suspicious' ? (res.findings.some((f) => f.tone === 'mismatch') ? 'mismatch' : 'suspicious') : res.reputation) : 'unknown';
  const openCert = () => ui.dialog({ kind: 'properties', icon: null, title: 'Certificate', wide: true, buttons: [{ label: 'OK', value: 'ok', def: true }], children: <CertBody site={res.site} host={p.hostname} /> });

  return (
    <div className="inspector app-col">
      <div className="insp-top">
        <label htmlFor="insp-url">Address to inspect</label>
        <div className="row"><Input id="insp-url" className="grow mono" value={input} onChange={(e) => { setInput(e.target.value); setShown(null); }} onKeyDown={(e) => e.key === 'Enter' && run()} placeholder="https://…" />
          <Button def onClick={() => run()} disabled={busy || !input.trim()}>Analyze</Button></div>
        {ctxEmail && <div className="ctxline">From message: <b>{emailById(ctxEmail)?.subject}</b>{shown && <> · link text: <code>{shown}</code></>}</div>}
        {busy && <div className="progress-row"><ProgressBar value={(stage / 3) * 100} label="Analysing" /><span>{STAGES[Math.min(stage, 2)]}</span></div>}
      </div>
      <Tabs tabs={[{ id: 'overview', label: 'Overview' }, { id: 'redirects', label: 'Redirects' }, { id: 'certificate', label: 'Certificate' }, { id: 'notes', label: 'Notes' }]} value={tab} onChange={setTab} className="grow">
        {tab === 'overview' && (
          <div className="insp-pane">
            {!res && !busy && <div className="empty big"><Px src={A.app('inspector')} size={32} /><p>Enter or inspect a link, then press Analyze. Results come from authored training data, not a live scan.</p></div>}
            {res && (<>
              <div className="urlview" aria-label="URL breakdown">{p.ok ? urlParts.map(([k, v]) => <span key={k} className={`up up-${k} ${part === k ? 'hl' : ''}`} onMouseEnter={() => setPart(k)} onMouseLeave={() => setPart(null)} tabIndex={0} onFocus={() => setPart(k)} onBlur={() => setPart(null)}>{v}</span>) : res.parsed.href}</div>
              {p.ok && <table className="breakdown"><tbody>
                {[['Protocol', 'protocol', p.protocol], ['Hostname', 'subdomain', p.hostname], ['Registrable domain', 'registrable', p.registrable], ['Path', 'path', p.path], ['Parameters', 'params', p.params.length ? p.params.map(([a, b]) => `${a}=${b}`).join(' & ') : '(none)']].map(([l, k, v]) => (
                  <tr key={k} className={part === k ? 'hl' : ''} onMouseEnter={() => setPart(k)} onMouseLeave={() => setPart(null)}><th>{l}</th><td className="mono">{v}</td></tr>))}</tbody></table>}
              <div className="explain" aria-live="polite">{part ? PART_HELP[part] : 'Hover a part of the address to see what it means.'}</div>
              <div className={`verdict ${res.reputation}`}><Px src={A.evidence(repIcon)} size={32} /><div><b>{{ known: 'Known site', suspicious: 'Suspicious', unknown: 'Unknown' }[res.reputation]}</b><small>Simulated analysis{res.site ? ` · ${res.site.brand}` : ''}</small></div></div>
              <ul className="findings">{res.findings.map((f, i) => (
                <li key={f.id} className={i < reveal ? 'in' : 'wait'}><Px src={A.evidence(i < reveal ? f.tone : 'unknown')} size={16} /><span>{f.text}</span></li>))}</ul>
            </>)}
          </div>)}
        {tab === 'redirects' && (<div className="insp-pane center">{!res ? <p className="empty">Analyze a link first.</p> : (<>
          <p>{res.chain.length > 1 ? `This link passes through ${res.chain.length - 1} redirect${res.chain.length > 2 ? 's' : ''} before arriving.` : 'No redirects: the link goes straight to its destination.'}</p><Chain result={res} reveal={rchain} /></>)}</div>)}
        {tab === 'certificate' && (<div className="insp-pane">{!res ? <p className="empty">Analyze a link first.</p> : (<>
          <p>Certificate for <b>{p.hostname}</b>: {res.site?.cert ? (res.site.cert.mismatch ? 'encrypted, but not validated to the organisation you expect.' : 'issued to the organisation shown.') : 'no simulated data.'}</p>
          <p className="note">A padlock only proves the connection is encrypted. Criminals get certificates too.</p><Button onClick={openCert}>View certificate…</Button></>)}</div>)}
        {tab === 'notes' && (
          <div className="insp-pane"><h4>Investigation checklist</h4><p className="sim">Tick the clues you believe apply. They carry over to your report. ★ = saved by an inspection action.</p>
            <div className="checklist">{EVIDENCE.map((e) => { const saved = ctxEmail && (s.evidence[ctxEmail] || []).includes(e.id); return <Checkbox key={e.id} checked={note.checked.includes(e.id)} onChange={(v) => toggle(e.id, v)} label={<>{saved ? '★ ' : ''}{e.label}</>} />; })}</div>
            <label className="blk">Notes<textarea className="inp" rows={3} value={note.text} onChange={(e) => act.setNote(key, { text: e.target.value })} /></label>
            <div className="summary-line"><b>Summary:</b> {note.checked.length ? `${note.checked.length} clue${note.checked.length > 1 ? 's' : ''}: ${note.checked.map((id) => EVIDENCE.find((x) => x.id === id).label.toLowerCase()).join('; ')}` : 'no clues ticked yet.'}</div>
          </div>)}
      </Tabs>
    </div>
  );
}
