import React, { createContext, useContext, useRef, useState } from 'react';
import { A } from '../../engine/assets.js';
import { SITES, BOOKMARKS } from '../../engine/scenario.js';
import { parseUrl } from '../../engine/urlTools.js';
import { Px, Button, Input, Checkbox, ProgressBar } from '../../os/ui.jsx';

export const PageCtx = createContext(null);
const usePage = () => useContext(PageCtx);

export function PLink({ to, children, className = '', onClick }) {
  const p = usePage();
  return <a href="#" className={className} onClick={(e) => { e.preventDefault(); onClick ? onClick() : p.nav(to); }} onMouseEnter={() => p.setStatus(to || '')} onMouseLeave={() => p.setStatus('')} onFocus={() => p.setStatus(to || '')} onBlur={() => p.setStatus('')}>{children}</a>;
}

const Shell = ({ brand, c1, c2, nav = [], children, host }) => (
  <div className="site" style={{ '--b1': c1, '--b2': c2 }}>
    <header className="site-head"><b>{brand}</b><nav>{nav.map(([l, u]) => <PLink key={l} to={u}>{l}</PLink>)}</nav></header>
    <main className="site-main">{children}</main>
    <footer className="site-foot">{brand} - fictional training site - {host}</footer>
  </div>
);

/** After a faked submit, explain what happened. Nothing typed is ever stored. */
function Feedback({ fake, host, expected, what, onBack }) {
  return (
    <div className={`feedback ${fake ? 'bad' : 'good'}`} role="alert">
      <Px src={A.status(fake ? 'warning' : 'success')} size={32} />
      <div>
        <h3>{fake ? `Safe training feedback: this was a look-alike site` : 'Simulated sign-in complete'}</h3>
        <p>{fake ? `You just handed ${what} to ${host}${expected ? `, not to ${expected}` : ''}. In a real attack the criminal would now have it.` : `This was the genuine (fictional) site at ${host}. Nothing you typed was stored or sent anywhere.`}</p>
        {fake && <ul><li>Check the registrable domain, the part just before the final dot.</li><li>A padlock only means the connection is encrypted, not that the site is honest.</li><li>Go to the site yourself instead of following a link from an email.</li></ul>}
        <Button onClick={onBack}>Back to safety</Button>
      </div>
    </div>
  );
}

const BRANDS = {
  uni: { brand: 'Eastbrook University', c1: '#7a1a2a', c2: '#d8c8a0', title: 'Student Sign-in', field: 'Student ID', what: 'your student ID and password', layout: 'split' },
  cloud: { brand: 'NimbusDrive', c1: '#1084d0', c2: '#e8f4ff', title: 'Sign in to NimbusDrive', field: 'Email', what: 'your cloud account login', layout: 'card' },
  bank: { brand: 'Northvale Bank', c1: '#0a3a7a', c2: '#e8eef8', title: 'Online Banking', field: 'Customer number', what: 'your banking login', layout: 'banner' },
  payroll: { brand: 'PaySure Payroll', c1: '#5a2a8a', c2: '#f0e8f8', title: 'Employee Portal', field: 'Employee ID', what: 'your payroll login', layout: 'minimal' },
  photos: { brand: 'Pics Share', c1: '#202030', c2: '#ffb040', title: 'Sign in to view photo', field: 'Email', what: 'your account password', layout: 'dark' },
};

export function LoginPage({ site, host }) {
  const p = usePage(); const b = BRANDS[site.login] || BRANDS.cloud; const form = useRef(); const [done, setDone] = useState(false);
  const submit = (e) => { e.preventDefault(); form.current.reset(); setDone(true); p.onSubmitted(); };
  const f = (
    <form ref={form} onSubmit={submit} autoComplete="off" className="loginform">
      <h2>{b.title}</h2>
      <label>{b.field}<Input name="u" autoComplete="off" /></label>
      <label>Password<Input name="p" type="password" autoComplete="new-password" /></label>
      <Button type="submit" def>Sign in</Button>
      <small className="sim">Training simulation: never type a real password. Inputs are cleared and not stored.</small>
    </form>
  );
  return (
    <div className={`site login-${b.layout}`} style={{ '--b1': b.c1, '--b2': b.c2 }}>
      <header className="site-head"><b>{b.brand}</b></header>
      <main className="site-main">
        {done ? <Feedback fake={site.fake} host={host} expected={site.expected} what={b.what} onBack={() => p.nav('cyberdesk://newtab')} /> : f}
      </main>
    </div>
  );
}

export function Portal({ host }) {
  const p = usePage(); const [task, setTask] = useState(null); const [step, setStep] = useState(0);
  const tasks = { timetable: ['View timetable', ['Pick your term', 'Select CS240', 'Timetable shown: Thursday office hours 2-4 pm']], account: ['Change password', ['Enter current password (simulated)', 'Choose a new password', 'Password updated on the official portal']], balance: ['Check tuition balance', ['Verifying identity', 'Loading statement', 'Balance: $0.00 - nothing owed']] };
  const path = parseUrl(p.url).path; const auto = path.includes('timetable') ? 'timetable' : path.includes('account') ? 'account' : null;
  const cur = task || auto;
  return (
    <Shell brand="Eastbrook University Portal" c1="#7a1a2a" c2="#d8c8a0" host={host} nav={[['Home', 'https://portal.eastbrook.example/'], ['Timetable', 'https://portal.eastbrook.example/timetable'], ['Account', 'https://portal.eastbrook.example/account']]}>
      {!cur ? (<>
        <h2>Welcome back</h2>
        <div className="cards">{Object.entries(tasks).map(([k, [l]]) => <button key={k} className="card" onClick={() => { setTask(k); setStep(0); }}><b>{l}</b><span>Start task</span></button>)}</div>
        <h3>Announcements</h3><ul><li>Phishing awareness week: IT will never ask for your password by email.</li><li>Library extended hours during midterms.</li></ul>
      </>) : (
        <div className="taskflow"><h2>{tasks[cur][0]}</h2>
          <ol>{tasks[cur][1].map((t, i) => <li key={i} className={i < step ? 'done' : i === step ? 'now' : ''}>{t}</li>)}</ol>
          {step < tasks[cur][1].length ? <Button def onClick={() => setStep(step + 1)}>Continue</Button> : <div className="ok-box"><Px src={A.status('success')} size={16} /> Task complete <Button onClick={() => { setTask(null); p.nav('https://portal.eastbrook.example/'); }}>Back to home</Button></div>}
        </div>)}
    </Shell>
  );
}

export function Cloud({ host }) {
  const p = usePage(); const [doc, setDoc] = useState(null); const [done, setDone] = useState(false);
  const docs = [['Lab 3 draft.docx', 'Priya Nair', 'Oct 18', 'document'], ['Study group notes.txt', 'Sam Rivera', 'Oct 12', 'text'], ['Poster.png', 'You', 'Oct 05', 'image']];
  return (
    <Shell brand="NimbusDrive" c1="#1084d0" c2="#e8f4ff" host={host} nav={[['My files', 'https://files.nimbusdrive.example/'], ['Shared', 'https://files.nimbusdrive.example/s/lab3-draft']]}>
      {!doc ? (<><h2>Shared with you</h2><table className="tbl"><thead><tr><th>Name</th><th>Owner</th><th>Modified</th></tr></thead><tbody>
        {docs.map((d) => <tr key={d[0]} tabIndex={0} onClick={() => setDoc(d)} onKeyDown={(e) => e.key === 'Enter' && setDoc(d)}><td><Px src={A.file(d[3])} size={16} /> {d[0]}</td><td>{d[1]}</td><td>{d[2]}</td></tr>)}</tbody></table></>) : (
        <div><h2>{doc[0]}</h2><div className="docprev"><p><b>Preview (simulated)</b></p><p>Lab 3 - packet capture analysis. Draft by {doc[1]}.</p><p>1. Introduction ... 2. Method ... 3. Results ...</p></div>
          {!done ? <div className="row"><Button def onClick={() => { p.download({ name: doc[0], type: doc[3], risky: false }); setDone(true); }}>Download</Button><Button onClick={() => setDoc(null)}>Back</Button></div>
            : <div className="ok-box"><Px src={A.status('success')} size={16} /> Download started - check the Download Manager.</div>}</div>)}
    </Shell>
  );
}

export function Tracking({ host }) {
  const steps = [['Oct 14', 'Label created'], ['Oct 15', 'Picked up'], ['Oct 17', 'Arrived at depot'], ['Oct 18', 'Out for delivery']];
  return (
    <Shell brand="ParcelPoint" c1="#c8700c" c2="#fff0d8" host={host} nav={[['Track', 'https://parcelpoint.example/track?id=PP4821']]}>
      <h2>Parcel PP4821</h2><div className="status-pill">Out for delivery</div>
      <ol className="timeline">{steps.map(([d, t]) => <li key={d}><b>{d}</b> {t}</li>)}</ol>
      <p className="note">ParcelPoint never charges a redelivery fee by email link. No payment is needed for this parcel.</p>
    </Shell>
  );
}

export function Payment({ host, site }) {
  const p = usePage(); const form = useRef(); const [done, setDone] = useState(false);
  return (
    <Shell brand="ParcelPoint Delivery" c1="#c8700c" c2="#fff0d8" host={host} nav={[]}>
      {done ? <Feedback fake host={host} expected={site.expected} what="your card number and security code" onBack={() => p.nav('cyberdesk://newtab')} /> : (
        <form ref={form} className="loginform" autoComplete="off" onSubmit={(e) => { e.preventDefault(); form.current.reset(); setDone(true); p.onSubmitted(); }}>
          <h2>Pay redelivery fee: $1.99</h2><p className="urgent">Your parcel will be returned in 12 hours.</p>
          <label>Name on card<Input autoComplete="off" /></label><label>Card number<Input autoComplete="off" inputMode="numeric" /></label>
          <div className="row"><label>Expiry<Input autoComplete="off" /></label><label>Security code<Input type="password" autoComplete="new-password" /></label></div>
          <Button type="submit" def>Pay now</Button><small className="sim">Training simulation: inputs are cleared and never stored.</small>
        </form>)}
    </Shell>
  );
}

export function Support({ host }) {
  const [sent, setSent] = useState(false);
  return (
    <Shell brand="Eastbrook IT Help" c1="#006a3a" c2="#e0f4e8" host={host} nav={[['Help home', 'https://help.eastbrook.example/']]}>
      <h2>Open a support ticket</h2>
      {sent ? <div className="ok-box"><Px src={A.status('success')} size={16} /> Ticket #4471 created. We will reply to your Eastbrook email. We never ask for your password.</div> : (
        <form className="loginform" onSubmit={(e) => { e.preventDefault(); setSent(true); }}><label>Topic<select><option>Wi-Fi</option><option>Account access</option><option>Software</option></select></label>
          <label>Describe the problem<textarea className="inp" rows={4} /></label><Button type="submit" def>Submit ticket</Button></form>)}
    </Shell>
  );
}

export function Job({ host, site }) {
  const p = usePage(); const form = useRef(); const [done, setDone] = useState(false);
  return (
    <Shell brand={site.fake ? 'Eastbrook Careers' : 'Eastbrook Careers'} c1="#2a4a6a" c2="#e0e8f0" host={host} nav={[]}>
      {done ? <Feedback fake={site.fake} host={host} expected={site.expected} what="a copy of your ID and your bank details" onBack={() => p.nav('cyberdesk://newtab')} /> : (
        <form ref={form} className="loginform" autoComplete="off" onSubmit={(e) => { e.preventDefault(); form.current.reset(); setDone(true); if (site.fake) p.onSubmitted(); }}>
          <h2>{site.fake ? 'Remote Internship - $48/hr (no interview)' : 'Student Assistant - Library (on campus)'}</h2>
          <label>Full name<Input autoComplete="off" /></label>
          {site.fake ? (<><label>Photo ID number<Input autoComplete="off" /></label><label>Bank account for first payment<Input autoComplete="off" /></label></>) : (<label>Why are you interested?<textarea className="inp" rows={3} /></label>)}
          <Button type="submit" def>Apply</Button><small className="sim">Training simulation: inputs are cleared and never stored.</small>
        </form>)}
    </Shell>
  );
}

export function Invoice({ host }) {
  const p = usePage(); const [asked, setAsked] = useState(false);
  return (
    <Shell brand="Invoice Viewer" c1="#404040" c2="#eeeeee" host={host} nav={[]}>
      <h2>Invoice 8812</h2><p>Amount due: $1,240.00 <span className="urgent">OVERDUE</span></p>
      <Button def onClick={() => { p.download({ name: 'Invoice_8812.pdf.exe', type: 'exe', risky: true }); setAsked(true); }}>Download invoice (PDF)</Button>
      {asked && <p className="note">The file is really a program (.exe). The download manager blocks it. Real invoices are never .exe files.</p>}
    </Shell>
  );
}

export function Bank({ host }) {
  return (
    <Shell brand="Northvale Bank" c1="#0a3a7a" c2="#e8eef8" host={host} nav={[['Accounts', 'https://northvale.example/'], ['Statements', 'https://northvale.example/statements']]}>
      <h2>Statements</h2><table className="tbl"><thead><tr><th>Period</th><th>Account</th><th /></tr></thead><tbody><tr><td>October</td><td>****4821</td><td><PLink to="https://northvale.example/statements">View (simulated)</PLink></td></tr><tr><td>September</td><td>****4821</td><td>Viewed</td></tr></tbody></table>
      <p className="note">Northvale will never ask for your PIN or full password by email.</p>
    </Shell>
  );
}

const WEB_BOOKMARKS = [
  { title: 'Google', url: 'https://www.google.com', desc: 'World search engine', icon: 'internet' },
  { title: 'DuckDuckGo', url: 'https://html.duckduckgo.com/html/', desc: 'Privacy search engine', icon: 'internet' },
  { title: 'Wikipedia', url: 'https://en.wikipedia.org', desc: 'Free encyclopedia', icon: 'documents' },
  { title: 'Hacker News', url: 'https://news.ycombinator.com', desc: 'Computer & security news', icon: 'programs' },
  { title: 'GitHub', url: 'https://github.com', desc: 'Software repositories', icon: 'hard_drive' },
  { title: 'CISA Alerts', url: 'https://www.cisa.gov/news-events/cybersecurity-advisories', desc: 'Threat advisories', icon: 'shield' },
  { title: 'Krebs Security', url: 'https://krebsonsecurity.com', desc: 'Security investigations', icon: 'help' },
];

export function NewTab() {
  const p = usePage();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');

  const go = (e) => {
    e.preventDefault();
    const t = q.trim();
    if (!t) return;
    if (t.startsWith('cyberdesk://')) {
      p.nav(t);
      return;
    }
    if (/^https?:\/\//i.test(t)) {
      p.nav(t);
      return;
    }
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(t)) {
      p.nav('https://' + t);
      return;
    }
    // Search query
    p.nav(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(t)}`);
  };

  const allBookmarks = [
    ...WEB_BOOKMARKS.map((b) => ({ ...b, group: 'web' })),
    ...BOOKMARKS.map((b) => ({ ...b, group: 'sim' })),
  ];

  const filtered = allBookmarks.filter((b) => {
    if (category !== 'all' && b.group !== category) return false;
    if (!q.trim()) return true;
    const term = q.toLowerCase();
    return b.title.toLowerCase().includes(term) || b.url.toLowerCase().includes(term);
  });

  return (
    <div className="newtab">
      <Px src={A.finn('happy')} size={56} />
      <h1 style={{ margin: '8px 0 4px 0' }}>CyberSurf Live Web Browser</h1>
      <p style={{ margin: '0 0 16px 0', color: '#555', fontSize: '13px' }}>
        Open any real website on the internet or explore simulated lab portals
      </p>

      <form onSubmit={go} className="nt-search" style={{ maxWidth: '620px', width: '100%' }}>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Enter any website (e.g. google.com, wikipedia.org) or search..."
          aria-label="Address or search query"
          style={{ flex: 1 }}
        />
        <Button type="submit" def>Open / Search</Button>
      </form>

      <div className="bm-filter-bar" style={{ display: 'flex', gap: '8px', margin: '14px 0 10px 0' }}>
        <button
          type="button"
          className={`filter-btn ${category === 'all' ? 'active' : ''}`}
          onClick={() => setCategory('all')}
        >
          All Sites
        </button>
        <button
          type="button"
          className={`filter-btn ${category === 'web' ? 'active' : ''}`}
          onClick={() => setCategory('web')}
        >
          🌐 Real Web (Chrome Sites)
        </button>
        <button
          type="button"
          className={`filter-btn ${category === 'sim' ? 'active' : ''}`}
          onClick={() => setCategory('sim')}
        >
          🎓 Simulated Lab Portals
        </button>
      </div>

      <div className="bookmarks-grid" style={{ width: '100%', maxWidth: '780px', marginTop: '10px' }}>
        <div className="bookmarks">
          {filtered.map((b) => (
            <button
              key={b.url}
              className={`bm ${b.group === 'web' ? 'bm-web' : 'bm-sim'}`}
              onClick={() => p.nav(b.url)}
              onMouseEnter={() => p.setStatus(b.url)}
              onMouseLeave={() => p.setStatus('')}
              title={`${b.title} (${b.url})`}
            >
              <Px src={A.sys(b.icon || 'internet')} size={32} />
              <div className="bm-meta">
                <span className="bm-title">{b.title}</span>
                <span className="bm-type-badge">{b.group === 'web' ? 'Live Web' : 'Lab'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ErrorPage({ kind, url, onBack, onContinue }) {
  const host = parseUrl(url).hostname;
  const cfg = {
    unavailable: { icon: 'error', t: 'The page cannot be displayed', d: `CyberSurf could not reach ${host || url}. This simulation only contains fictional internal sites.`, tips: ['Check the address for typing mistakes.', 'Return to the new tab page and use a bookmark.'] },
    blocked: { icon: 'blocked', t: 'Blocked by CyberDesk Safe Browsing (simulated)', d: `${host} was blocked: it is known for collecting sign-in details.`, tips: ['Nothing was loaded and no data was sent.', 'Genuine sites are reached through addresses you already know.', 'You can report the message that sent you here from Security Center.'] },
    warning: { icon: 'warning', t: 'Deceptive site ahead (simulated warning)', d: `${host} looks like another site and may try to trick you into revealing information.`, tips: ['The domain imitates a real brand by changing a few characters.', 'The safest choice is to go back.'] },
  }[kind];
  return (
    <div className={`errpage ${kind}`}><Px src={A.status(cfg.icon)} size={32} /><h2>{cfg.t}</h2><p>{cfg.d}</p><ul>{cfg.tips.map((t) => <li key={t}>{t}</li>)}</ul>
      <div className="row"><Button def onClick={onBack}>Go back</Button>{kind === 'warning' && <Button onClick={onContinue}>Continue anyway (not recommended)</Button>}</div></div>
  );
}

export const PAGES = { portal: Portal, cloud: Cloud, tracking: Tracking, payment: Payment, support: Support, job: Job, invoice: Invoice, bank: Bank };
