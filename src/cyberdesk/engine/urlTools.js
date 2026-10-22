import { SITES } from './scenario.js';

export function parseUrl(raw) {
  try {
    const u = new URL(raw);
    const labels = u.hostname.split('.');
    const registrable = labels.slice(-2).join('.');
    const sub = labels.slice(0, -2).join('.');
    const params = [...u.searchParams.entries()];
    return { ok: true, href: u.href, protocol: u.protocol.replace(':', ''), hostname: u.hostname, subdomain: sub, registrable, path: u.pathname, search: u.search, params };
  } catch { return { ok: false, href: raw }; }
}

/** Authored analysis for a URL (never a live scan). */
export function analyse(raw, displayedText) {
  const p = parseUrl(raw);
  if (!p.ok) return { parsed: p, reputation: 'unknown', findings: [{ id: 'bad', tone: 'unknown', text: 'This is not a valid URL.' }], chain: [raw], site: null, evidence: [] };
  const site = SITES[p.hostname] || null;
  const findings = []; const evidence = [];
  const insecure = p.protocol !== 'https';
  if (insecure) findings.push({ id: 'http', tone: 'suspicious', text: 'Not encrypted (http).' });
  if (site) {
    if (site.reputation === 'known') findings.push({ id: 'known', tone: 'known', text: `Matches the known site "${site.brand}".` });
    if (site.expected && p.registrable !== site.expected) { findings.push({ id: 'mismatch', tone: 'mismatch', text: `Registrable domain is ${p.registrable}, not ${site.expected}.` }); evidence.push('lookalike-domain'); }
    if (site.flags?.includes('new-domain')) findings.push({ id: 'age', tone: 'suspicious', text: `Domain registered only ${site.ageDays} day${site.ageDays === 1 ? '' : 's'} ago.` });
    if (site.flags?.includes('shortener')) { findings.push({ id: 'short', tone: 'suspicious', text: 'Shortened link: the final destination is hidden until you follow it.' }); evidence.push('shortened-link'); }
    if (site.flags?.includes('tracker')) findings.push({ id: 'trk', tone: 'suspicious', text: 'Passes through an advertising tracker.' });
    if (site.cert?.mismatch) findings.push({ id: 'cert', tone: 'mismatch', text: 'Certificate is not validated to the organisation you expect.' });
    if (site.redirects && site.redirects.length > 1) evidence.push('shortened-link');
  } else {
    findings.push({ id: 'unk', tone: 'unknown', text: 'No simulated reputation data for this domain.' });
  }
  if (displayedText) {
    const shown = parseUrl(/^https?:/.test(displayedText) ? displayedText : 'https://' + displayedText.split(/[?\s]/)[0]);
    if (shown.ok && shown.hostname.includes('.') && shown.hostname !== p.hostname) {
      findings.push({ id: 'textmm', tone: 'mismatch', text: `The link text says ${shown.hostname} but it really goes to ${p.hostname}.` }); evidence.push('link-mismatch');
    }
  }
  const chain = site?.redirects || [p.href];
  const rep = site?.reputation === 'suspicious' || findings.some((f) => f.tone === 'mismatch') ? 'suspicious' : site?.reputation || 'unknown';
  return { parsed: p, reputation: rep, findings, chain, site, evidence: [...new Set(evidence)] };
}
