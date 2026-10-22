/**
 * Authoritative Server-Side Deterministic Scenario Evaluation Engine
 * 
 * Rules:
 * - Deterministic pure evaluation (never relying on LLM to judge user answers).
 * - Multi-dimensional rubric:
 *   1. Final decision correctness (phish reported vs safe archived)
 *   2. Threat category identification
 *   3. Evidence relevance (rewards valid evidence, penalizes unsupported accusations)
 *   4. Safety behavior (handling links, downloads, credentials)
 *   5. Independent verification (bonus for cross-checking out-of-band)
 */

export function evaluateAttempt({
  scenario,
  decision, // 'reported' | 'safe' | 'deleted'
  report = null, // { category, evidence, notes }
  investigation = [], // array of { event_type, details }
  verified = false, // did user independently verify out-of-band
}) {
  const truth = typeof scenario.truth_json === 'string' ? JSON.parse(scenario.truth_json) : scenario.truth_json;
  const isPhish = !!truth.phish;
  const lines = [];
  let isCorrect = false;
  let baseScore = 0;
  let categoryOk = false;
  let goodEvidence = [];
  let badEvidence = [];
  let missedEvidence = [];

  // Check safety violations in investigation events
  const clickedPhishLink = isPhish && investigation.some(e => e.event_type === 'click_link');
  const openedRiskyAttachment = investigation.some(e => e.event_type === 'run_attachment');
  const submittedPhishCreds = isPhish && investigation.some(e => e.event_type === 'submit_form');

  if (decision === 'safe') {
    if (!isPhish) {
      isCorrect = true;
      baseScore = 40;
      lines.push({ label: 'Correctly identified legitimate message', xp: 40 });
    } else {
      isCorrect = false;
      baseScore = 0;
      lines.push({ label: 'Missed threat: Phishing marked as legitimate', xp: 0 });
    }
  } else if (decision === 'deleted') {
    isCorrect = false;
    baseScore = 5;
    lines.push({ label: 'Message deleted without incident report (no credit)', xp: 5 });
  } else if (decision === 'reported') {
    if (!isPhish) {
      // False alarm reporting legitimate email
      isCorrect = false;
      baseScore = 0;
      lines.push({ label: 'False alarm: Legitimate communication reported as attack', xp: 0 });
    } else {
      // Legitimate report of phishing
      isCorrect = true;
      baseScore = 30;
      lines.push({ label: 'Correctly reported phishing threat', xp: 30 });

      // 1. Category accuracy
      if (report && report.category) {
        if (report.category === truth.category) {
          categoryOk = true;
          baseScore += 40;
          lines.push({ label: 'Accurate threat category identified', xp: 40 });
        } else if (truth.alt && truth.alt.includes(report.category)) {
          categoryOk = true;
          baseScore += 25;
          lines.push({ label: 'Acceptable threat category (close match)', xp: 25 });
        } else {
          lines.push({ label: 'Threat category did not match evidence', xp: 10 });
        }
      }

      // 2. Evidence relevance
      if (report && Array.isArray(report.evidence)) {
        const truthEv = truth.evidence || [];
        goodEvidence = report.evidence.filter(e => truthEv.includes(e));
        badEvidence = report.evidence.filter(e => !truthEv.includes(e));
        missedEvidence = truthEv.filter(e => !report.evidence.includes(e));

        const evReward = Math.min(40, goodEvidence.length * 10);
        const evPenalty = badEvidence.length * 5;

        if (goodEvidence.length > 0) {
          baseScore += evReward;
          lines.push({
            label: `${goodEvidence.length} verified evidence item${goodEvidence.length > 1 ? 's' : ''}`,
            xp: evReward,
          });
        }

        if (badEvidence.length > 0) {
          baseScore = Math.max(10, baseScore - evPenalty);
          lines.push({
            label: `${badEvidence.length} unsupported accusation${badEvidence.length > 1 ? 's' : ''}`,
            xp: -evPenalty,
          });
        }
      }
    }
  }

  // 3. Independent verification bonus
  if (verified && isCorrect) {
    baseScore += 20;
    lines.push({ label: 'Independent verification confirmed out-of-band', xp: 20 });
  }

  // 4. Safety penalties
  if (clickedPhishLink) {
    baseScore = Math.max(0, baseScore - 15);
    lines.push({ label: 'Safety violation: Clicked unverified link', xp: -15 });
  }
  if (submittedPhishCreds) {
    baseScore = Math.max(0, baseScore - 30);
    lines.push({ label: 'Critical safety violation: Submitted credentials to mock form', xp: -30 });
  }
  if (openedRiskyAttachment) {
    baseScore = Math.max(0, baseScore - 20);
    lines.push({ label: 'Safety violation: Executed untrusted attachment', xp: -20 });
  }

  // Construct comprehensive educational debrief feedback
  const educationalFeedback = {
    isCorrect,
    outcome: isCorrect ? (decision === 'reported' ? 'accepted' : 'verified_safe') : 'rejected',
    totalXp: Math.max(0, baseScore),
    breakdown: lines,
    groundTruth: {
      isPhish,
      category: truth.category || null,
      expectedEvidence: truth.evidence || [],
      lesson: scenario.narrative || truth.lesson || '',
      legitSignals: truth.legit || [],
    },
    evidenceAnalysis: {
      good: goodEvidence,
      bad: badEvidence,
      missed: missedEvidence,
    },
    safetySummary: {
      clickedPhishLink,
      submittedPhishCreds,
      openedRiskyAttachment,
      verifiedOutBand: verified,
    },
    remediation: isCorrect
      ? 'Outstanding investigation! You applied proper vigilance, cross-checked clues, and reached a well-supported conclusion.'
      : isPhish
      ? 'Threat missed or misidentified. In phishing triage, always inspect sender domains in headers, look for lookalike spelling anomalies, and never click unknown links.'
      : 'False alarm. Over-reporting legitimate messages overwhelms incident response teams. Check if the sender domain matches official records and if any sensitive data is requested.',
  };

  return educationalFeedback;
}
