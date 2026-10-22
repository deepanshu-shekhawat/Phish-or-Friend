import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../engine/store.jsx';
import { CATEGORIES, EVIDENCE, EMAILS, emailById } from '../engine/scenario.js';
import { A } from '../engine/assets.js';
import { Px, Button, Checkbox, Select, ProgressBar, useUI } from '../os/ui.jsx';

const STATUS = { submitted: ['Submitted', 'pending'], review: ['Under review', 'suspicious'], resolved: ['Resolved', 'success'] };

function Badge({ status }) { const [l, ic] = STATUS[status] || STATUS.submitted; return <span className={`badge st-${status}`}><Px src={A.status(ic)} size={12} />{l}</span>; }

export default function SecurityCenter({ win, emailId, nonce }) {
  const { s, act } = useStore(); const ui = useUI();
  const open = Object.values(s.reports).sort((a, b) => b.submittedAt - a.submittedAt);
  const candidates = EMAILS.filter((e) => s.mail[e.id] && !s.reports[e.id] && !s.mail[e.id].decision);
  const [view, setView] = useState(emailId ? 'form' : 'dash');
  const [f, setF] = useState({ emailId: emailId || '', category: '', evidence: [], notes: '' });
  const [errs, setErrs] = useState({}); const [prog, setProg] = useState(null);
  const shownRej = useRef(new Set());

  useEffect(() => { if (emailId) startForm(emailId); }, [nonce]);
  const startForm = (id) => { const pre = s.notes[id]?.checked || []; const saved = s.evidence[id] || []; setF({ emailId: id || '', category: '', evidence: [...new Set([...pre])], notes: s.notes[id]?.text || '' }); setErrs({}); setView('form'); };

  useEffect(() => {
    open.forEach((r) => { if (r.status === 'resolved' && r.result.outcome === 'rejected' && !shownRej.current.has(r.id)) { shownRej.current.add(r.id);
      ui.dialog({ kind: 'error', title: `Report ${r.id} rejected`, text: `"${emailById(r.emailId).subject}" was a legitimate message. Reporting real mail as phishing wastes responders' time. Review the debrief to see which signals showed it was safe.`, buttons: [{ label: 'Open debrief', value: 'd', def: true }, { label: 'Close', value: 'c', cancel: true }] }).then((v) => v === 'd' && act.launch('debrief', { emailId: r.emailId })); } });
  }, [s.reports]);

  const submit = async () => {
    const e = {}; if (!f.emailId) e.emailId = 'Choose the message you are reporting.'; if (!f.category) e.category = 'Choose a threat category.'; if (!f.evidence.length) e.evidence = 'Tick at least one piece of evidence.';
    setErrs(e);
    if (Object.keys(e).length) { await ui.dialog({ kind: 'warning', title: 'Incomplete report', text: 'Your report is missing required information:', children: <ul>{Object.values(e).map((m) => <li key={m}>{m}</li>)}</ul> }); return; }
    if (s.reports[f.emailId]) { await ui.dialog({ kind: 'info', title: 'Already reported', text: 'This message has already been reported. Each message is scored once.' }); return; }
    setProg(0); [20, 55, 90, 100].forEach((p, i) => setTimeout(() => setProg(p), 250 * (i + 1)));
    await new Promise((r) => setTimeout(r, 1150));
    const res = act.submitReport({ emailId: f.emailId, category: f.category, evidence: f.evidence, notes: f.notes });
    setProg(null);
    if (res.status === 'duplicate' || res.status === 'incomplete') { await ui.dialog({ kind: 'info', title: 'Not submitted', text: 'The report could not be submitted.' }); return; }
    await ui.dialog({ kind: 'success', title: 'Report submitted', text: `Report ${res.id} was sent to the Security Center. Status will move from Submitted to Under review to Resolved.` });
    setView('dash');
  };

  if (view === 'form') return (
    <div className="seccenter app-col">
      <div className="form-scroll">
        <h3>New incident report</h3>
        <label className={`blk ${errs.emailId ? 'err' : ''}`}>Message
          <Select value={f.emailId} onChange={(v) => { setF({ ...f, emailId: v, evidence: s.notes[v]?.checked || [] }); }} options={[{ value: '', label: '- choose a message -' }, ...candidates.map((e) => ({ value: e.id, label: `${e.fromName}: ${e.subject}`.slice(0, 64) }))]} aria-invalid={!!errs.emailId} /></label>
        <fieldset className={`group ${errs.category ? 'invalid' : ''}`}><legend>Threat category *</legend>
          <div className="cats" role="radiogroup" aria-label="Threat category">
            {CATEGORIES.map((c) => <button key={c.id} role="radio" aria-checked={f.category === c.id} className={`cat ${f.category === c.id ? 'on' : ''}`} onClick={() => setF({ ...f, category: c.id })}><Px src={A.threat(c.id === 'spoof' ? 'spoof' : c.id)} size={32} /><span>{c.label}</span></button>)}
          </div>{errs.category && <div className="errmsg">{errs.category}</div>}</fieldset>
        <fieldset className={`group ${errs.evidence ? 'invalid' : ''}`}><legend>Evidence * <small>(★ = saved while investigating)</small></legend>
          <div className="checklist two">{EVIDENCE.map((e) => { const saved = f.emailId && (s.evidence[f.emailId] || []).includes(e.id);
            return <Checkbox key={e.id} checked={f.evidence.includes(e.id)} onChange={(v) => setF({ ...f, evidence: v ? [...f.evidence, e.id] : f.evidence.filter((x) => x !== e.id) })} label={<>{saved ? <span className="star" title="Saved evidence">★ </span> : ''}{e.label}</>} />; })}</div>
          {errs.evidence && <div className="errmsg">{errs.evidence}</div>}</fieldset>
        <label className="blk">Notes (optional)<textarea className="inp" rows={3} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></label>
      </div>
      <div className="form-foot">{prog !== null ? <><ProgressBar value={prog} label="Submitting report" /><span>Submitting…</span></> : <><Button def onClick={submit}>Submit report</Button><Button onClick={() => setView('dash')}>Cancel</Button></>}</div>
    </div>
  );

  const resolved = open.filter((r) => r.status === 'resolved').length;
  return (
    <div className="seccenter app-col">
      <div className="sc-top">
        <div className="tile"><Px src={A.status('shield')} size={32} /><div><b>{s.tray.security === 'alert' ? 'Attention needed' : 'Protected'}</b><small>Training mode</small></div></div>
        <div className="tile"><b className="big">{open.length}</b><small>Reports</small></div>
        <div className="tile"><b className="big">{resolved}</b><small>Resolved</small></div>
        <span className="grow" /><Button def onClick={() => startForm('')}>New report…</Button>
      </div>
      <h4 className="pad">Incident history</h4>
      <div className="table-wrap"><table className="tbl hist"><thead><tr><th>ID</th><th>Message</th><th>Category</th><th>Status</th><th /></tr></thead><tbody>
        {open.length === 0 && <tr><td colSpan="5" className="empty">No reports yet. Open CyberMail, investigate a message, then press Report.</td></tr>}
        {open.map((r) => <tr key={r.id}><td>{r.id}</td><td>{emailById(r.emailId).subject}</td><td>{CATEGORIES.find((c) => c.id === r.category)?.label}</td><td><Badge status={r.status} /></td>
          <td>{r.status === 'resolved' && <Button onClick={() => act.launch('debrief', { emailId: r.emailId })}>Debrief</Button>}</td></tr>)}</tbody></table></div>
    </div>
  );
}
