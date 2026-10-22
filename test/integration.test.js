import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../server/db.js';

let serverInstance;
let PORT = 3345; // Isolated test port

test('Integration Suite Setup: Starts backend Express server', async () => {
  process.env.PORT = String(PORT);
  const appModule = await import('../server/index.js');
  serverInstance = appModule.server;
  assert.ok(serverInstance, 'Server instance should be initialized');
});

test('Integration: GET /api/health returns operational status', async () => {
  const res = await fetch(`http://localhost:${PORT}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'online');
  assert.equal(data.database, 'connected');
});

test('Integration: POST /api/auth/guest registers new analyst session', async () => {
  const res = await fetch(`http://localhost:${PORT}/api/auth/guest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName: 'Cadet Integration' }),
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.user.id.startsWith('usr_'));
  assert.equal(data.user.display_name, 'Cadet Integration');
  assert.equal(data.user.total_xp, 0);
  assert.ok(data.mastery.skills.length >= 8);
});

test('Integration: GET /api/scenarios delivers catalog without leaking ground truth', async () => {
  const res = await fetch(`http://localhost:${PORT}/api/scenarios`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.scenarios.length >= 8);

  // Retrieve individual scenario
  const scId = data.scenarios[0].id;
  const singleRes = await fetch(`http://localhost:${PORT}/api/scenarios/${scId}`);
  assert.equal(singleRes.status, 200);
  const singleData = await singleRes.json();

  // CRITICAL SECURITY CHECK: truth must NOT be present in client payload!
  assert.equal(singleData.scenario.email.truth, undefined, 'Ground truth MUST NOT be leaked to client!');
  assert.ok(singleData.scenario.skills.length > 0);
});

test('Integration: Full Attempt Lifecycle (Start -> Action -> Decide -> BKT Update)', async () => {
  // 1. Create user
  const guestRes = await fetch(`http://localhost:${PORT}/api/auth/guest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName: 'Triage Agent' }),
  });
  const { user } = await guestRes.json();

  // 2. Start attempt for m-registrar (phishing)
  const startRes = await fetch(`http://localhost:${PORT}/api/attempts/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
    body: JSON.stringify({ scenarioId: 'm-registrar' }),
  });
  const startData = await startRes.json();
  assert.ok(startData.attemptId);

  // 3. Log investigation action
  const actionRes = await fetch(`http://localhost:${PORT}/api/attempts/${startData.attemptId}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
    body: JSON.stringify({ eventType: 'inspect_url', details: { url: 'https://eastbrook.secure-login.example/auth' } }),
  });
  assert.equal(actionRes.status, 200);

  // 4. Submit incident report
  const decideRes = await fetch(`http://localhost:${PORT}/api/attempts/${startData.attemptId}/decide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
    body: JSON.stringify({
      decision: 'reported',
      report: {
        category: 'credential',
        evidence: ['sender-domain', 'lookalike-domain', 'urgency', 'credential-request'],
        notes: 'Sender domain does not match official registrar.',
      },
      verified: true,
    }),
  });
  const decideData = await decideRes.json();
  assert.equal(decideData.evaluation.isCorrect, true);
  assert.equal(decideData.evaluation.outcome, 'accepted');
  assert.ok(decideData.xpAwarded > 50);

  // 5. Verify mastery record updated in database
  const masteryRow = db.prepare("SELECT p_l FROM skill_mastery WHERE user_id = ? AND skill_id = 'url_analysis'").get(user.id);
  assert.ok(masteryRow, 'Skill mastery row should exist');
  assert.ok(masteryRow.p_l > 0.20, `Mastery ${masteryRow.p_l} should increase above prior`);
});

test('Integration: GET /api/leaderboard accurately ranks participants', async () => {
  const res = await fetch(`http://localhost:${PORT}/api/leaderboard`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data.leaderboard));
  assert.ok(data.leaderboard.length > 0);
  assert.ok(data.leaderboard[0].rank === 1);
});

test('Integration: AI Generation and Validation Pipeline', async () => {
  const genRes = await fetch(`http://localhost:${PORT}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category: 'impersonation', difficulty: 'intermediate' }),
  });
  assert.equal(genRes.status, 200);
  const genData = await genRes.json();
  assert.ok(genData.scenario.id);
  assert.equal(genData.validation.valid, true);

  // Validate custom candidate
  const valRes = await fetch(`http://localhost:${PORT}/api/ai/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario: genData.scenario }),
  });
  assert.equal(valRes.status, 200);
  const valData = await valRes.json();
  assert.equal(valData.valid, true);
});

test('Integration: GET /api/proxy proxies external websites and rewrites HTML for embedding', async () => {
  const res = await fetch(`http://localhost:${PORT}/api/proxy?url=https://example.com`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('x-frame-options'), null, 'X-Frame-Options must be stripped');
  assert.ok(res.headers.get('content-type').includes('text/html'));
  const html = await res.text();
  assert.ok(html.includes('<base href="https://example.com'), 'Base href tag must be injected');
  assert.ok(html.includes('CYBERDESK_NAV'), 'Navigation interceptor script must be injected');
});

test('Integration Suite Teardown: Close server', () => {
  if (serverInstance) {
    serverInstance.close();
  }
});
