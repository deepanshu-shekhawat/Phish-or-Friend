/**
 * AI Scenario Generation & Deterministic Validation Pipeline
 * 
 * Requirements:
 * 1. Strictly separated from evaluation (LLM never judges answers).
 * 2. Automated schema validation and security safety filters.
 * 3. All generated domains must strictly use the RFC-reserved '.example' TLD.
 * 4. Deterministic fallback generators ensure 100% platform availability offline or when LLMs are unavailable.
 */

import crypto from 'crypto';

export const VALID_CATEGORIES = [
  'credential', 'impersonation', 'link', 'attachment', 'payment', 'social', 'spoof', 'other'
];

export const VALID_EVIDENCE = [
  'sender-domain', 'lookalike-domain', 'link-mismatch', 'shortened-link',
  'urgency', 'credential-request', 'payment-request', 'unexpected-attachment',
  'generic-greeting', 'unusual-request', 'too-good'
];

export const VALID_SKILLS = [
  'url_analysis', 'sender_verification', 'impersonation_detection', 'social_engineering',
  'context_reasoning', 'attachment_safety', 'evidence_verification', 'incident_reporting'
];

/**
 * Deterministically validates any scenario against strict cybersecurity education standards.
 */
export function validateScenario(scenario) {
  const errors = [];

  if (!scenario || typeof scenario !== 'object') {
    return { valid: false, errors: ['Scenario must be a valid JSON object'] };
  }

  // Basic fields
  if (!scenario.title || typeof scenario.title !== 'string') errors.push('Missing or invalid title');
  if (!['beginner', 'intermediate', 'advanced'].includes(scenario.difficulty)) {
    errors.push('Difficulty must be "beginner", "intermediate", or "advanced"');
  }
  if (!VALID_CATEGORIES.includes(scenario.category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  // Email payload structure
  const email = scenario.email;
  if (!email || typeof email !== 'object') {
    errors.push('Missing email object');
  } else {
    if (!email.fromName) errors.push('Email missing fromName');
    if (!email.addr || !email.addr.includes('@')) errors.push('Email missing or malformed sender address');
    if (!email.subject) errors.push('Email missing subject');
    if (!Array.isArray(email.body)) errors.push('Email body must be an array of paragraph blocks');

    // Strict safety check: only .example domains are permitted in simulation!
    if (email.addr && !email.addr.endsWith('.example')) {
      errors.push(`Sender domain "${email.addr}" must use reserved ".example" TLD for safety`);
    }

    // Inspect links in email
    if (email.links && typeof email.links === 'object') {
      for (const [key, link] of Object.entries(email.links)) {
        if (!link.href) errors.push(`Link ${key} missing href`);
        else {
          try {
            const parsed = new URL(link.href);
            if (!parsed.hostname.endsWith('.example')) {
              errors.push(`Link destination "${link.href}" must use ".example" TLD for safety`);
            }
          } catch {
            errors.push(`Invalid URL format in link: ${link.href}`);
          }
        }
      }
    }

    // Inspect attachments
    if (Array.isArray(email.attachments)) {
      for (const att of email.attachments) {
        if (!att.name || !att.type) errors.push('Attachment missing name or type');
        // Prevent real payload extensions in raw storage
        if (att.content && (att.content.includes('<script>') || att.content.includes('<?php'))) {
          errors.push('Unsafe attachment script content detected');
        }
      }
    }
  }

  // Truth & rubric structure
  const truth = scenario.truth;
  if (!truth || typeof truth !== 'object') {
    errors.push('Missing ground-truth object');
  } else {
    if (typeof truth.phish !== 'boolean') errors.push('truth.phish must be a boolean');
    if (truth.phish) {
      if (!VALID_CATEGORIES.includes(truth.category)) {
        errors.push(`truth.category must be one of: ${VALID_CATEGORIES.join(', ')}`);
      }
      if (!Array.isArray(truth.evidence) || truth.evidence.length === 0) {
        errors.push('Phishing scenario must specify at least one evidence clue in truth.evidence');
      } else {
        for (const ev of truth.evidence) {
          if (!VALID_EVIDENCE.includes(ev)) {
            errors.push(`Invalid evidence clue: ${ev}`);
          }
        }
      }
    } else {
      if (!Array.isArray(truth.legit) || truth.legit.length === 0) {
        errors.push('Legitimate scenario must specify safety indicators in truth.legit');
      }
    }
  }

  // Narrative and disclosure check (ensure scenario body does not leak the answer)
  const bodyText = JSON.stringify(email?.body || '').toLowerCase();
  if (bodyText.includes('this is phishing') || bodyText.includes('this is a phish') || bodyText.includes('malicious email')) {
    errors.push('Email body contains unintended disclosure of ground truth');
  }

  // Verification options
  if (scenario.verification && typeof scenario.verification !== 'object') {
    errors.push('Verification config must be an object');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Built-in deterministic generator capable of creating diverse, realistic cybersecurity scenarios.
 */
export function generateDeterministicScenario({
  category = 'credential',
  difficulty = 'intermediate',
  targetSkill = 'url_analysis',
  isPhish = true,
}) {
  const id = `gen-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`;

  if (!isPhish) {
    // Generate high quality legitimate scenario
    const templates = [
      {
        title: 'Library System: Interlibrary loan book ready for pickup',
        category: 'other',
        objective: 'Differentiate routine institutional notifications from credential harvesting.',
        skills: ['sender_verification', 'url_analysis', 'context_reasoning'],
        fromName: 'Eastbrook Library Services',
        addr: 'library@eastbrook.example',
        subject: 'Hold notice: Your book is ready at Central Library',
        greeting: 'Dear Student,',
        body: [
          { p: ['The book you requested via Interlibrary Loan (ISBN 978-0131103627) has arrived at the Main Campus Library desk.'] },
          { p: ['You have 7 days to pick it up. View your current loans directly on the student portal: ', { link: 'portal' }, '.'] },
        ],
        links: {
          portal: { text: 'portal.eastbrook.example/library', href: 'https://portal.eastbrook.example/library' }
        },
        legit: [
          'Sender domain matches official eastbrook.example exactly',
          'Link points directly to authenticated institutional portal',
          'No request for credentials, fees, or urgent action'
        ],
        lesson: 'Routine notices from known institutional domains pointing directly to legitimate portals are safe.',
      },
      {
        title: 'Faculty Research: Participation in campus survey',
        category: 'other',
        objective: 'Verify legitimate academic surveys without clicking external untrusted forms.',
        skills: ['sender_verification', 'context_reasoning', 'evidence_verification'],
        fromName: 'Dr. Aris Thorne (Psychology Dept)',
        addr: 'aris.thorne@eastbrook.example',
        subject: 'Volunteers needed: Cognitive workload study (30 mins)',
        greeting: 'Hello CS Students,',
        body: [
          { p: ['Our department is conducting research on digital multitasking and cognitive retention.'] },
          { p: ['Participation is optional. Sign-up sheets and ethical consent forms are posted outside Lab 402 or on the portal: ', { link: 'study' }, '.'] },
        ],
        links: {
          study: { text: 'portal.eastbrook.example/research/study402', href: 'https://portal.eastbrook.example/research/study402' }
        },
        legit: [
          'Known faculty member listed in campus directory',
          'Sender address matches university domain',
          'No external links, tracking redirects, or credential forms'
        ],
        lesson: 'Academic invitations with verifiable faculty credentials and on-campus locations are legitimate.',
      }
    ];

    const pick = templates[Math.floor(Math.random() * templates.length)];
    return {
      id,
      title: pick.title,
      category: pick.category,
      difficulty,
      objective: pick.objective,
      narrative: pick.lesson,
      email: {
        id,
        arrives: 0,
        date: 'Today ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        contact: 'dept',
        fromName: pick.fromName,
        addr: pick.addr,
        subject: pick.subject,
        layout: 'plain',
        attachments: [],
        links: pick.links,
        greeting: pick.greeting,
        body: pick.body,
        truth: { phish: false },
        legit: pick.legit,
        lesson: pick.lesson,
      },
      truth: {
        phish: false,
        legit: pick.legit,
        lesson: pick.lesson,
      },
      verification: {
        directoryEntry: { name: pick.fromName, email: pick.addr, department: 'Academic Services', verified: true },
        domainInfo: { domain: 'eastbrook.example', status: 'verified_official', registeredYears: 12 },
      },
      skills: pick.skills,
      isAiGenerated: true,
      validationStatus: 'approved',
    };
  }

  // Generate phishing scenario
  const phishTemplates = [
    {
      title: 'Dean of Students: Mandatory Academic Integrity Acknowledgement',
      category: 'credential',
      difficulty: 'intermediate',
      skills: ['url_analysis', 'sender_verification', 'impersonation_detection'],
      fromName: 'Office of the Dean',
      addr: 'dean-office@eastbrook-academic.example', // lookalike
      subject: 'MANDATORY: Term policy acknowledgement required by 5 PM',
      greeting: 'All Students and Faculty,',
      body: [
        { p: ['Pursuant to revised University Senate regulations, all enrolled students must review and digitally sign the Updated Code of Integrity. ', { clue: 'urgency', text: 'Failure to acknowledge by 5:00 PM today will result in temporary LMS suspension.' }] },
        { p: [{ clue: 'credential-request', text: 'Sign in with your University single sign-on credentials' }, ' to confirm:'] },
      ],
      links: {
        sso: { text: 'portal.eastbrook.example/sso/integrity', href: 'https://eastbrook-academic.secure-portal.example/login' }
      },
      evidence: ['sender-domain', 'lookalike-domain', 'link-mismatch', 'urgency', 'credential-request'],
      lesson: 'The sender uses eastbrook-academic.example instead of eastbrook.example, and the SSO link sends users to a lookalike domain (secure-portal.example). Authority intimidation paired with a short deadline is a classic spear-phishing hallmark.',
    },
    {
      title: 'Student Financial Aid: Grant Disbursement Pending Verification',
      category: 'payment',
      difficulty: 'advanced',
      skills: ['url_analysis', 'payment_verification', 'social_engineering'],
      fromName: 'Eastbrook Grants Bursary',
      addr: 'disbursements@eastbrook-grants.example',
      subject: 'Action Required: $1,250 Emergency Educational Grant awaiting deposit',
      greeting: 'Dear Grant Recipient,',
      body: [
        { p: ['You have been selected for an automatic $1,250 educational assistance stipend funded by the 2026 Academic Relief Fund. ', { clue: 'too-good', text: 'No application or repayment is required.' }] },
        { p: [{ clue: 'payment-request', text: 'Submit your debit routing information and student credentials' }, ' within 48 hours to secure the transfer:'] },
      ],
      links: {
        claim: { text: 'bursar.eastbrook.example/claim-grant', href: 'https://eastbrook-grants.example/wire-transfer' }
      },
      evidence: ['sender-domain', 'lookalike-domain', 'link-mismatch', 'payment-request', 'too-good', 'generic-greeting'],
      lesson: 'Unexpected money offers requesting bank details or login info are financial redirection scams. Real university bursary grants are handled through established student accounts, not external routing portals.',
    },
    {
      title: 'IT Help Desk: Urgent SSL Certificate Revocation Notice',
      category: 'attachment',
      difficulty: 'intermediate',
      skills: ['attachment_safety', 'sender_verification', 'impersonation_detection'],
      fromName: 'Global Network Operations',
      addr: 'noc@campus-itsupport.example',
      subject: 'Critical security update: Install Root CA certificate patch',
      greeting: 'Network User,',
      body: [
        { p: ['The campus enterprise Wi-Fi certificate has expired. To maintain uninterrupted connection to eduroam and lab servers, ', { clue: 'urgency', text: 'you must immediately apply the attached system configuration.' }] },
        { p: [{ clue: 'unexpected-attachment', text: 'Double-click the attached archive and run the certificate installer.' }] },
      ],
      attachments: [
        { id: `att-${id}`, name: 'Campus_Root_Cert.zip', type: 'zip', size: '185 KB', real: { name: 'Campus_Root_Cert.crt.exe', type: 'exe', note: 'Malicious executable disguised with double extension .crt.exe' } }
      ],
      links: {},
      evidence: ['sender-domain', 'unexpected-attachment', 'urgency', 'generic-greeting', 'unusual-request'],
      lesson: 'Legitimate IT departments never email executable installers or zip archives containing programs disguised as certificates. Always verify IT announcements through the verified campus intranet.',
    }
  ];

  const pick = phishTemplates[Math.floor(Math.random() * phishTemplates.length)];

  return {
    id,
    title: pick.title,
    category: pick.category,
    difficulty: pick.difficulty,
    objective: 'Investigate sender domain, link destinations, and attachments before taking action.',
    narrative: pick.lesson,
    email: {
      id,
      arrives: 0,
      date: 'Today ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      contact: 'unknown',
      fromName: pick.fromName,
      addr: pick.addr,
      subject: pick.subject,
      layout: 'alert',
      attachments: pick.attachments || [],
      links: pick.links || {},
      greeting: pick.greeting,
      body: pick.body,
      button: pick.links && Object.keys(pick.links).length > 0 ? { label: 'Review Notice', link: Object.keys(pick.links)[0] } : null,
      truth: {
        phish: true,
        category: pick.category,
        evidence: pick.evidence,
      },
      lesson: pick.lesson,
    },
    truth: {
      phish: true,
      category: pick.category,
      evidence: pick.evidence,
      lesson: pick.lesson,
    },
    verification: {
      directoryEntry: null,
      domainInfo: { domain: pick.addr.split('@')[1], status: 'suspicious_unregistered', ageDays: 2 },
    },
    skills: pick.skills,
    isAiGenerated: true,
    validationStatus: 'approved',
  };
}
