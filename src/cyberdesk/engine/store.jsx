import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { EMAILS, emailById, INITIAL_FILES, ACHIEVEMENTS, EVIDENCE } from './scenario.js';
import { APPS } from './apps.js';
import { evaluateReport, evaluateSafe, achievementsMet, rankFor } from './scoring.js';
import { audio } from './audio.js';

const KEY = 'cyberdesk.session.v1';
const SKEY = 'cyberdesk.settings.v1';
const PERSIST = ['mail', 'reports', 'evidence', 'analysed', 'inspectedAttachments', 'sites', 'flags', 'files', 'xp', 'achievements', 'notes', 'downloads', 'startedAt', 'log', 'nextIncident', 'user'];

const defaultSettings = { sound: true, volume: 0.6, motion: 'system', contrast: false, scanlines: true, touch: false, wallpaper: 'landscape' };

function load(key) { try { return JSON.parse(sessionStorage.getItem(key) || localStorage.getItem(key) || 'null'); } catch { return null; } }

function fresh() {
  const mail = {};
  EMAILS.filter((e) => !e.arrives).forEach((e) => { mail[e.id] = { read: false, folder: 'inbox', arrivedAt: Date.now() }; });
  return {
    phase: 'landing', windows: [], focus: null, z: 10, toasts: [], settings: defaultSettings,
    user: { name: 'Cadet Analyst', id: 'guest' }, launchAppAfterBoot: 'mail',
    mail, reports: {}, evidence: {}, analysed: [], inspectedAttachments: [], sites: [], flags: {}, files: INITIAL_FILES.map((f) => ({ ...f })),
    xp: 0, achievements: {}, notes: {}, downloads: [], startedAt: Date.now(), log: [], tray: { network: 'ok', security: 'ok' }, lastXp: null, nextIncident: 1001, missionOpen: true,
  };
}
function init() {
  const s = fresh();
  const saved = load(KEY);
  if (saved) PERSIST.forEach((k) => { if (saved[k] !== undefined) s[k] = saved[k]; });
  const st = (() => { try { return JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch { return null; } })();
  s.settings = { ...defaultSettings, ...(st || {}) };
  return s;
}

let uid = 1;
const stamp = () => new Date().toLocaleTimeString('en-GB');

function reducer(s, a) {
  switch (a.type) {
    case 'phase': return { ...s, phase: a.phase };
    case 'user/set': return { ...s, user: { ...s.user, ...a.patch } };
    case 'launchApp': return { ...s, launchAppAfterBoot: a.app };
    case 'reset': return { ...fresh(), settings: s.settings, phase: 'boot' };
    case 'win/open': {
      const def = APPS[a.app];
      const ex = def.single ? s.windows.find((w) => w.app === a.app) : null;
      const z = s.z + 1;
      if (ex) return { ...s, z, focus: ex.id, windows: s.windows.map((w) => (w.id === ex.id ? { ...w, z, minimized: false, props: { ...w.props, ...a.props }, anim: 'restore', animKey: z } : w)) };
      const n = s.windows.length;
      const id = 'w' + uid++;
      const win = { id, app: a.app, props: a.props || {}, title: a.title || def.title, x: 70 + (n % 8) * 28, y: 30 + (n % 8) * 26, w: def.w, h: def.h, z, minimized: false, maximized: false, anim: 'open', animKey: z, ...(a.geo || {}) };
      return { ...s, z, focus: id, windows: [...s.windows, win] };
    }
    case 'win/focus': { if (s.focus === a.id && !a.force) return s; const z = s.z + 1; return { ...s, z, focus: a.id, windows: s.windows.map((w) => (w.id === a.id ? { ...w, z } : w)) }; }
    case 'win/patch': return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, ...a.patch } : w)) };
    case 'win/min': {
      const rest = s.windows.filter((w) => w.id !== a.id && !w.minimized).sort((x, y) => y.z - x.z)[0];
      return { ...s, focus: rest ? rest.id : null, windows: s.windows.map((w) => (w.id === a.id ? { ...w, anim: 'minimize', animKey: s.z + 1 } : w)) };
    }
    case 'win/minDone': return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, minimized: true, anim: null } : w)) };
    case 'win/restore': { const z = s.z + 1; return { ...s, z, focus: a.id, windows: s.windows.map((w) => (w.id === a.id ? { ...w, z, minimized: false, anim: 'restore', animKey: z } : w)) }; }
    case 'win/max': return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, maximized: !w.maximized, geoAnim: true, anim: null } : w)) };
    case 'win/closing': return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, anim: 'close' } : w)) };
    case 'win/close': { const left = s.windows.filter((w) => w.id !== a.id); const top = [...left].filter((w) => !w.minimized).sort((x, y) => y.z - x.z)[0]; return { ...s, windows: left, focus: s.focus === a.id ? (top ? top.id : null) : s.focus }; }
    case 'toast/add': return { ...s, toasts: [...s.toasts.slice(-3), { id: 't' + uid++, ...a.toast }] };
    case 'toast/state': return { ...s, toasts: s.toasts.map((t) => (t.id === a.id ? { ...t, state: a.state } : t)) };
    case 'toast/remove': return { ...s, toasts: s.toasts.filter((t) => t.id !== a.id) };
    case 'mail/arrive': return s.mail[a.id] ? s : { ...s, mail: { ...s.mail, [a.id]: { read: false, folder: 'inbox', arrivedAt: Date.now() } } };
    case 'mail/open': { const m = s.mail[a.id]; if (!m) return s; return { ...s, mail: { ...s.mail, [a.id]: { ...m, read: true, openedAt: m.openedAt || Date.now() } } }; }
    case 'mail/patch': return { ...s, mail: { ...s.mail, [a.id]: { ...s.mail[a.id], ...a.patch } } };
    case 'evidence/add': { const cur = s.evidence[a.emailId] || []; const add = a.ids.filter((i) => !cur.includes(i)); return add.length ? { ...s, evidence: { ...s.evidence, [a.emailId]: [...cur, ...add] } } : s; }
    case 'analysed': return s.analysed.includes(a.url) ? s : { ...s, analysed: [...s.analysed, a.url] };
    case 'attach/inspected': return s.inspectedAttachments.includes(a.id) ? s : { ...s, inspectedAttachments: [...s.inspectedAttachments, a.id] };
    case 'report/add': return { ...s, reports: { ...s.reports, [a.report.emailId]: a.report }, nextIncident: s.nextIncident + 1 };
    case 'report/status': return { ...s, reports: { ...s.reports, [a.emailId]: { ...s.reports[a.emailId], status: a.status } } };
    case 'report/award': { const r = s.reports[a.emailId]; if (!r || r.awarded) return s; return { ...s, xp: s.xp + r.result.xp, lastXp: { amount: r.result.xp, at: Date.now(), from: s.xp }, reports: { ...s.reports, [a.emailId]: { ...r, awarded: true } } }; }
    case 'xp/award': return { ...s, xp: s.xp + a.amount, lastXp: { amount: a.amount, at: Date.now(), from: s.xp } };
    case 'ach/unlock': return s.achievements[a.id] ? s : { ...s, achievements: { ...s.achievements, [a.id]: Date.now() } };
    case 'site/visit': return s.sites.some((x) => x.host === a.site.host) ? s : { ...s, sites: [...s.sites, { ...a.site, submitted: false, left: false }] };
    case 'site/patch': return { ...s, sites: s.sites.map((x) => (x.host === a.host ? { ...x, ...a.patch } : x)) };
    case 'flag': return { ...s, flags: { ...s.flags, [a.k]: a.v ?? true } };
    case 'dl/add': return { ...s, downloads: [...s.downloads, a.item] };
    case 'dl/patch': return { ...s, downloads: s.downloads.map((d) => (d.id === a.id ? { ...d, ...a.patch } : d)) };
    case 'file/add': return { ...s, files: [...s.files, a.file] };
    case 'file/patch': return { ...s, files: s.files.map((f) => (f.id === a.id ? { ...f, ...a.patch } : f)) };
    case 'file/remove': return { ...s, files: s.files.filter((f) => f.id !== a.id) };
    case 'note/set': return { ...s, notes: { ...s.notes, [a.key]: { ...(s.notes[a.key] || { checked: [], text: '' }), ...a.patch } } };
    case 'settings': return { ...s, settings: { ...s.settings, ...a.patch } };
    case 'log': return { ...s, log: [...s.log.slice(-199), { t: stamp(), msg: a.msg, kind: a.kind || 'info' }] };
    case 'tray': return { ...s, tray: { ...s.tray, ...a.patch } };
    case 'mission': return { ...s, missionOpen: a.open };
    case 'emptyRecycle': return { ...s, files: s.files.filter((f) => f.folder !== '__trash'), mail: Object.fromEntries(Object.entries(s.mail).map(([k, m]) => [k, m.folder === 'trash' ? { ...m, folder: 'gone' } : m])) };
    default: return s;
  }
}

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }) {
  const [s, d] = useReducer(reducer, null, init);
  const ref = useRef(s); ref.current = s;
  const timers = useRef([]);
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.current.push(t); return t; };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // persist
  useEffect(() => {
    const t = setTimeout(() => { try { const o = {}; PERSIST.forEach((k) => { o[k] = s[k]; }); sessionStorage.setItem(KEY, JSON.stringify(o)); localStorage.setItem(SKEY, JSON.stringify(s.settings)); } catch { /* storage blocked */ } }, 200);
    return () => clearTimeout(t);
  }, [s]);
  useEffect(() => { audio.sync({ sound: s.settings.sound, volume: s.settings.volume }); }, [s.settings.sound, s.settings.volume]);

  const reduced = useMemo(() => (s.settings.motion === 'reduce') || (s.settings.motion === 'system' && typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches), [s.settings.motion]);

  const act = useMemo(() => {
    const A = {};
    A.log = (msg, kind) => d({ type: 'log', msg, kind });
    A.notify = ({ kind = 'task', title, text, action, ms = 5200, achId }) => {
      const sound = { email: 'email', achievement: 'achievement', xp: 'xp', error: 'error', security: 'warning', evidence: 'evidence', download: 'download-done' }[kind] || 'notify';
      audio.play(sound);
      d({ type: 'toast/add', toast: { kind, title, text, action, state: 'in', ms, achId } });
    };
    A.openApp = (app, props, extra = {}) => { audio.play('window-open'); d({ type: 'win/open', app, props, ...extra }); A.log(`Opened ${APPS[app].title}`); if (app === 'help') d({ type: 'flag', k: 'help' }); };
    A.closeWin = (id) => { audio.play('window-close'); if (ref.current.settings.motion === 'reduce' || reducedNow()) d({ type: 'win/close', id }); else { d({ type: 'win/closing', id }); later(() => d({ type: 'win/close', id }), 150); } };
    const reducedNow = () => ref.current.settings.motion === 'reduce' || (ref.current.settings.motion === 'system' && matchMedia('(prefers-reduced-motion: reduce)').matches);
    A.launch = (app, props, extra) => { if (app === 'mission') { d({ type: 'mission', open: true }); audio.play('window-open'); } else A.openApp(app, props, extra); };
    A.minWin = (id) => { audio.play('window-close'); if (reducedNow()) { d({ type: 'win/min', id }); d({ type: 'win/minDone', id }); } else { d({ type: 'win/min', id }); later(() => d({ type: 'win/minDone', id }), 190); } };
    A.deliver = (id) => {
      if (ref.current.mail[id]) return; const e = emailById(id);
      d({ type: 'mail/arrive', id }); A.log(`New mail from ${e.addr}`);
      A.notify({ kind: 'email', title: e.fromName, text: e.subject, action: { app: 'mail', props: { open: id } } });
    };
    A.openEmail = (id) => d({ type: 'mail/open', id });
    A.discover = (emailId, ids) => {
      const e = emailById(emailId); if (!e || !e.truth.phish) return;
      const valid = ids.filter((i) => e.truth.evidence.includes(i) && !(ref.current.evidence[emailId] || []).includes(i));
      if (!valid.length) return;
      d({ type: 'evidence/add', emailId, ids: valid });
      const lab = EVIDENCE.find((x) => x.id === valid[0]).label;
      A.log(`Evidence saved: ${lab}`, 'evidence');
      A.notify({ kind: 'evidence', title: 'Evidence saved', text: lab + (valid.length > 1 ? ` (+${valid.length - 1} more)` : ''), ms: 3600 });
    };
    A.decide = (id, decision) => {
      const st = ref.current; const m = st.mail[id]; const e = emailById(id); if (!m || m.decision) return false;
      const patch = { decision, decidedAt: Date.now() };
      if (decision === 'safe') { const r = evaluateSafe(e); patch.result = r; patch.folder = 'archive'; d({ type: 'mail/patch', id, patch }); d({ type: 'xp/award', amount: r.xp }); A.log(`${e.subject}: marked safe (${r.correct ? 'correct' : 'wrong'})`, r.correct ? 'ok' : 'warn');
        A.notify({ kind: r.correct ? 'task' : 'security', title: r.correct ? `+${r.xp} XP - Marked safe` : 'That one was phishing', text: r.correct ? 'Good call.' : e.lesson.slice(0, 120) + '…' }); }
      else if (decision === 'deleted') { patch.folder = 'trash'; d({ type: 'mail/patch', id, patch }); A.log(`${e.subject}: deleted`); }
      return true;
    };
    A.restoreEmail = (id) => d({ type: 'mail/patch', id, patch: { folder: 'inbox', decision: null, decidedAt: null, result: null } });
    A.clickLink = (id) => d({ type: 'mail/patch', id, patch: { clicked: true } });
    A.submitReport = ({ emailId, category, evidence, notes }) => {
      const st = ref.current; const e = emailById(emailId);
      if (st.reports[emailId]) return { status: 'duplicate' };
      if (!category || !evidence.length) return { status: 'incomplete' };
      const result = evaluateReport(e, { category, evidence, notes });
      const report = { id: 'INC-' + st.nextIncident, emailId, category, evidence, notes, status: 'submitted', submittedAt: Date.now(), result, awarded: false };
      d({ type: 'report/add', report });
      d({ type: 'mail/patch', id: emailId, patch: { decision: 'reported', decidedAt: Date.now(), folder: 'archive' } });
      A.log(`Report ${report.id} submitted for "${e.subject}"`);
      A.resumeReport(emailId, 2200, 4600);
      return { status: result.outcome, id: report.id };
    };
    A.resumeReport = (emailId, t1, t2) => {
      later(() => d({ type: 'report/status', emailId, status: 'review' }), t1);
      later(() => {
        d({ type: 'report/status', emailId, status: 'resolved' });
        const r = ref.current.reports[emailId]; if (!r) return;
        d({ type: 'report/award', emailId });
        const verdict = r.result.outcome === 'accepted' ? `+${r.result.xp} XP` : 'False alarm';
        A.log(`${r.id} resolved: ${r.result.outcome}`, r.result.outcome === 'accepted' ? 'ok' : 'warn');
        A.notify({ kind: r.result.outcome === 'accepted' ? 'xp' : 'error', title: `${r.id} resolved - ${verdict}`, text: 'Open the debrief to see what you caught.', action: { app: 'debrief', props: { emailId } } });
      }, t2);
    };
    A.analyse = (url) => d({ type: 'analysed', url });
    A.inspectAttachment = (id) => d({ type: 'attach/inspected', id });
    A.visitSite = (site) => { d({ type: 'site/visit', site }); A.log(`Visited ${site.host}`); };
    A.siteLeft = (host) => d({ type: 'site/patch', host, patch: { left: true } });
    A.siteSubmitted = (host) => d({ type: 'site/patch', host, patch: { submitted: true } });
    A.startDownload = ({ name, source, risky, type }) => {
      const id = 'd' + uid++; const item = { id, name, source, risky: !!risky, type: type || 'unknown', status: 'queued', progress: 0 };
      d({ type: 'dl/add', item }); A.log(`Download queued: ${name}`);
      [[500, 25], [1200, 60], [2000, 100]].forEach(([ms, p], i) => later(() => {
        if (i === 0) d({ type: 'dl/patch', id, patch: { status: 'downloading', progress: p } });
        else if (i === 1) d({ type: 'dl/patch', id, patch: { progress: p } });
        else if (item.risky) { d({ type: 'dl/patch', id, patch: { progress: 100, status: 'blocked' } }); A.log(`Download blocked: ${name}`, 'warn'); A.notify({ kind: 'security', title: 'Download blocked', text: `${name} is a risky file type. Nothing was saved.` }); d({ type: 'tray', patch: { security: 'alert' } }); later(() => d({ type: 'tray', patch: { security: 'ok' } }), 4000); }
        else { d({ type: 'dl/patch', id, patch: { progress: 100, status: 'complete' } }); d({ type: 'file/add', file: { id: 'dl' + id, folder: 'Downloads', name, type, size: '120 KB', modified: 'Today', content: `${name}\n\n(simulated safe document)` } }); A.notify({ kind: 'download', title: 'Download complete', text: name, action: { app: 'files', props: { folder: 'Downloads' } } }); }
      }, ms));
      A.openApp('downloads');
    };
    A.quarantine = (id) => { const f = ref.current.files.find((x) => x.id === id); if (!f) return; d({ type: 'file/patch', id, patch: { folder: 'Quarantine', from: f.folder } }); A.log(`Quarantined ${f.name}`, 'ok'); A.notify({ kind: 'security', title: 'File quarantined', text: f.name }); };
    A.deleteFile = (id) => { const f = ref.current.files.find((x) => x.id === id); d({ type: 'file/patch', id, patch: { from: f.folder, folder: '__trash' } }); };
    A.restoreFile = (id) => { const f = ref.current.files.find((x) => x.id === id); d({ type: 'file/patch', id, patch: { folder: f.from || 'Documents' } }); };
    A.emptyRecycle = () => { d({ type: 'emptyRecycle' }); A.log('Recycle Bin emptied'); };
    A.set = (patch) => d({ type: 'settings', patch });
    A.setNote = (key, patch) => d({ type: 'note/set', key, patch });
    A.tray = (patch) => d({ type: 'tray', patch });
    return A;
  }, []);

  // arrivals + scripted network event once the desktop is up
  useEffect(() => {
    if (s.phase !== 'desktop') return;
    const t0 = Date.now(); const ts = [];
    EMAILS.filter((e) => e.arrives && !ref.current.mail[e.id]).forEach((e) => ts.push(setTimeout(() => act.deliver(e.id), e.arrives * 1000)));
    if (!ref.current.flags.net) ts.push(setTimeout(() => {
      act.tray({ network: 'down' }); d({ type: 'flag', k: 'net' }); act.log('Network adapter reset (simulated event)', 'warn');
      act.notify({ kind: 'network', title: 'Network disconnected', text: 'Simulated outage. Reconnecting...' });
      setTimeout(() => { act.tray({ network: 'ok' }); act.notify({ kind: 'network', title: 'Network restored', text: 'Back online.', ms: 3000 }); }, 7000);
    }, 90000));
    ts.push(setTimeout(() => act.notify({ kind: 'update', title: 'Definitions updated', text: 'Training content v1.0 is current.', ms: 3500 }), 14000));
    // resume report timers after reload
    Object.values(ref.current.reports).filter((r) => r.status !== 'resolved').forEach((r) => act.resumeReport(r.emailId, 300, 1200));
    return () => ts.forEach(clearTimeout);
  }, [s.phase, act]);

  // achievements
  useEffect(() => {
    if (s.phase !== 'desktop') return;
    const met = achievementsMet(s);
    met.forEach((id) => {
      if (s.achievements[id]) return;
      d({ type: 'ach/unlock', id });
      const a = ACHIEVEMENTS.find((x) => x.id === id);
      act.log(`Achievement unlocked: ${a.name}`, 'ok');
      act.notify({ kind: 'achievement', title: `Achievement: ${a.name}`, text: a.desc, ms: 6000, achId: id });
    });
  }, [s, act]);

  const value = useMemo(() => ({ s, d, act, reduced, rank: rankFor(s.xp) }), [s, act, reduced]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
