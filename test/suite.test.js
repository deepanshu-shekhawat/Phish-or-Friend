import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBktUpdate, calculateNextReview, DEFAULT_BKT_PARAMS } from '../server/bkt.js';
import { evaluateAttempt } from '../server/scoring.js';
import { validateScenario, generateDeterministicScenario } from '../server/aiService.js';
import { parseUrl, analyse } from '../src/cyberdesk/engine/urlTools.js';

// ---------------------------------------------------- Unit Tests: URL Parsing & Analysis
test('URL Tools: parses legitimate domain correctly', () => {
  const p = parseUrl('https://portal.eastbrook.example/timetable');
  assert.equal(p.ok, true);
  assert.equal(p.hostname, 'portal.eastbrook.example');
  assert.equal(p.registrable, 'eastbrook.example');
  assert.equal(p.subdomain, 'portal');
  assert.equal(p.protocol, 'https');
});

test('URL Tools: detects deceptive lookalike subdomain', () => {
  const p = parseUrl('https://eastbrook.secure-login.example/auth');
  assert.equal(p.ok, true);
  assert.equal(p.registrable, 'secure-login.example');
  assert.equal(p.subdomain, 'eastbrook');
  // Confirm the registrable domain is NOT eastbrook.example!
  assert.notEqual(p.registrable, 'eastbrook.example');
});

test('URL Tools: analyses redirect chain and authored threat', () => {
  const r = analyse('https://nimbusdrlve.example/login?r=alert', 'Review activity');
  assert.equal(r.reputation, 'suspicious');
  assert.ok(r.findings.length > 0);
  assert.ok(r.evidence.includes('lookalike-domain') || r.evidence.includes('sender-domain'));
});

// ---------------------------------------------------- Unit Tests: BKT Mastery Engine
test('BKT Engine: increases mastery on correct observation', () => {
  const initialPL = 0.25;
  const newPL = calculateBktUpdate(initialPL, true, DEFAULT_BKT_PARAMS);
  assert.ok(newPL > initialPL, `Expected new mastery ${newPL} > initial ${initialPL}`);
  assert.ok(newPL >= 0.35, `Expected substantial increase, got ${newPL}`);
});

test('BKT Engine: decreases mastery on incorrect observation', () => {
  const initialPL = 0.60;
  const newPL = calculateBktUpdate(initialPL, false, DEFAULT_BKT_PARAMS);
  assert.ok(newPL < initialPL, `Expected new mastery ${newPL} < initial ${initialPL}`);
});

test('BKT Engine: boundaries stay within [0.01, 0.99]', () => {
  let pl = 0.01;
  for (let i = 0; i < 20; i++) {
    pl = calculateBktUpdate(pl, false);
  }
  assert.ok(pl >= 0.01 && pl <= 0.99, `Mastery ${pl} out of bounds`);

  pl = 0.95;
  for (let i = 0; i < 20; i++) {
    pl = calculateBktUpdate(pl, true);
  }
  assert.ok(pl >= 0.01 && pl <= 0.99, `Mastery ${pl} out of bounds`);
});

test('BKT Spaced Repetition: calculates appropriate review intervals', () => {
  const now = Date.now();
  const lowMasteryReview = calculateNextReview(0.30, 0);
  const highMasteryReview = calculateNextReview(0.90, 5);

  assert.ok(lowMasteryReview - now <= 30 * 60 * 1000, 'Low mastery should review within 30 minutes');
  assert.ok(highMasteryReview - now >= 24 * 60 * 60 * 1000, 'High mastery should schedule days out');
});

// ---------------------------------------------------- Unit Tests: Deterministic Scoring Rubric
test('Scoring Engine: awards full credit for correct phish report with evidence', () => {
  const mockScenario = {
    truth_json: JSON.stringify({
      phish: true,
      category: 'credential',
      alt: ['spoof'],
      evidence: ['sender-domain', 'lookalike-domain', 'urgency', 'credential-request'],
      lesson: 'Never provide credentials to lookalike domains.',
    }),
    narrative: 'Test lesson',
  };

  const evalResult = evaluateAttempt({
    scenario: mockScenario,
    decision: 'reported',
    report: {
      category: 'credential',
      evidence: ['sender-domain', 'lookalike-domain'],
      notes: 'Investigated sender header.',
    },
    investigation: [
      { event_type: 'inspect_url' },
      { event_type: 'save_evidence' },
    ],
    verified: true,
  });

  assert.equal(evalResult.isCorrect, true);
  assert.equal(evalResult.outcome, 'accepted');
  assert.ok(evalResult.totalXp >= 90, `Expected high XP, got ${evalResult.totalXp}`);
  assert.equal(evalResult.evidenceAnalysis.good.length, 2);
  assert.equal(evalResult.evidenceAnalysis.bad.length, 0);
});

test('Scoring Engine: penalizes false alarms when legitimate email is reported as phish', () => {
  const mockScenario = {
    truth_json: JSON.stringify({
      phish: false,
      legit: ['Sender domain matches official portal', 'No credentials requested'],
      lesson: 'Routine mail from verified instructors is safe.',
    }),
    narrative: 'Legitimate lesson',
  };

  const evalResult = evaluateAttempt({
    scenario: mockScenario,
    decision: 'reported',
    report: {
      category: 'credential',
      evidence: ['sender-domain'],
    },
    investigation: [],
  });

  assert.equal(evalResult.isCorrect, false);
  assert.equal(evalResult.outcome, 'rejected');
  assert.equal(evalResult.totalXp, 0);
});

test('Scoring Engine: correctly evaluates legitimate email marked safe', () => {
  const mockScenario = {
    truth_json: JSON.stringify({
      phish: false,
      legit: ['Real portal domain'],
      lesson: 'Legitimate notice',
    }),
    narrative: 'Legitimate notice',
  };

  const evalResult = evaluateAttempt({
    scenario: mockScenario,
    decision: 'safe',
    investigation: [],
  });

  assert.equal(evalResult.isCorrect, true);
  assert.equal(evalResult.outcome, 'verified_safe');
  assert.ok(evalResult.totalXp > 0);
});

// ---------------------------------------------------- Unit Tests: AI Scenario Generator & Validator
test('AI Validator: validates properly structured scenario', () => {
  const candidate = generateDeterministicScenario({
    category: 'credential',
    difficulty: 'intermediate',
  });

  const res = validateScenario(candidate);
  assert.equal(res.valid, true, `Validation errors: ${res.errors?.join(', ')}`);
});

test('AI Validator: rejects unsafe external domain not using .example', () => {
  const unsafeScenario = {
    title: 'Unsafe Test',
    category: 'credential',
    difficulty: 'intermediate',
    email: {
      fromName: 'Evil Hacker',
      addr: 'attacker@evil-real-domain.com', // NOT .example!
      subject: 'Give me your password',
      body: [{ p: ['Click here now'] }],
      links: {
        x: { href: 'https://evil-real-domain.com/steal' }
      }
    },
    truth: {
      phish: true,
      category: 'credential',
      evidence: ['sender-domain'],
    }
  };

  const res = validateScenario(unsafeScenario);
  assert.equal(res.valid, false);
  assert.ok(res.errors.some(e => e.includes('.example')));
});

test('AI Validator: rejects ground truth leak in email body', () => {
  const leakingScenario = {
    title: 'Leaking Test',
    category: 'credential',
    difficulty: 'beginner',
    email: {
      fromName: 'Test',
      addr: 'test@eastbrook.example',
      subject: 'Test Subject',
      body: [{ p: ['Notice: this is phishing, do not click!'] }],
    },
    truth: {
      phish: true,
      category: 'credential',
      evidence: ['sender-domain'],
    }
  };

  const res = validateScenario(leakingScenario);
  assert.equal(res.valid, false);
  assert.ok(res.errors.some(e => e.includes('unintended disclosure')));
});
