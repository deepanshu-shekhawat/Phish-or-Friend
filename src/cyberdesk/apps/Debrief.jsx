import React, { useEffect, useState } from 'react';
import { useStore } from '../engine/store.jsx';
import { EMAILS, EVIDENCE, CATEGORIES, emailById } from '../engine/scenario.js';
import { isCorrect, rankFor } from '../engine/scoring.js';
import { A } from '../engine/assets.js';
import { Px, Button } from '../os/ui.jsx';
import { XpCounter } from '../os/Notifications.jsx';

const ev = (id) => EVIDENCE.find((e) => e.id === id)?.label || id;

function useReveal(n, ms = 650) {
  const { reduced } = useStore(); const [k, setK] = useState(reduced ? n : 1);
  useEffect(() => { if (reduced) { setK(n); return; } if (k >= n) return; const t = setTimeout(() => setK(k + 1), ms); return () => clearTimeout(t); }, [k, n, reduced]);
  return [k, () => setK(n)];
}

export function Debrief({ win, emailId }) {
  const { s } = useStore(); const e = emailById(emailId); const m = s.mail[emailId]; const r = s.reports[emailId];
  const [k, skip] = useReveal(4);
  if (!e || !m) return <div className="empty big">Nothing to debrief.</div>;
  const phish = e.truth.phish; const decision = m.decision;
  const res = r?.result || m.result;
  const correct = isCorrect(s, e);
  const found = s.evidence[emailId] || [];
  return (
    <div className="debrief app-col">
      <div className="deb-scroll" aria-live="polite">
        <h3>{e.subject}</h3><div className="sub">From {e.fromName} &lt;{e.addr}&gt; · this message was <b className={phish ? 'bad' : 'good'}>{phish ? 'PHISHING' : 'LEGITIMATE'}</b></div>
        <section className="deb-sec in"><h4>1. Your decision</h4>
          {!decision ? <p>You have not made a decision on this message yet.</p> : (
            <div className="decision"><Px src={A.status(correct ? 'success' : 'error')} size={32} />
              <p><b>{decision === 'reported' ? 'You reported it' : decision === 'safe' ? 'You marked it safe' : 'You deleted it'}.</b> {correct ? 'That was the right call.' : decision === 'deleted' ? 'Deleting avoids the threat but leaves others exposed, and earns no credit.' : phish ? 'This one slipped through.' : 'This was a false alarm.'}</p></div>)}
          {r && <p className="sim">Report {r.id} · category chosen: {CATEGORIES.find((c) => c.id === r.category)?.label}{phish ? ` · expected: ${CATEGORIES.find((c) => c.id === e.truth.category)?.label}` : ''}</p>}
          {m.clicked && <p className="warnline"><Px src={A.status('warning')} size={16} /> You clicked a link in this message{phish ? ' - a real attacker would have had your visit.' : '.'}</p>}
        </section>
        {k >= 2 && <section className="deb-sec in"><h4>2. Evidence</h4>
          {phish ? (<ul className="evlist">{e.truth.evidence.map((id) => { const got = r ? r.evidence.includes(id) : false; const saved = found.includes(id);
            return <li key={id} className={got ? 'got' : 'miss'}><Px src={A.status(got ? 'success' : 'question')} size={16} /><span>{ev(id)}{saved ? ' ★' : ''}</span><small>{got ? 'you spotted this' : 'missed'}</small></li>; })}
            {r?.result.bad?.map((id) => <li key={id} className="wrong"><Px src={A.status('error')} size={16} /><span>{ev(id)}</span><small>not supported</small></li>)}</ul>)
            : (<ul className="evlist">{e.legit.map((t) => <li key={t} className="got"><Px src={A.status('verified')} size={16} /><span>{t}</span></li>)}</ul>)}</section>}
        {k >= 3 && <section className="deb-sec in"><h4>3. Lesson</h4><div className="lesson"><Px src={A.finn(correct ? 'happy' : 'thinking')} size={48} /><p>{e.lesson}</p></div></section>}
        {k >= 4 && <section className="deb-sec in"><h4>4. XP</h4>
          {res ? <ul className="xplines">{res.lines.map((l, i) => <li key={i}><span>{l.label}</span><b className={l.xp < 0 ? 'bad' : ''}>{l.xp >= 0 ? '+' : ''}{l.xp}</b></li>)}<li className="total"><span>Total</span><b>+{res.xp} XP</b></li></ul> : <p>No XP for this message.</p>}
          <XpCounter /></section>}
      </div>
      <div className="form-foot">{k < 4 && <Button onClick={skip}>Skip animation</Button>}</div>
    </div>
  );
}

export function Summary({ win }) {
  const { s, act } = useStore(); const [k, skip] = useReveal(3, 800);
  const total = EMAILS.length; const delivered = EMAILS.filter((e) => s.mail[e.id]);
  const decided = delivered.filter((e) => s.mail[e.id].decision); const right = decided.filter((e) => isCorrect(s, e));
  const phish = EMAILS.filter((e) => e.truth.phish); const caught = phish.filter((e) => s.reports[e.id]?.result.outcome === 'accepted').length;
  const falseA = Object.values(s.reports).filter((r) => r.result.outcome === 'rejected').length;
  const clicked = EMAILS.filter((e) => e.truth.phish && s.mail[e.id]?.clicked).length; const creds = s.sites.filter((x) => x.submitted && x.fake).length;
  const ach = Object.keys(s.achievements); const rank = rankFor(s.xp);
  const pct = decided.length ? right.length / decided.length : 0;
  const mins = Math.max(1, Math.round((Date.now() - s.startedAt) / 60000));
  return (
    <div className="summary app-col">
      <div className="deb-scroll">
        <div className="sum-title"><Px src={A.finn(pct >= .8 ? 'happy' : decided.length ? 'thinking' : 'idle')} size={48} /><div><h3>Session summary</h3><div className="sub">Mission 01: Monday Inbox · {mins} min</div></div></div>
        {k >= 2 && <section className="deb-sec in"><h4>Decisions &amp; evidence</h4>
          <div className="metrics">
            <div><b>{decided.length}/{total}</b><small>handled</small></div><div><b>{right.length}</b><small>correct</small></div><div><b>{caught}/{phish.length}</b><small>phish caught</small></div>
            <div><b>{falseA}</b><small>false alarms</small></div><div><b>{Object.values(s.evidence).reduce((n, a) => n + a.length, 0)}</b><small>clues saved</small></div><div><b className={clicked ? 'bad' : ''}>{clicked}</b><small>phish links clicked</small></div>
            <div><b className={creds ? 'bad' : ''}>{creds}</b><small>fake forms submitted</small></div><div><b>{s.analysed.length}</b><small>links analysed</small></div></div>
          <table className="tbl"><thead><tr><th>Message</th><th>Truth</th><th>You</th><th /></tr></thead><tbody>
            {EMAILS.map((e) => { const m = s.mail[e.id]; const c = isCorrect(s, e); return <tr key={e.id}><td>{e.subject.slice(0, 40)}</td><td>{e.truth.phish ? 'Phish' : 'Safe'}</td>
              <td>{!m ? 'not arrived' : !m.decision ? '-' : <><Px src={A.status(c ? 'success' : 'error')} size={12} /> {m.decision}</>}</td><td>{m?.decision && <Button onClick={() => act.launch('debrief', { emailId: e.id })}>Debrief</Button>}</td></tr>; })}</tbody></table></section>}
        {k >= 3 && <section className="deb-sec in"><h4>Debrief complete</h4><XpCounter big />
          <h5>Achievements ({ach.length}/16)</h5><div className="achrow">{ach.length ? ach.map((id) => <Px key={id} src={A.ach(id)} size={32} title={id} />) : <small>None yet - keep investigating.</small>}</div>
          <p className="sub">Rank: <b>{rank.name}</b></p></section>}
      </div>
      <div className="form-foot">{k < 3 && <Button onClick={skip}>Skip animation</Button>}</div>
    </div>
  );
}
