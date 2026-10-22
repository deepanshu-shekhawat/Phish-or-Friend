/**
 * Bayesian Knowledge Tracing (BKT) Engine & Adaptive Learning Controller
 * 
 * Implements standard probabilistic knowledge estimation:
 * - Prior: P(L_0) - initial mastery estimate
 * - Transit: P(T) - probability of learning the skill during an interaction
 * - Guess: P(G) - probability of answering correctly despite not knowing
 * - Slip: P(S) - probability of making a mistake despite knowing
 */

import { db } from './db.js';

// Default BKT parameters
export const DEFAULT_BKT_PARAMS = {
  p_l0: 0.20,
  p_transit: 0.15,
  p_guess: 0.15,
  p_slip: 0.10,
};

/**
 * Computes updated P(L_t) given the previous P(L_{t-1}) and the observation (correct: true/false).
 */
export function calculateBktUpdate(currentPL, isCorrect, params = DEFAULT_BKT_PARAMS) {
  const pL = Math.max(0.01, Math.min(0.99, currentPL));
  const pG = params.p_guess ?? DEFAULT_BKT_PARAMS.p_guess;
  const pS = params.p_slip ?? DEFAULT_BKT_PARAMS.p_slip;
  const pT = params.p_transit ?? DEFAULT_BKT_PARAMS.p_transit;

  let pPosterior;
  if (isCorrect) {
    const numerator = pL * (1 - pS);
    const denominator = numerator + (1 - pL) * pG;
    pPosterior = numerator / (denominator || 1);
  } else {
    const numerator = pL * pS;
    const denominator = numerator + (1 - pL) * (1 - pG);
    pPosterior = numerator / (denominator || 1);
  }

  // Knowledge transition update
  const pNext = pPosterior + (1 - pPosterior) * pT;
  return Math.max(0.02, Math.min(0.98, parseFloat(pNext.toFixed(4))));
}

/**
 * Calculates next spaced-repetition review timestamp based on mastery level and success streak.
 */
export function calculateNextReview(pL, consecutiveCorrect = 1) {
  const now = Date.now();
  let intervalMs;

  if (pL < 0.40) {
    intervalMs = 15 * 60 * 1000; // 15 minutes (immediate remediation)
  } else if (pL < 0.70) {
    intervalMs = 2 * 60 * 60 * 1000; // 2 hours
  } else if (pL < 0.85) {
    intervalMs = 24 * 60 * 60 * 1000 * Math.min(3, consecutiveCorrect); // 1-3 days
  } else {
    intervalMs = 3 * 24 * 60 * 60 * 1000 * Math.min(7, consecutiveCorrect); // 3-7 days
  }

  return now + intervalMs;
}

/**
 * Updates mastery records in the database for all skills involved in an attempt.
 */
export function recordSkillObservations(userId, skillIds, isCorrect) {
  const now = Date.now();
  const getSkill = db.prepare('SELECT * FROM skills WHERE id = ?');
  const getMastery = db.prepare('SELECT * FROM skill_mastery WHERE user_id = ? AND skill_id = ?');
  const insertMastery = db.prepare(`
    INSERT INTO skill_mastery (user_id, skill_id, p_l, attempts_count, correct_count, last_practiced, next_review_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const updateMastery = db.prepare(`
    UPDATE skill_mastery
    SET p_l = ?, attempts_count = attempts_count + 1, correct_count = correct_count + ?, last_practiced = ?, next_review_at = ?
    WHERE user_id = ? AND skill_id = ?
  `);

  const updates = [];

  const tx = db.transaction(() => {
    for (const skillId of skillIds) {
      const skill = getSkill.get(skillId);
      if (!skill) continue;

      const current = getMastery.get(userId, skillId);
      const currentPL = current ? current.p_l : (skill.default_p_l || 0.20);
      const newPL = calculateBktUpdate(currentPL, isCorrect, {
        p_transit: skill.p_transit,
        p_guess: skill.p_guess,
        p_slip: skill.p_slip,
      });

      const nextReview = calculateNextReview(newPL, (current?.correct_count || 0) + (isCorrect ? 1 : 0));

      if (!current) {
        insertMastery.run(userId, skillId, newPL, 1, isCorrect ? 1 : 0, now, nextReview);
      } else {
        updateMastery.run(newPL, isCorrect ? 1 : 0, now, nextReview, userId, skillId);
      }

      updates.push({
        skillId,
        skillName: skill.name,
        oldPL: currentPL,
        newPL,
        delta: parseFloat((newPL - currentPL).toFixed(4)),
      });
    }
  });

  tx();
  return updates;
}

/**
 * Retrieves the comprehensive mastery profile for a user across all 8 skills.
 */
export function getUserMasteryProfile(userId) {
  const skills = db.prepare(`
    SELECT s.id, s.name, s.description, s.icon,
           COALESCE(sm.p_l, s.default_p_l) as mastery,
           COALESCE(sm.attempts_count, 0) as attempts,
           COALESCE(sm.correct_count, 0) as correct,
           sm.last_practiced,
           sm.next_review_at
    FROM skills s
    LEFT JOIN skill_mastery sm ON sm.skill_id = s.id AND sm.user_id = ?
    ORDER BY s.rowid ASC
  `).all(userId);

  const totalAttempts = skills.reduce((acc, s) => acc + s.attempts, 0);
  const totalCorrect = skills.reduce((acc, s) => acc + s.correct, 0);
  const avgMastery = skills.length ? skills.reduce((acc, s) => acc + s.mastery, 0) / skills.length : 0.2;

  // Identify weakest skills (lowest P(L))
  const sortedByMastery = [...skills].sort((a, b) => a.mastery - b.mastery);
  const weakSkills = sortedByMastery.slice(0, 3);
  const strongSkills = sortedByMastery.slice(-3).reverse();

  // Determine learner tier
  let tier = 'beginner';
  if (avgMastery >= 0.75) tier = 'advanced';
  else if (avgMastery >= 0.45) tier = 'intermediate';

  return {
    skills,
    overall: {
      averageMastery: parseFloat(avgMastery.toFixed(4)),
      totalAttempts,
      totalCorrect,
      accuracyPct: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
      tier,
    },
    weakSkills,
    strongSkills,
  };
}

/**
 * Selects the optimal next scenario for the user based on:
 * 1. Spaced review due dates
 * 2. Learner's weakest skills
 * 3. Matched difficulty level
 * 4. Preventing immediate repeats of recently played scenarios
 */
export function recommendNextScenario(userId) {
  const profile = getUserMasteryProfile(userId);
  const targetTier = profile.overall.tier;
  const now = Date.now();

  // Find recent attempt scenario IDs to avoid repeating
  const recentAttempts = db.prepare(`
    SELECT scenario_id FROM attempts
    WHERE user_id = ?
    ORDER BY started_at DESC
    LIMIT 4
  `).all(userId).map(r => r.scenario_id);

  // Check if any skill is due for spaced review
  const dueSkills = profile.skills.filter(s => s.next_review_at && s.next_review_at <= now);
  const targetSkillId = dueSkills.length > 0 ? dueSkills[0].id : profile.weakSkills[0]?.id;

  // Fetch approved scenarios matching tier or adjacent tier
  const scenarios = db.prepare(`
    SELECT id, title, category, difficulty, objective, skills_json
    FROM scenarios
    WHERE validation_status = 'approved'
  `).all();

  // Filter out recently completed scenarios if there are alternatives
  const freshScenarios = scenarios.filter(s => !recentAttempts.includes(s.id));
  const pool = freshScenarios.length > 0 ? freshScenarios : scenarios;

  if (pool.length === 0) return null;

  // Score candidate scenarios
  const scored = pool.map(sc => {
    let score = 0;
    const scSkills = JSON.parse(sc.skills_json || '[]');

    // Prioritize target skill
    if (targetSkillId && scSkills.includes(targetSkillId)) {
      score += 50;
    }

    // Prioritize matching difficulty tier
    if (sc.difficulty === targetTier) {
      score += 30;
    } else if (
      (targetTier === 'intermediate' && (sc.difficulty === 'beginner' || sc.difficulty === 'advanced')) ||
      (targetTier === 'advanced' && sc.difficulty === 'intermediate') ||
      (targetTier === 'beginner' && sc.difficulty === 'intermediate')
    ) {
      score += 15;
    }

    return { ...sc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const chosen = scored[0];

  return {
    scenarioId: chosen.id,
    title: chosen.title,
    difficulty: chosen.difficulty,
    category: chosen.category,
    objective: chosen.objective,
    reason: targetSkillId
      ? `Recommended to strengthen ${profile.skills.find(s => s.id === targetSkillId)?.name || 'skills'}`
      : 'Recommended challenge for your current skill level',
    targetSkill: targetSkillId,
  };
}
