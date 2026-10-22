import express from 'express';
import crypto from 'crypto';
import { db } from './db.js';
import { recordSkillObservations, getUserMasteryProfile, recommendNextScenario } from './bkt.js';
import { evaluateAttempt } from './scoring.js';
import { validateScenario, generateDeterministicScenario } from './aiService.js';

export const router = express.Router();

// Helper to get or create user
function resolveUser(req) {
  const userId = req.headers['x-user-id'] || req.query.userId || req.body?.userId;
  if (!userId) return null;
  return db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
}

// ---------------------------------------------------- Health
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: Date.now(),
    database: 'connected',
    version: '1.0.0',
    simulation: 'isolated_safe_mode'
  });
});

// ---------------------------------------------------- Auth & Profile
router.post('/auth/guest', (req, res) => {
  const displayName = req.body?.displayName?.trim() || 'Cadet Analyst';
  const userId = 'usr_' + crypto.randomBytes(6).toString('hex');
  const now = Date.now();

  db.prepare(`
    INSERT INTO users (id, username, display_name, is_guest, total_xp, rank_id, created_at, last_active)
    VALUES (?, ?, ?, 1, 0, 'trainee', ?, ?)
  `).run(userId, userId, displayName, now, now);

  const defaultSettings = {
    sound: true,
    volume: 0.6,
    motion: 'system',
    contrast: false,
    scanlines: true,
    touch: false,
    wallpaper: 'landscape',
  };

  db.prepare(`
    INSERT INTO user_settings (user_id, settings_json, updated_at)
    VALUES (?, ?, ?)
  `).run(userId, JSON.stringify(defaultSettings), now);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  const mastery = getUserMasteryProfile(userId);

  res.json({
    user,
    settings: defaultSettings,
    mastery,
  });
});

router.get('/auth/profile', (req, res) => {
  const user = resolveUser(req);
  if (!user) return res.status(401).json({ error: 'User session required' });

  const settingsRow = db.prepare('SELECT settings_json FROM user_settings WHERE user_id = ?').get(user.id);
  const settings = settingsRow ? JSON.parse(settingsRow.settings_json) : {};
  const mastery = getUserMasteryProfile(user.id);

  const achievements = db.prepare(`
    SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = ?
  `).all(user.id);

  res.json({
    user,
    settings,
    mastery,
    achievements,
  });
});

router.put('/auth/profile', (req, res) => {
  const user = resolveUser(req);
  if (!user) return res.status(401).json({ error: 'User session required' });

  const { displayName, settings } = req.body;
  const now = Date.now();

  if (displayName) {
    db.prepare('UPDATE users SET display_name = ?, last_active = ? WHERE id = ?')
      .run(displayName.trim().slice(0, 32), now, user.id);
  }

  if (settings) {
    db.prepare(`
      INSERT OR REPLACE INTO user_settings (user_id, settings_json, updated_at)
      VALUES (?, ?, ?)
    `).run(user.id, JSON.stringify(settings), now);
  }

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
  res.json({ user: updated, success: true });
});

// ---------------------------------------------------- Scenarios Catalog
router.get('/scenarios', (req, res) => {
  const { difficulty } = req.query;
  let query = "SELECT id, title, category, difficulty, objective, narrative, skills_json FROM scenarios WHERE validation_status = 'approved'";
  const params = [];

  if (difficulty) {
    query += ' AND difficulty = ?';
    params.push(difficulty);
  }

  const rows = db.prepare(query).all(...params);
  res.json({
    scenarios: rows.map(r => ({
      ...r,
      skills: JSON.parse(r.skills_json || '[]')
    }))
  });
});

router.get('/scenarios/recommended', (req, res) => {
  const user = resolveUser(req);
  const userId = user ? user.id : 'anonymous';
  const recommendation = recommendNextScenario(userId);
  res.json({ recommendation });
});

router.get('/scenarios/:id', (req, res) => {
  const sc = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(req.params.id);
  if (!sc) return res.status(404).json({ error: 'Scenario not found' });

  // Security: omit ground-truth answers from the client payload during gameplay!
  const email = JSON.parse(sc.email_json);
  const clientEmail = { ...email };
  delete clientEmail.truth; // Never expose ground truth to client!

  res.json({
    scenario: {
      id: sc.id,
      title: sc.title,
      category: sc.category,
      difficulty: sc.difficulty,
      objective: sc.objective,
      skills: JSON.parse(sc.skills_json || '[]'),
      email: clientEmail,
      verification: sc.verification_json ? JSON.parse(sc.verification_json) : null,
    }
  });
});

// ---------------------------------------------------- Gameplay & Attempts
router.post('/attempts/start', (req, res) => {
  const user = resolveUser(req);
  if (!user) return res.status(401).json({ error: 'User session required' });

  const { scenarioId } = req.body;
  const scenario = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(scenarioId);
  if (!scenario) return res.status(404).json({ error: 'Scenario not found' });

  const attemptId = 'att_' + crypto.randomBytes(6).toString('hex');
  const now = Date.now();

  db.prepare(`
    INSERT INTO attempts (id, user_id, scenario_id, started_at)
    VALUES (?, ?, ?, ?)
  `).run(attemptId, user.id, scenarioId, now);

  db.prepare(`
    INSERT INTO investigation_events (attempt_id, event_type, details_json, created_at)
    VALUES (?, 'start_attempt', ?, ?)
  `).run(attemptId, JSON.stringify({ scenarioId }), now);

  res.json({
    attemptId,
    scenarioId,
    startedAt: now,
  });
});

router.post('/attempts/:id/action', (req, res) => {
  const attempt = db.prepare('SELECT * FROM attempts WHERE id = ?').get(req.params.id);
  if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
  if (attempt.completed_at) return res.status(400).json({ error: 'Attempt already finalized' });

  const { eventType, details } = req.body;
  const now = Date.now();

  db.prepare(`
    INSERT INTO investigation_events (attempt_id, event_type, details_json, created_at)
    VALUES (?, ?, ?, ?)
  `).run(attempt.id, eventType, JSON.stringify(details || {}), now);

  res.json({ success: true, eventType, timestamp: now });
});

router.post('/attempts/:id/decide', (req, res) => {
  const attempt = db.prepare('SELECT * FROM attempts WHERE id = ?').get(req.params.id);
  if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
  if (attempt.completed_at) return res.status(400).json({ error: 'Attempt already finalized' });

  const scenario = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(attempt.scenario_id);
  const { decision, report, verified } = req.body;

  // Retrieve all logged investigation events for this attempt
  const events = db.prepare('SELECT * FROM investigation_events WHERE attempt_id = ?').all(attempt.id);

  // Authoritative server-side deterministic evaluation
  const evaluation = evaluateAttempt({
    scenario,
    decision,
    report,
    investigation: events,
    verified: !!verified,
  });

  const now = Date.now();
  const isCorrectNum = evaluation.isCorrect ? 1 : 0;

  // Update attempt record
  db.prepare(`
    UPDATE attempts
    SET completed_at = ?, decision = ?, is_correct = ?, xp_awarded = ?, evaluation_json = ?
    WHERE id = ?
  `).run(now, decision, isCorrectNum, evaluation.totalXp, JSON.stringify(evaluation), attempt.id);

  // Update user XP & rank
  db.prepare(`
    UPDATE users
    SET total_xp = total_xp + ?, last_active = ?
    WHERE id = ?
  `).run(evaluation.totalXp, now, attempt.user_id);

  // Calculate new rank
  const updatedUser = db.prepare('SELECT total_xp FROM users WHERE id = ?').get(attempt.user_id);
  let rankId = 'trainee';
  const xp = updatedUser.total_xp;
  if (xp >= 1500) rankId = 'sage';
  else if (xp >= 1000) rankId = 'chief';
  else if (xp >= 700) rankId = 'investigator';
  else if (xp >= 500) rankId = 'specialist';
  else if (xp >= 350) rankId = 'senior';
  else if (xp >= 200) rankId = 'analyst';
  else if (xp >= 100) rankId = 'junior';

  db.prepare('UPDATE users SET rank_id = ? WHERE id = ?').run(rankId, attempt.user_id);

  // Update BKT skill mastery for all associated skills
  const skills = JSON.parse(scenario.skills_json || '[]');
  const masteryUpdates = recordSkillObservations(attempt.user_id, skills, evaluation.isCorrect);

  // Check achievements
  const newAchievements = [];
  if (evaluation.isCorrect && decision === 'reported') {
    const hasFirst = db.prepare("SELECT 1 FROM user_achievements WHERE user_id = ? AND achievement_id = 'first_report'").get(attempt.user_id);
    if (!hasFirst) {
      db.prepare("INSERT INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES (?, 'first_report', ?)")
        .run(attempt.user_id, now);
      newAchievements.push('first_report');
    }
  }

  res.json({
    attemptId: attempt.id,
    evaluation,
    masteryUpdates,
    xpAwarded: evaluation.totalXp,
    totalXp: updatedUser.total_xp,
    rankId,
    newAchievements,
  });
});

// ---------------------------------------------------- Learning Dashboard
router.get('/learning-dashboard', (req, res) => {
  const user = resolveUser(req);
  if (!user) return res.status(401).json({ error: 'User session required' });

  const masteryProfile = getUserMasteryProfile(user.id);

  // Recent attempts
  const recentAttempts = db.prepare(`
    SELECT a.id, a.scenario_id, a.started_at, a.completed_at, a.decision, a.is_correct, a.xp_awarded,
           s.title, s.category, s.difficulty
    FROM attempts a
    JOIN scenarios s ON s.id = a.scenario_id
    WHERE a.user_id = ? AND a.completed_at IS NOT NULL
    ORDER BY a.completed_at DESC
    LIMIT 10
  `).all(user.id);

  // Safe action patterns
  const allEvents = db.prepare(`
    SELECT ie.event_type, COUNT(*) as count
    FROM investigation_events ie
    JOIN attempts a ON a.id = ie.attempt_id
    WHERE a.user_id = ?
    GROUP BY ie.event_type
  `).all(user.id);

  const recommendation = recommendNextScenario(user.id);

  res.json({
    user,
    mastery: masteryProfile,
    recentAttempts,
    eventStats: allEvents,
    recommendation,
  });
});

// ---------------------------------------------------- Daily Challenge
router.get('/daily-challenge', (req, res) => {
  const user = resolveUser(req);
  const today = new Date().toISOString().split('T')[0];

  let challenge = db.prepare('SELECT * FROM daily_challenges WHERE id = ?').get(today);
  if (!challenge) {
    // Pick an approved scenario for today's challenge
    const sc = db.prepare("SELECT id FROM scenarios WHERE validation_status = 'approved' ORDER BY RANDOM() LIMIT 1").get();
    if (sc) {
      db.prepare(`
        INSERT INTO daily_challenges (id, scenario_id, bonus_xp, title, description)
        VALUES (?, ?, ?, ?, ?)
      `).run(today, sc.id, 75, 'Daily Threat Triage', "Analyze today's incoming message and verify sender credentials.");
      challenge = db.prepare('SELECT * FROM daily_challenges WHERE id = ?').get(today);
    }
  }

  let completed = false;
  if (user && challenge) {
    const comp = db.prepare('SELECT * FROM user_daily_completions WHERE user_id = ? AND challenge_id = ?').get(user.id, challenge.id);
    completed = !!comp;
  }

  res.json({
    challenge,
    completed,
  });
});

// ---------------------------------------------------- Leaderboard
router.get('/leaderboard', (req, res) => {
  const rows = db.prepare(`
    SELECT u.id, u.display_name, u.total_xp, u.rank_id,
           COUNT(a.id) as completed_count,
           SUM(CASE WHEN a.is_correct = 1 THEN 1 ELSE 0 END) as correct_count
    FROM users u
    LEFT JOIN attempts a ON a.user_id = u.id AND a.completed_at IS NOT NULL
    GROUP BY u.id
    ORDER BY u.total_xp DESC
    LIMIT 20
  `).all();

  const formatted = rows.map((r, i) => ({
    rank: i + 1,
    id: r.id,
    displayName: r.display_name,
    xp: r.total_xp,
    rankId: r.rank_id,
    completedScenarios: r.completed_count,
    accuracyPct: r.completed_count > 0 ? Math.round((r.correct_count / r.completed_count) * 100) : 0,
  }));

  res.json({ leaderboard: formatted });
});

// ---------------------------------------------------- AI Content Generation & Validation
router.post('/ai/generate', (req, res) => {
  const { category, difficulty, targetSkill, isPhish } = req.body;
  const candidate = generateDeterministicScenario({
    category,
    difficulty,
    targetSkill,
    isPhish: isPhish !== false,
  });

  const validation = validateScenario(candidate);

  res.json({
    scenario: candidate,
    validation,
  });
});

router.post('/ai/validate', (req, res) => {
  const { scenario } = req.body;
  const result = validateScenario(scenario);
  res.json(result);
});

// ---------------------------------------------------- Web Browser Proxy for Live Web Browsing
router.get('/proxy', async (req, res) => {
  let targetUrl = req.query.url;
  if (!targetUrl || typeof targetUrl !== 'string') {
    return res.status(400).send('Missing "url" query parameter');
  }

  // Normalize protocol
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }

  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch (err) {
    return res.status(400).send('Invalid URL format');
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const upstream = await fetch(parsed.href, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    clearTimeout(timeout);

    const finalUrl = upstream.url || parsed.href;
    const contentType = upstream.headers.get('content-type') || 'text/html';

    // Strip frame-blocking and restriction headers
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
    res.removeHeader('Cross-Origin-Opener-Policy');
    res.removeHeader('Cross-Origin-Embedder-Policy');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Final-Url', finalUrl);

    if (contentType.includes('text/html')) {
      let html = await upstream.text();

      // Inject <base href="..."> so relative paths (CSS, images, links) load correctly
      const baseTag = `<base href="${finalUrl}">`;

      // Injected helper script: intercept link clicks to notify CyberSurf window
      const injectedNavScript = `
<script>
(function() {
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a');
    if (a && a.href && !a.href.startsWith('javascript:') && !a.href.startsWith('#')) {
      e.preventDefault();
      try {
        window.parent.postMessage({ type: 'CYBERDESK_NAV', url: a.href }, '*');
      } catch (err) {
        window.location.href = '/api/proxy?url=' + encodeURIComponent(a.href);
      }
    }
  }, true);
})();
</script>
`;

      if (/<head[^>]*>/i.test(html)) {
        html = html.replace(/<head[^>]*>/i, (m) => `${m}\n${baseTag}\n${injectedNavScript}`);
      } else {
        html = `${baseTag}\n${injectedNavScript}\n${html}`;
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(html);
    } else {
      res.setHeader('Content-Type', contentType);
      const buffer = Buffer.from(await upstream.arrayBuffer());
      return res.send(buffer);
    }
  } catch (err) {
    return res.status(502).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>CyberSurf Web Proxy Error</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 32px; background: #e0e0e0; color: #222; }
          .card { background: white; border: 2px solid #808080; border-radius: 6px; padding: 24px; max-width: 620px; margin: 40px auto; box-shadow: 2px 2px 10px rgba(0,0,0,0.2); }
          h2 { color: #b71c1c; margin-top: 0; display: flex; align-items: center; gap: 8px; }
          code { background: #f0f0f0; padding: 3px 6px; border-radius: 3px; word-break: break-all; font-size: 13px; }
          p { line-height: 1.5; }
          .actions { margin-top: 20px; display: flex; gap: 12px; }
          .btn { background: #005a9e; color: white; border: none; padding: 8px 18px; font-weight: bold; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block; }
          .btn-secondary { background: #e0e0e0; color: #333; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>🌐 Unable to load website via Proxy</h2>
          <p>CyberSurf could not fetch <code>${targetUrl}</code>:</p>
          <p style="color: #666; font-style: italic;">${err.message}</p>
          <p>You can open this website directly in your real Chrome browser window or try loading directly without the proxy.</p>
          <div class="actions">
            <a class="btn" href="${targetUrl}" target="_blank" rel="noreferrer">Open in Real Chrome ↗</a>
            <button class="btn btn-secondary" onclick="window.parent.postMessage({ type: 'CYBERDESK_TOGGLE_DIRECT' }, '*')">Try Direct Iframe</button>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

