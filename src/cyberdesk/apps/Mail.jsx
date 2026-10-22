import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../engine/store.jsx';
import { EMAILS, emailById, ME } from '../engine/scenario.js';
import { A } from '../engine/assets.js';
import { parseUrl } from '../engine/urlTools.js';
import { useAssetData } from '../engine/data.js';
import { Px, Button, Checkbox, Input, Select, Tip, ProgressBar, useUI } from '../os/ui.jsx';

const FOLDERS = [{ id: 'inbox', label: 'Inbox' }, { id: 'archive', label: 'Archive / Handled' }, { id: 'trash', label: 'Deleted Items' }];

function Seg({ seg, email, ctx }) {
  if (typeof seg === 'string') return <>{seg}</>;
  if (seg.clue) {
    const found = (ctx.found || []).includes(seg.clue);
    return (
      <span className={`clue ${ctx.highlight ? 'on' : ''} ${found ? 'found' : ''}`} tabIndex={ctx.highlight ? 0 : undefined} role={ctx.highlight ? 'button' : undefined}
        title={ctx.highlight ? 'Click to save as evidence' : undefined} onClick={() => ctx.highlight && ctx.flag(seg.clue)} onKeyDown={(e) => { if (ctx.highlight && e.key === 'Enter') ctx.flag(seg.clue); }}>{seg.text}</span>
    );
  }
  return <MailLink id={seg.link} email={email} ctx={ctx} />;
}

function MailLink({ id, email, ctx, button }) {
  const l = email.links[id]; const timer = useRef();
  const text = button || l.text;
  return (
    <a href="#" className={button ? 'mbtn' : 'mlink'} onClick={(e) => { e.preventDefault(); ctx.openLink(id); }} onContextMenu={(e) => ctx.linkMenu(e, id)}
      onMouseEnter={() => { ctx.setStatus(l.href); timer.current = setTimeout(() => ctx.dwell(id), 700); }} onMouseLeave={() => { ctx.setStatus(''); clearTimeout(timer.current); }}
      onFocus={() => ctx.setStatus(l.href)} onBlur={() => ctx.setStatus('')}>{text}</a>
  );
}

function EmailBody({ email, ctx }) {
  const layouts = useAssetData('layouts'); const sigs = useAssetData('signatures');
  const [sigOpen, setSigOpen] = useState(false);
  const layout = (layouts || []).find((x) => x.id === email.layout); const sig = (sigs || []).find((x) => x.id === email.sig);
  useEffect(() => setSigOpen(false), [email.id]);
  if (!layout) return <div className="mbody-loading">Loading…</div>;
  const para = (b, i) => <p key={i}>{b.p.map((sg, j) => <Seg key={j} seg={sg} email={email} ctx={ctx} />)}</p>;
  const R = {
    banner: () => email.banner && <div key="banner" className="m-banner" style={{ background: email.banner.color }}><b>{email.banner.brand}</b><span>{email.banner.title}</span></div>,
    alertbox: () => email.alert && <div key="alert" className="m-alert"><Px src={A.status('warning')} size={16} />{email.alert.text}</div>,
    greeting: () => <p key="g">{email.greeting}</p>,
    body: () => email.body.map(para),
    summary: () => email.summary && <table key="sum" className="m-sum"><tbody>{email.summary.map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}</tbody></table>,
    button: () => email.button && <p key="btn"><MailLink id={email.button.link} email={email} ctx={ctx} button={email.button.label} /></p>,
    quote: () => email.quote && <blockquote key="q">{email.quote}</blockquote>,
    signature: () => sig && <div key="sig" className="m-sig"><button className="linklike" aria-expanded={sigOpen} onClick={() => setSigOpen(!sigOpen)}>{sigOpen ? '▾ Hide signature' : '▸ Show signature'}</button>
      {sigOpen && <div className="sig-lines">{sig.lines.map((x, i) => <div key={i}>{x}</div>)}</div>}</div>,
    footer: () => <p key="foot" className="m-foot">This is an automated message. Training simulation: all brands are fictional.</p>,
  };
  return <div className={`m-layout l-${layout.id}`}>{layout.blocks.map((b) => R[b]?.())}</div>;
}

export default function Mail({ win, open }) {
  const { s, act, d } = useStore(); const ui = useUI();
  const [folder, setFolder] = useState('inbox'); const [sel, setSel] = useState(null);
  const [query, setQuery] = useState(''); const [filter, setFilter] = useState('all');
  const [details, setDetails] = useState({}); const [highlight, setHighlight] = useState(false); const [status, setStatus] = useState('');
  const [attSel, setAttSel] = useState(null); const searchRef = useRef();

  const delivered = EMAILS.map((e, i) => ({ e, i })).filter(({ e }) => s.mail[e.id]).reverse().map(({ e }) => e);
  const inFolder = delivered.filter((e) => s.mail[e.id].folder === folder);
  const list = inFolder.filter((e) => {
    const q = query.trim().toLowerCase();
    if (q && !(`${e.fromName} ${e.subject} ${e.addr}`.toLowerCase().includes(q))) return false;
    if (filter === 'unread' && s.mail[e.id].read) return false;
    if (filter === 'attach' && !e.attachments.length) return false;
    return true;
  });
  const email = sel ? emailById(sel) : null;
  const unread = delivered.filter((e) => s.mail[e.id].folder === 'inbox' && !s.mail[e.id].read).length;

  const select = (id) => { setSel(id); setAttSel(null); act.openEmail(id); act.log(`Opened message "${emailById(id).subject}"`); };
  useEffect(() => { if (open && s.mail[open]) { setFolder(s.mail[open].folder === 'gone' ? 'inbox' : s.mail[open].folder); select(open); } }, [open]);
  useEffect(() => { if (sel && !list.find((e) => e.id === sel) && !(sel && s.mail[sel]?.folder === folder)) setSel(null); }, [folder, s.mail]);

  const found = email ? s.evidence[email.id] || [] : [];
  const link = (id) => email.links[id];

  const openLink = async (id) => {
    const l = link(id);
    act.clickLink(email.id); act.log(`Clicked link in "${email.subject}" -> ${l.href}`, email.truth.phish ? 'warn' : 'info');
    act.launch('browser', { url: l.href, from: email.id, nonce: Date.now() });
  };
  const ctx = {
    highlight, found, setStatus,
    flag: (clue) => act.discover(email.id, [clue]),
    openLink,
    dwell: (id) => { const l = link(id); const analysis = parseUrl(l.href); const shown = /^https?:/.test(l.text) ? parseUrl(l.text) : parseUrl('https://' + l.text.split(/[?\s]/)[0]);
      if (shown.ok && shown.hostname.includes('.') && analysis.ok && shown.hostname !== analysis.hostname) act.discover(email.id, ['link-mismatch']); },
    linkMenu: (e, id) => { const l = link(id); ui.menu(e, [
      { label: 'Open', onClick: () => openLink(id) },
      { label: 'Copy Link Address', onClick: () => { try { navigator.clipboard.writeText(l.href); } catch {} act.log(`Copied link address: ${l.href}`); act.notify({ kind: 'task', title: 'Link address copied', text: l.href, ms: 2800 }); } },
      { label: 'Inspect Destination', icon: A.app('inspector'), onClick: () => act.launch('inspector', { url: l.href, text: l.text, emailId: email.id, nonce: Date.now() }) },
      { sep: 1 }, { label: 'Cancel' },
    ]); },
  };

  const decide = async (kind) => {
    if (!email) return;
    if (kind === 'safe') { act.decide(email.id, 'safe'); }
    if (kind === 'delete') {
      const r = await ui.dialog({ kind: 'confirm', title: 'Delete message', text: 'Move this message to Deleted Items?', buttons: [{ label: 'Yes', value: 'y', def: true }, { label: 'No', value: 'n', cancel: true }] });
      if (r === 'y') { if (!s.mail[email.id].decision) act.decide(email.id, 'deleted'); else d({ type: 'mail/patch', id: email.id, patch: { folder: 'trash' } }); }
    }
  };
  const notPart = (what) => ui.dialog({ kind: 'info', title: 'CyberMail', text: `${what} is turned off in this simulation. Use Report, Mark safe or Delete to handle the message.` });

  const attMenu = (e, a) => ui.menu(e, [
    { label: 'Open', onClick: () => openAttachment(a) }, { label: 'Save As…', onClick: () => saveAttachment(a) }, { sep: 1 }, { label: 'Properties', onClick: () => props(a) },
  ]);
  const openAttachment = async (a) => {
    if (a.type === 'zip' || a.type === 'exe') {
      const r = await ui.dialog({ kind: 'warning', title: 'Open attachment', text: `${a.name} came from ${email.addr}, which you have not corresponded with before. Opening attachments from unknown senders can run malicious code.`, buttons: [{ label: 'Open anyway', value: 'go' }, { label: 'Cancel', value: 'no', def: true, cancel: true }] });
      if (r === 'go') { act.log(`Opened risky attachment ${a.name} (simulated)`, 'warn'); act.tray({ security: 'alert' }); setTimeout(() => act.tray({ security: 'ok' }), 4500);
        await ui.dialog({ kind: 'error', title: 'Simulated outcome', text: 'In a real attack this could have installed malware. This was only a simulation: nothing ran. Report the message instead.' }); }
    } else ui.dialog({ kind: 'info', title: a.name, text: 'Harmless simulated document preview. Nothing to see here.' });
  };
  const saveAttachment = (a) => act.startDownload({ name: a.real?.name || a.name, source: email.addr, risky: a.type === 'zip' || a.type === 'exe', type: a.type });
  const props = (a) => {
    act.discover(email.id, ['unexpected-attachment']); act.inspectAttachment(a.id);
    ui.dialog({ kind: 'properties', icon: 'info', title: `${a.name} Properties`, buttons: [{ label: 'OK', value: 'ok', def: true }], children: (
      <table className="props"><tbody>
        <tr><th>Name</th><td>{a.name}</td></tr><tr><th>Type</th><td>{a.type.toUpperCase()}</td></tr><tr><th>Size</th><td>{a.size}</td></tr>
        <tr><th>Sent by</th><td>{email.addr}</td></tr>{a.real && <tr><th>Contents</th><td className="bad">{a.real.name}</td></tr>}
        {a.real && <tr><th>Note</th><td>{a.real.note}</td></tr>}
      </tbody></table>) });
  };
  const dlFor = (a) => s.downloads.filter((x) => x.name === (a.real?.name || a.name)).slice(-1)[0];

  const showHdr = email && details[email.id];
  return (
    <div className="mail app-col">
      <div className="toolbar" role="toolbar" aria-label="Mail toolbar">
        {[['compose', 'Compose', () => notPart('Composing mail')], ['reply', 'Reply', () => notPart('Replying')], ['reply_all', 'Reply all', () => notPart('Replying')], ['forward', 'Forward', () => notPart('Forwarding')],
          null, ['delete', 'Delete', () => decide('delete')], ['archive', 'Mark safe', () => decide('safe')], ['report', 'Report', () => email && act.launch('security', { emailId: email.id, nonce: Date.now() })],
          null, ['search', 'Search', () => searchRef.current?.focus()], ['mark_unread', 'Mark unread', () => email && d({ type: 'mail/patch', id: email.id, patch: { read: false } })], ['print', 'Print', () => notPart('Printing')]].map((t, i) => t ? (
          <Tip key={t[0]} text={t[1] + (t[0] === 'archive' ? ' (archive as legitimate)' : t[0] === 'report' ? ' as phishing' : '')}>
            <button className={`tbtn ${t[0] === 'report' ? 'rep' : ''}`} onClick={() => { t[2](); }} disabled={['delete', 'archive', 'report', 'mark_unread'].includes(t[0]) && !email} aria-label={t[1]}>
              <Px src={A.tb(t[0])} size={16} /><span>{t[1]}</span></button></Tip>) : <span key={i} className="tsep" />)}
        <span className="grow" />
        <Input ref={searchRef} className="search" placeholder="Search mail…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search mail" />
        <Select value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All' }, { value: 'unread', label: 'Unread' }, { value: 'attach', label: 'Has attachment' }]} aria-label="Filter" />
      </div>
      <div className="mail-main">
        <ul className="folders" aria-label="Folders">
          {FOLDERS.map((f) => {
            const n = f.id === 'inbox' ? unread : 0;
            return <li key={f.id}><button className={`folder ${folder === f.id ? 'on' : ''}`} onClick={() => { setFolder(f.id); setSel(null); }}>
              <Px src={f.id === 'trash' ? A.sys('documents') : A.file('folder')} size={16} /><span className={n ? 'bold' : ''}>{f.label}{n ? ` (${n})` : ''}</span></button></li>;
          })}
        </ul>
        <div className="mail-right">
          <div className="msglist" role="listbox" aria-label="Messages">
            <div className="mh"><span /><span>From</span><span>Subject</span><span>Received</span></div>
            {list.length === 0 && <div className="empty">{query || filter !== 'all' ? 'No messages match.' : 'No messages in this folder.'}</div>}
            {list.map((e) => { const m = s.mail[e.id]; return (
              <div key={e.id} role="option" aria-selected={sel === e.id} tabIndex={0} className={`mrow-msg ${m.read ? 'read' : 'unread'} ${sel === e.id ? 'sel' : ''}`}
                onClick={() => select(e.id)} onKeyDown={(ev) => { if (ev.key === 'Enter') select(e.id); }}>
                <span className="ic"><Px src={m.read ? A.attach('txt') : A.tb('mark_unread')} size={16} /></span>
                <span className="from"><Px src={A.avatar(e.contact)} size={16} /> {e.fromName}</span>
                <span className="subj">{e.attachments.length > 0 && <Px src={A.file('attachment')} size={12} className="clip" />}{e.subject}</span>
                <span className="date">{e.date}</span>
              </div>); })}
          </div>
          <div className="reading" aria-live="polite">
            {!email ? <div className="empty big"><Px src={A.finn('idle')} size={48} /><p>Select a message to read it.</p></div> : (
              <>
                <div className="rhead">
                  <Px src={A.avatar(email.contact)} size={32} className="avatar" />
                  <div className="rmeta">
                    <h2>{email.subject}</h2>
                    <div><b>From:</b> {email.fromName} <button className="linklike" aria-expanded={!!showHdr} onClick={() => { const v = !showHdr; setDetails({ ...details, [email.id]: v }); if (v) act.discover(email.id, ['sender-domain', 'lookalike-domain']); }}>{showHdr ? '[Hide details]' : '[Details]'}</button></div>
                    <div><b>To:</b> {ME.addr}</div>
                    {showHdr && <div className="rhdr-raw"><div>From: {email.fromName} &lt;{email.addr}&gt;</div><div>Reply-To: {email.addr}</div><div>Sender domain: <b>{parseUrl('https://' + email.addr.split('@')[1]).hostname}</b></div></div>}
                  </div>
                </div>
                {email.attachments.length > 0 && (
                  <div className="atts" aria-label="Attachments">
                    {email.attachments.map((a) => { const dl = dlFor(a); return (
                      <button key={a.id} className={`att ${attSel === a.id ? 'sel' : ''}`} onClick={() => setAttSel(a.id)} onDoubleClick={() => openAttachment(a)} onContextMenu={(e) => { setAttSel(a.id); attMenu(e, a); }}>
                        <span className="aimg"><Px src={A.attach(a.type)} size={32} />{dl?.status === 'blocked' && <Px src={A.overlay('blocked')} size={14} className="ov" />}{dl?.status === 'complete' && <Px src={A.overlay('check')} size={14} className="ov" />}</span>
                        <span className="aname">{a.name}<small>{a.size}{dl ? ` - ${dl.status}` : ''}</small>{dl && dl.status === 'downloading' && <ProgressBar value={dl.progress} label="Download progress" />}</span>
                      </button>); })}
                  </div>
                )}
                <div className="rbody"><EmailBody email={email} ctx={ctx} /></div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="statusbar"><span className="sb-main" title={status}>{status || 'Ready'}</span>
        <span className="sb-cell"><Checkbox checked={highlight} onChange={setHighlight} label="Clue highlighter" /></span>
        <span className="sb-cell">{list.length} message{list.length === 1 ? '' : 's'}, {unread} unread</span></div>
    </div>
  );
}
