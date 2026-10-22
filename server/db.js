import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'cyberdesk.sqlite');

export const db = new Database(DB_PATH);

// Enable WAL mode for concurrent performance and data integrity
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      is_guest INTEGER DEFAULT 1,
      total_xp INTEGER DEFAULT 0,
      rank_id TEXT DEFAULT 'trainee',
      created_at INTEGER NOT NULL,
      last_active INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_settings (
      user_id TEXT PRIMARY KEY,
      settings_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      default_p_l REAL DEFAULT 0.20,
      p_transit REAL DEFAULT 0.15,
      p_guess REAL DEFAULT 0.15,
      p_slip REAL DEFAULT 0.10
    );

    CREATE TABLE IF NOT EXISTS scenarios (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      difficulty TEXT NOT NULL, -- 'beginner' | 'intermediate' | 'advanced'
      objective TEXT NOT NULL,
      narrative TEXT NOT NULL,
      email_json TEXT NOT NULL,
      truth_json TEXT NOT NULL,
      verification_json TEXT,
      skills_json TEXT NOT NULL, -- array of skill IDs
      is_ai_generated INTEGER DEFAULT 0,
      validation_status TEXT DEFAULT 'approved', -- 'approved' | 'pending' | 'quarantined'
      version INTEGER DEFAULT 1,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      scenario_id TEXT NOT NULL,
      started_at INTEGER NOT NULL,
      completed_at INTEGER,
      decision TEXT, -- 'reported' | 'safe' | 'deleted'
      is_correct INTEGER,
      xp_awarded INTEGER DEFAULT 0,
      evaluation_json TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS investigation_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attempt_id TEXT NOT NULL,
      event_type TEXT NOT NULL, -- 'view_email' | 'click_link' | 'inspect_url' | 'inspect_attachment' | 'verify_contact' | 'save_evidence'
      details_json TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS skill_mastery (
      user_id TEXT NOT NULL,
      skill_id TEXT NOT NULL,
      p_l REAL NOT NULL, -- Probability of mastery [0, 1]
      attempts_count INTEGER DEFAULT 0,
      correct_count INTEGER DEFAULT 0,
      last_practiced INTEGER,
      next_review_at INTEGER,
      PRIMARY KEY (user_id, skill_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_achievements (
      user_id TEXT NOT NULL,
      achievement_id TEXT NOT NULL,
      unlocked_at INTEGER NOT NULL,
      PRIMARY KEY (user_id, achievement_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS daily_challenges (
      id TEXT PRIMARY KEY, -- 'YYYY-MM-DD'
      scenario_id TEXT NOT NULL,
      bonus_xp INTEGER DEFAULT 50,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_daily_completions (
      user_id TEXT NOT NULL,
      challenge_id TEXT NOT NULL,
      completed_at INTEGER NOT NULL,
      xp_earned INTEGER NOT NULL,
      PRIMARY KEY (user_id, challenge_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (challenge_id) REFERENCES daily_challenges(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ai_generation_jobs (
      id TEXT PRIMARY KEY,
      prompt TEXT NOT NULL,
      raw_output TEXT,
      scenario_id TEXT,
      validation_json TEXT,
      status TEXT NOT NULL, -- 'pending' | 'approved' | 'rejected'
      created_at INTEGER NOT NULL
    );

    -- Indexes for high performance queries
    CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_scenario ON attempts(scenario_id);
    CREATE INDEX IF NOT EXISTS idx_investigation_attempt ON investigation_events(attempt_id);
    CREATE INDEX IF NOT EXISTS idx_mastery_user ON skill_mastery(user_id);
    CREATE INDEX IF NOT EXISTS idx_scenarios_diff ON scenarios(difficulty, validation_status);
  `);

  seedSkills();
}

const DEFAULT_SKILLS = [
  { id: 'url_analysis', name: 'URL & Domain Analysis', description: 'Deconstructing web addresses, detecting lookalike domains, punycode, and misleading subdomains.', icon: 'inspector' },
  { id: 'sender_verification', name: 'Sender Identity Verification', description: 'Checking message headers, display name vs envelope address discrepancies, and DKIM/SPF alignment.', icon: 'mail' },
  { id: 'impersonation_detection', name: 'Impersonation & Spoofing', description: 'Spotting brand or executive impersonation, urgent authority requests, and fake security notices.', icon: 'threat-spoof' },
  { id: 'social_engineering', name: 'Social Engineering & Urgency', description: 'Recognizing psychological triggers such as manufactured urgency, fear, greed, or curiosity traps.', icon: 'threat-social' },
  { id: 'context_reasoning', name: 'Contextual Plausibility', description: 'Evaluating whether the request makes sense given the relationship, timing, and standard business protocols.', icon: 'evidence-lookalike' },
  { id: 'attachment_safety', name: 'Attachment & File Safety', description: 'Identifying double extensions, risky filetypes (.exe, .zip, .js), macros, and payload containers.', icon: 'attach-exe' },
  { id: 'evidence_verification', name: 'Evidence & Independent Verification', description: 'Cross-checking requests out-of-band through official directories, intranet lookups, or terminal queries.', icon: 'status-verified' },
  { id: 'incident_reporting', name: 'Reporting & Incident Response', description: 'Submitting well-supported incident reports with precise threat categorization and evidence citations.', icon: 'security-threat-credential' },
];

function seedSkills() {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO skills (id, name, description, icon, default_p_l, p_transit, p_guess, p_slip)
    VALUES (@id, @name, @description, @icon, 0.20, 0.15, 0.15, 0.10)
  `);

  const tx = db.transaction(() => {
    for (const skill of DEFAULT_SKILLS) {
      insert.run(skill);
    }
  });
  tx();
}
