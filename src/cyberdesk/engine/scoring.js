// One scoring engine. Pure functions only; the store applies results exactly once per message.
import { RANKS, ACHIEVEMENTS, EMAILS, EVIDENCE } from './scenario.js';

export function evaluateReport(email, report) {
  const lines = [];
  if (!email.truth.phish) {
    return { outcome: 'rejected', correct: false, xp: 0, lines: [{ label: 'This message was legitimate', xp: 0 }], lesson: email.lesson, categoryOk: false };
  }
  const t = email.truth;
  let catXp = 15, catOk = false;
  if (report.category === t.category) { catXp = 50; catOk = true; lines.push({ label: 'Correct threat category', xp: 50 }); }
  else if (t.alt?.includes(report.category)) { catXp = 35; catOk = true; lines.push({ label: 'Acceptable category (close match)', xp: 35 }); }
  else lines.push({ label: 'Category did not match', xp: 15 });
  const good = report.evidence.filter((e) => t.evidence.includes(e));
  const bad = report.evidence.filter((e) => !t.evidence.includes(e));
  const evXp = Math.max(0, Math.min(60, good.length * 10) - bad.length * 5);
  if (good.length) lines.push({ label: `${good.length} correct evidence item${good.length > 1 ? 's' : ''}`, xp: Math.min(60, good.length * 10) });
  if (bad.length) lines.push({ label: `${bad.length} item${bad.length > 1 ? 's' : ''} not supported`, xp: -bad.length * 5 });
  const missed = t.evidence.filter((e) => !report.evidence.includes(e));
  return { outcome: 'accepted', correct: true, categoryOk: catOk, xp: catXp + evXp, lines, missed, good, bad, lesson: email.lesson };
}

export function evaluateSafe(email) {
  return email.truth.phish
    ? { correct: false, xp: 0, lines: [{ label: 'This message was phishing', xp: 0 }] }
    : { correct: true, xp: 30, lines: [{ label: 'Correctly marked safe', xp: 30 }] };
}

export const rankFor = (xp) => [...RANKS].reverse().find((r) => xp >= r.xp) || RANKS[0];
export const nextRank = (xp) => RANKS.find((r) => r.xp > xp) || null;

export const decided = (s, id) => s.mail[id]?.decision;
export function isCorrect(s, e) {
  const d = s.mail[e.id]?.decision;
  if (!d) return null;
  if (e.truth.phish) return d === 'reported' && s.reports[e.id]?.result.outcome === 'accepted';
  return d === 'safe';
}

/** Returns ids of achievements whose criteria are currently met (caller unlocks only new ones). */
export function achievementsMet(s) {
  const met = new Set();
  const delivered = EMAILS.filter((e) => s.mail[e.id]);
  const decisions = delivered.filter((e) => s.mail[e.id].decision);
  const reports = Object.values(s.reports);
  const accepted = reports.filter((r) => r.result.outcome === 'accepted');
  const discovered = Object.values(s.evidence).reduce((n, a) => n + a.length, 0);
  if (accepted.length) met.add('first_report');
  if (discovered >= 3) met.add('sharp_eyes');
  if (s.analysed.length >= 2) met.add('link_sleuth');
  const clickedPhish = EMAILS.some((e) => e.truth.phish && s.mail[e.id]?.clicked);
  if (decisions.length >= 3 && !clickedPhish) met.add('safe_clicker');
  if (EMAILS.some((e) => { const m = s.mail[e.id]; return m?.decision && m.openedAt && m.decidedAt && isCorrect(s, e) && m.decidedAt - m.openedAt <= 45000; })) met.add('speed_reader');
  const all = delivered.length === EMAILS.length;
  if (all && decisions.length === EMAILS.length) {
    met.add('inbox_clear');
    if (EMAILS.every((e) => isCorrect(s, e))) met.add('perfect_run');
    const t0 = s.startedAt; const t1 = Math.max(...decisions.map((e) => s.mail[e.id].decidedAt || 0));
    if (t1 - t0 <= 10 * 60 * 1000) met.add('on_the_clock');
  }
  if (rankFor(s.xp).xp >= 350) met.add('champion');
  if (s.sites.some((x) => x.fake && x.login && !x.submitted && x.left)) met.add('key_keeper');
  if (s.inspectedAttachments.some((id) => { const e = EMAILS.find((m) => m.attachments.some((a) => a.id === id)); return e && s.reports[e.id]?.result.outcome === 'accepted'; })) met.add('attachment_hawk');
  if (accepted.filter((r) => r.result.categoryOk).length >= 3) met.add('bullseye');
  if (s.flags.help) met.add('bookworm');
  if (s.files.some((f) => f.folder === 'Quarantine')) met.add('lockdown');
  if (EMAILS.some((e) => e.truth.phish && e.truth.evidence.every((x) => (s.evidence[e.id] || []).includes(x)))) met.add('all_seeing');
  const others = ACHIEVEMENTS.filter((a) => a.id !== 'cyber_royalty');
  if (others.every((a) => s.achievements[a.id] || met.has(a.id))) met.add('cyber_royalty');
  return met;
}

export function objectiveState(s) {
  const opened = EMAILS.every((e) => s.mail[e.id]?.openedAt);
  const reported = Object.values(s.reports).filter((r) => r.result.outcome === 'accepted').length;
  const safe = EMAILS.filter((e) => !e.truth.phish && s.mail[e.id]?.decision === 'safe').length;
  return { 'o-review': opened, 'o-inspect': s.analysed.length >= 1, 'o-report': reported >= 3, 'o-safe': safe >= 2, 'o-xp': s.xp >= 150 };
}
export { EVIDENCE };
