import React, { useState, useEffect } from 'react';
import { useStore } from '../engine/store.jsx';
import { A } from '../engine/assets.js';
import { Px, Button, Tabs, ProgressBar } from '../os/ui.jsx';

const SKILL_METADATA = [
  { id: 'url_analysis', name: 'URL & Domain Analysis', desc: 'Decoding URL structures, lookalike domains, punycode, and subdomain spoofing.', icon: 'inspector' },
  { id: 'sender_verification', name: 'Sender Identity Verification', desc: 'Validating envelope senders, display name mismatches, and SPF/DKIM alignment.', icon: 'mail' },
  { id: 'impersonation_detection', name: 'Impersonation & Spoofing', desc: 'Detecting forged authority, brand mimicry, and fake internal security warnings.', icon: 'threat-spoof' },
  { id: 'social_engineering', name: 'Social Engineering & Urgency', desc: 'Countering psychological pressure, manufactured panics, and too-good-to-be-true lures.', icon: 'threat-social' },
  { id: 'context_reasoning', name: 'Contextual Plausibility', desc: 'Evaluating whether the request fits legitimate business protocol and expectations.', icon: 'evidence-lookalike' },
  { id: 'attachment_safety', name: 'Attachment & File Safety', desc: 'Spotting double extensions, payload archives, macros, and executable risks.', icon: 'attach-exe' },
  { id: 'evidence_verification', name: 'Evidence & Independent Verification', desc: 'Cross-checking messages out-of-band via trusted directories, whois, and DNS.', icon: 'status-verified' },
  { id: 'incident_reporting', name: 'Reporting & Incident Response', desc: 'Constructing well-evidenced incident reports with proper classification.', icon: 'security-threat-credential' },
];

export default function LearningDashboard({ win }) {
  const { s, act } = useStore();
  const [tab, setTab] = useState('skills');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt to fetch from backend; fallback to store calculations
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3344/api/learning-dashboard');
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        }
      } catch {
        // Fallback to local store
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [s.xp]);

  // Fallback estimates if backend is unreachable
  const reportsCount = Object.keys(s.reports).length;
  const verifiedCount = Object.values(s.reports).filter(r => r.result?.outcome === 'accepted').length;
  const linksInspected = s.analysed.length;
  const attachmentsChecked = s.inspectedAttachments.length;
  const accuracy = reportsCount > 0 ? Math.round((verifiedCount / reportsCount) * 100) : 0;

  // Local estimated skill mastery if backend data not loaded yet
  const localSkills = SKILL_METADATA.map((skill, index) => {
    let score = 0.25; // Prior base
    if (skill.id === 'url_analysis') score += Math.min(0.65, linksInspected * 0.2);
    if (skill.id === 'attachment_safety') score += Math.min(0.65, attachmentsChecked * 0.25);
    if (skill.id === 'incident_reporting') score += Math.min(0.65, verifiedCount * 0.2);
    if (skill.id === 'sender_verification') score += Math.min(0.6, s.xp * 0.002);
    if (skill.id === 'social_engineering') score += Math.min(0.55, s.xp * 0.0018);
    if (skill.id === 'evidence_verification') score += Math.min(0.6, Object.values(s.evidence).flat().length * 0.08);
    if (skill.id === 'impersonation_detection') score += Math.min(0.55, verifiedCount * 0.15);
    if (skill.id === 'context_reasoning') score += Math.min(0.5, s.xp * 0.0015);

    const mastery = dashboardData?.mastery?.skills?.find(sk => sk.id === skill.id)?.mastery ?? Math.min(0.95, score);
    return {
      ...skill,
      mastery: parseFloat(mastery.toFixed(2)),
      pct: Math.round(mastery * 100),
      tier: mastery >= 0.85 ? 'Master' : mastery >= 0.70 ? 'Proficient' : mastery >= 0.40 ? 'Competent' : 'Novice'
    };
  });

  const avgMastery = Math.round((localSkills.reduce((acc, s) => acc + s.mastery, 0) / localSkills.length) * 100);

  return (
    <div className="learning-dashboard app-col">
      <div className="dash-hero">
        <div className="dash-avatar">
          <Px src={A.finn(avgMastery >= 70 ? 'happy' : avgMastery >= 40 ? 'thinking' : 'idle')} size={48} />
          <div>
            <h3>Security Proficiency Matrix</h3>
            <p className="sub">Bayesian Knowledge Tracing (BKT) adaptive learning profile</p>
          </div>
        </div>
        <div className="dash-stats">
          <div className="dstat"><b className="big">{avgMastery}%</b><small>Estimated Mastery</small></div>
          <div className="dstat"><b className="big">{s.xp}</b><small>Total XP</small></div>
          <div className="dstat"><b className="big">{accuracy}%</b><small>Triage Accuracy</small></div>
        </div>
      </div>

      <Tabs tabs={[
        { id: 'skills', label: 'Competency Radar' },
        { id: 'insights', label: 'Investigation Patterns' },
        { id: 'recommend', label: 'Adaptive Mission' }
      ]} value={tab} onChange={setTab} className="grow">
        {tab === 'skills' && (
          <div className="dash-pane">
            <p className="dim">Mastery is continuously re-estimated after each investigation using Bayesian Knowledge Tracing.</p>
            <div className="skills-grid">
              {localSkills.map(sk => (
                <div key={sk.id} className="skill-card">
                  <div className="sc-header">
                    <span className="sc-name">{sk.name}</span>
                    <span className={`sc-badge sc-${sk.tier.toLowerCase()}`}>{sk.tier} ({sk.pct}%)</span>
                  </div>
                  <ProgressBar value={sk.pct} label={sk.name} />
                  <p className="sc-desc">{sk.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'insights' && (
          <div className="dash-pane">
            <h4>Investigation Behavior & Safety Patterns</h4>
            <div className="insights-row">
              <div className="insight-box">
                <Px src={A.evidence('known')} size={32} />
                <div>
                  <b>Safe Link Handling</b>
                  <p>{linksInspected > 0 ? `Analysed ${linksInspected} links using Link Inspector before navigating.` : 'Try using Link Inspector before clicking suspicious links.'}</p>
                </div>
              </div>
              <div className="insight-box">
                <Px src={A.attach('exe')} size={32} />
                <div>
                  <b>Attachment Vigilance</b>
                  <p>{attachmentsChecked > 0 ? `Examined properties on ${attachmentsChecked} file attachments.` : 'Always inspect attachment properties before opening archives.'}</p>
                </div>
              </div>
              <div className="insight-box">
                <Px src={A.status('shield')} size={32} />
                <div>
                  <b>Incident Reporting Quality</b>
                  <p>{reportsCount > 0 ? `Filed ${reportsCount} reports with ${verifiedCount} accepted by Security Operations.` : 'File detailed incident reports with cited evidence.'}</p>
                </div>
              </div>
            </div>

            <h4 style={{ marginTop: '16px' }}>Incident History</h4>
            <table className="tbl">
              <thead><tr><th>Incident</th><th>Result</th><th>XP</th></tr></thead>
              <tbody>
                {Object.values(s.reports).length === 0 ? (
                  <tr><td colSpan="3" className="empty">No incidents evaluated yet. Complete investigations in CyberMail.</td></tr>
                ) : (
                  Object.values(s.reports).map(r => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td><span className={r.result?.outcome === 'accepted' ? 'good' : 'bad'}>{r.result?.outcome || 'pending'}</span></td>
                      <td>+{r.result?.xp || 0} XP</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'recommend' && (
          <div className="dash-pane">
            <div className="rec-box">
              <Px src={A.app('mission')} size={48} />
              <div>
                <h4>Recommended Practice Challenge</h4>
                <p>Based on your lowest mastery score (<b>{localSkills.sort((a,b) => a.mastery - b.mastery)[0]?.name}</b>), our adaptive engine recommends:</p>
                <div className="rec-card">
                  <b>Mission: High-Urgency Account Verification Triage</b>
                  <p>Investigate subtle lookalike domains and urgent authority impersonation in a controlled email scenario.</p>
                  <Button def onClick={() => act.launch('mail')}>Launch Practice in CyberMail</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
}
