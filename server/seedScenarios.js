import { db } from './db.js';

export const SEED_SCENARIOS = [
  {
    id: 'm-okafor',
    title: 'CS240 Lab 3: Office hours moved to Thursday',
    category: 'other',
    difficulty: 'beginner',
    objective: 'Recognize authentic academic correspondence from verified instructors.',
    narrative: 'Routine mail from a known sender that points directly to the official portal is safe. Checking takes seconds and builds the habit.',
    skills: ['sender_verification', 'url_analysis', 'context_reasoning'],
    email: {
      id: 'm-okafor', arrives: 0, date: 'Mon 08:42', contact: 'maya-okafor', fromName: 'Dr. Maya Okafor', addr: 'maya.okafor@eastbrook.example',
      subject: 'CS240 Lab 3: office hours moved to Thursday', layout: 'plain', sig: 'sig-eastbrook-prof', attachments: [],
      links: { tt: { text: 'portal.eastbrook.example/timetable', href: 'https://portal.eastbrook.example/timetable' } },
      greeting: 'Hi everyone,',
      body: [
        { p: ['Quick note before the weekend: my usual Tuesday office hours are moving to Thursday 2-4 pm this week because of the faculty meeting.'] },
        { p: ['The updated room booking is on the portal timetable as always: ', { link: 'tt' }, '. Bring your Lab 3 questions - no need to reply to confirm.'] },
      ],
      truth: { phish: false },
      legit: ['Sender domain is exactly eastbrook.example', 'The link text and real destination match', 'No request for passwords, money or files'],
      lesson: 'Routine mail from a known sender that points to the real portal is safe. Checking takes seconds and builds the habit.',
    },
    truth: {
      phish: false,
      legit: ['Sender domain is exactly eastbrook.example', 'The link text and real destination match', 'No request for passwords, money or files'],
      lesson: 'Routine mail from a known sender that points to the real portal is safe. Checking takes seconds and builds the habit.',
    },
    verification: {
      directory: { name: 'Dr. Maya Okafor', title: 'Associate Professor, Computer Science', email: 'maya.okafor@eastbrook.example', office: 'Turing Hall 304', phone: 'ext. 4481', verified: true },
      domain: { hostname: 'eastbrook.example', registered: true, status: 'official' }
    }
  },
  {
    id: 'm-registrar',
    title: 'URGENT: Student Account Access Will Be Suspended',
    category: 'credential',
    difficulty: 'beginner',
    objective: 'Detect lookalike domains and credential-theft urgency triggers.',
    narrative: 'The real registrar uses eastbrook.example. The sender used eastbrook-registrar.example and the button hides a different site (eastbrook.secure-login.example) where the real domain is secure-login.example. Urgency plus a login request is the classic credential-theft pattern.',
    skills: ['url_analysis', 'sender_verification', 'impersonation_detection', 'social_engineering'],
    email: {
      id: 'm-registrar', arrives: 0, date: 'Mon 09:12', contact: 'dana-whitfield', fromName: 'Eastbrook Registrar', addr: 'registrar@eastbrook-registrar.example',
      subject: 'URGENT: Student account will be suspended', layout: 'banner', sig: 'sig-eastbrook-reg', attachments: [],
      banner: { brand: 'EASTBROOK UNIVERSITY', color: '#7a1a2a', title: 'Account Verification Notice' },
      links: { v: { text: 'https://portal.eastbrook.example/verify', href: 'https://eastbrook.secure-login.example/auth?next=portal' } },
      greeting: 'Dear student,',
      body: [
        { p: ['Our records show your account has not been verified for this term. ', { clue: 'urgency', text: 'Your access will be suspended within 24 hours' }, ' unless you confirm your details.'] },
        { p: [{ clue: 'credential-request', text: 'Please sign in with your student ID and password' }, ' using the secure link below to keep your account active.'] },
      ],
      button: { label: 'Verify account now', link: 'v' },
      truth: { phish: true, category: 'credential', alt: ['spoof', 'impersonation'], evidence: ['sender-domain', 'lookalike-domain', 'link-mismatch', 'urgency', 'credential-request', 'generic-greeting'] },
      lesson: 'The real registrar uses eastbrook.example. The sender used eastbrook-registrar.example and the button hides a different site (eastbrook.secure-login.example) where the real domain is secure-login.example. Urgency plus a login request is the classic credential-theft pattern.',
    },
    truth: {
      phish: true,
      category: 'credential',
      alt: ['spoof', 'impersonation'],
      evidence: ['sender-domain', 'lookalike-domain', 'link-mismatch', 'urgency', 'credential-request', 'generic-greeting'],
      lesson: 'The real registrar uses eastbrook.example. The sender used eastbrook-registrar.example and the button hides a different site (eastbrook.secure-login.example) where the real domain is secure-login.example. Urgency plus a login request is the classic credential-theft pattern.',
    },
    verification: {
      directory: { name: 'Registrar Office', title: 'Student Records & Enrolment', email: 'registrar@eastbrook.example', office: 'Founders Hall 101', phone: 'ext. 2100', verified: true },
      domain: { hostname: 'eastbrook-registrar.example', registered: true, status: 'suspicious_lookalike' }
    }
  },
  {
    id: 'm-nimbus-share',
    title: 'Lab Partner Shared "Lab 3 draft.docx"',
    category: 'other',
    difficulty: 'beginner',
    objective: 'Confirm expected document shares matching legitimate sender context.',
    narrative: 'A share you were expecting, from the real service domain, going to the real service domain. Context matters as much as the link.',
    skills: ['context_reasoning', 'url_analysis', 'sender_verification'],
    email: {
      id: 'm-nimbus-share', arrives: 0, date: 'Mon 09:30', contact: 'nimbusdrive', fromName: 'NimbusDrive', addr: 'no-reply@nimbusdrive.example',
      subject: 'Priya Nair shared "Lab 3 draft.docx" with you', layout: 'receipt', sig: 'sig-cloud', attachments: [],
      banner: { brand: 'NimbusDrive', color: '#1084d0', title: 'A file was shared with you' },
      links: { open: { text: 'Open in NimbusDrive', href: 'https://files.nimbusdrive.example/s/lab3-draft' } },
      greeting: 'Hi,',
      summary: [['Shared by', 'Priya Nair (priya.nair@eastbrook.example)'], ['File', 'Lab 3 draft.docx'], ['Permission', 'Can comment']],
      body: [{ p: ['Priya mentioned in the lab chat that she would share the draft this morning.'] }],
      button: { label: 'Open in NimbusDrive', link: 'open' },
      truth: { phish: false },
      legit: ['Expected: Priya said she would share the draft', 'Sender domain is nimbusdrive.example', 'Link opens files.nimbusdrive.example - the same real domain'],
      lesson: 'A share you were expecting, from the real service domain, going to the real service domain. Context matters as much as the link.',
    },
    truth: {
      phish: false,
      legit: ['Expected: Priya said she would share the draft', 'Sender domain is nimbusdrive.example', 'Link opens files.nimbusdrive.example - the same real domain'],
      lesson: 'A share you were expecting, from the real service domain, going to the real service domain. Context matters as much as the link.',
    },
    verification: {
      directory: { name: 'Priya Nair', title: 'Student, CS Senior', email: 'priya.nair@eastbrook.example', verified: true },
      domain: { hostname: 'files.nimbusdrive.example', registered: true, status: 'official' }
    }
  },
  {
    id: 'm-nimbus-alert',
    title: 'NimbusDrive Security: Blocked Sign-in From New Device',
    category: 'credential',
    difficulty: 'intermediate',
    objective: 'Spot subtle typo-squatting lookalikes (nimbusdrlve.example) and panic traps.',
    narrative: 'Look closely at the domain: nimbusdrlve.example swaps the "i" in nimbusdrive for an "l". Real providers do not threaten permanent loss to rush a password out of you.',
    skills: ['url_analysis', 'impersonation_detection', 'social_engineering'],
    email: {
      id: 'm-nimbus-alert', arrives: 0, date: 'Mon 11:02', contact: 'nimbusdrive', fromName: 'NimbusDrive Security', addr: 'security@nimbusdrlve.example',
      subject: 'Security alert: unusual sign-in to your account', layout: 'alert', sig: 'sig-cloud', attachments: [],
      alert: { text: 'We blocked a sign-in from a new device' },
      links: { sec: { text: 'Review activity', href: 'https://nimbusdrlve.example/login?r=alert' } },
      greeting: 'Dear user,',
      body: [
        { p: ['Someone tried to sign in from an unrecognised device. ', { clue: 'urgency', text: 'Act now or your files will be permanently locked.' }] },
        { p: [{ clue: 'credential-request', text: 'Confirm your password' }, ' to secure the account.'] },
      ],
      button: { label: 'Review activity', link: 'sec' },
      truth: { phish: true, category: 'credential', alt: ['spoof', 'impersonation'], evidence: ['sender-domain', 'lookalike-domain', 'urgency', 'credential-request', 'generic-greeting'] },
      lesson: 'Look closely at the domain: nimbusdrlve.example swaps the "i" in nimbusdrive for an "l". Real providers do not threaten permanent loss to rush a password out of you.',
    },
    truth: {
      phish: true,
      category: 'credential',
      alt: ['spoof', 'impersonation'],
      evidence: ['sender-domain', 'lookalike-domain', 'urgency', 'credential-request', 'generic-greeting'],
      lesson: 'Look closely at the domain: nimbusdrlve.example swaps the "i" in nimbusdrive for an "l". Real providers do not threaten permanent loss to rush a password out of you.',
    },
    verification: {
      domain: { hostname: 'nimbusdrlve.example', registered: true, status: 'suspicious_lookalike', ageDays: 2 }
    }
  },
  {
    id: 'm-invoice',
    title: 'Overdue Invoice 8812 - Double Extension Executable',
    category: 'attachment',
    difficulty: 'intermediate',
    objective: 'Inspect attachment metadata to detect executable payloads disguised inside archives.',
    narrative: 'You never ordered anything from this sender. Archives that hide programs (.pdf.exe) are a common malware route - never open them; report instead.',
    skills: ['attachment_safety', 'sender_verification', 'context_reasoning'],
    email: {
      id: 'm-invoice', arrives: 0, date: 'Mon 11:48', contact: 'chris-novak', fromName: 'Chris Novak', addr: 'chris.novak@bizsupply-mail.example',
      subject: 'Overdue invoice 8812 - see attached', layout: 'plain', sig: null, attachments: [
        { id: 'a1', name: 'Invoice_8812.zip', type: 'zip', size: '212 KB', real: { name: 'Invoice_8812.pdf.exe', type: 'exe', note: 'Inside the archive: a program disguised with a double extension (.pdf.exe).' } },
      ],
      links: {},
      greeting: 'Hello,',
      body: [
        { p: ['Please find attached the invoice for last month. ', { clue: 'urgency', text: 'Payment is already overdue and late fees apply.' }] },
        { p: [{ clue: 'unusual-request', text: 'Open the attachment and enable content' }, ' to view the payment details.'] },
      ],
      truth: { phish: true, category: 'attachment', alt: ['payment'], evidence: ['unexpected-attachment', 'urgency', 'generic-greeting', 'unusual-request'] },
      lesson: 'You never ordered anything from this sender. Archives that hide programs (.pdf.exe) are a common malware route - never open them; report instead.',
    },
    truth: {
      phish: true,
      category: 'attachment',
      alt: ['payment'],
      evidence: ['unexpected-attachment', 'urgency', 'generic-greeting', 'unusual-request'],
      lesson: 'You never ordered anything from this sender. Archives that hide programs (.pdf.exe) are a common malware route - never open them; report instead.',
    },
    verification: {
      directory: null,
      domain: { hostname: 'bizsupply-mail.example', registered: true, status: 'unknown_external' }
    }
  },
  {
    id: 'm-careers',
    title: 'Paid Remote Internship - Upfront ID & Banking Request',
    category: 'social',
    difficulty: 'intermediate',
    objective: 'Detect employment scams offering unrealistic compensation in exchange for sensitive credentials.',
    narrative: 'Real career services use eastbrook.example. An offer with no interview that wants ID and bank details first is a recruitment scam built on trust.',
    skills: ['social_engineering', 'sender_verification', 'url_analysis'],
    email: {
      id: 'm-careers', arrives: 0, date: 'Mon 12:20', contact: 'rosa-martinez', fromName: 'Rosa Martinez (Careers)', addr: 'rosa.martinez@eastbrook-careers.example',
      subject: 'Paid remote internship - reply with ID and bank details today', layout: 'banner', sig: null, attachments: [],
      banner: { brand: 'EASTBROOK CAREERS', color: '#2a4a6a', title: 'Exclusive opportunity' },
      links: { apply: { text: 'careers.eastbrook.example/apply', href: 'https://eastbrook-careers.example/apply' } },
      greeting: 'Hi there,',
      body: [
        { p: ['You have been pre-selected for a ', { clue: 'too-good', text: 'paid remote internship at $48 per hour, no interview needed.' }] },
        { p: [{ clue: 'urgency', text: 'The offer expires today.' }, ' ', { clue: 'payment-request', text: 'Send a photo of your ID and your bank details' }, ' through the application link to receive your first payment.'] },
      ],
      button: { label: 'Start application', link: 'apply' },
      truth: { phish: true, category: 'social', alt: ['impersonation', 'spoof'], evidence: ['sender-domain', 'lookalike-domain', 'link-mismatch', 'urgency', 'payment-request', 'too-good', 'generic-greeting'] },
      lesson: 'Real career services use eastbrook.example. An offer with no interview that wants ID and bank details first is a recruitment scam built on trust.',
    },
    truth: {
      phish: true,
      category: 'social',
      alt: ['impersonation', 'spoof'],
      evidence: ['sender-domain', 'lookalike-domain', 'link-mismatch', 'urgency', 'payment-request', 'too-good', 'generic-greeting'],
      lesson: 'Real career services use eastbrook.example. An offer with no interview that wants ID and bank details first is a recruitment scam built on trust.',
    },
    verification: {
      directory: { name: 'Rosa Martinez', title: 'Director, Career Placement', email: 'rosa.martinez@eastbrook.example', office: 'Student Union 204', phone: 'ext. 5120', verified: true },
      domain: { hostname: 'eastbrook-careers.example', status: 'suspicious_lookalike' }
    }
  },
  {
    id: 'm-sam',
    title: 'Compromised Peer: Shortened URL Link',
    category: 'link',
    difficulty: 'advanced',
    objective: 'Inspect shortened links and redirect chains from seemingly familiar contacts.',
    narrative: 'This may be your friend\'s hijacked account. The link is a shortener that bounces through a tracker before landing on a sign-in page. When a friend sounds unlike themselves, check with them another way.',
    skills: ['url_analysis', 'evidence_verification', 'social_engineering'],
    email: {
      id: 'm-sam', arrives: 0, date: 'Mon 13:41', contact: 'sam-rivera', fromName: 'Sam Rivera', addr: 'sam.rivera@eastbrook.example',
      subject: 'omg is this you?? 😂', layout: 'thread', sig: 'sig-student', attachments: [],
      links: { pic: { text: 'photo from last night', href: 'https://bit.example/x7Qa2' } },
      greeting: 'hey!!',
      body: [
        { p: [{ clue: 'unusual-request', text: 'someone posted this of you and it is hilarious' }, ' - ', { link: 'pic' }, '. You have to sign in to see it'] },
        { p: ['send it to everyone in CS240 lol'] },
      ],
      quote: 'On Sun, you wrote: "Are we still on for the study group?"',
      truth: { phish: true, category: 'link', alt: ['impersonation', 'credential'], evidence: ['shortened-link', 'link-mismatch', 'unusual-request', 'credential-request'] },
      lesson: 'This may be your friend\'s hijacked account. The link is a shortener that bounces through a tracker before landing on a sign-in page. When a friend sounds unlike themselves, check with them another way.',
    },
    truth: {
      phish: true,
      category: 'link',
      alt: ['impersonation', 'credential'],
      evidence: ['shortened-link', 'link-mismatch', 'unusual-request', 'credential-request'],
      lesson: 'This may be your friend\'s hijacked account. The link is a shortener that bounces through a tracker before landing on a sign-in page. When a friend sounds unlike themselves, check with them another way.',
    },
    verification: {
      directory: { name: 'Sam Rivera', title: 'Student, CS Sophomore', email: 'sam.rivera@eastbrook.example', verified: true, note: 'Out of band check: Sam reported their account was sending spam.' }
    }
  },
  {
    id: 'm-bec-ceo',
    title: 'Executive Wire Transfer Request (Business Email Compromise)',
    category: 'impersonation',
    difficulty: 'advanced',
    objective: 'Identify executive impersonation bypassing normal accounting approval workflows.',
    narrative: 'Attackers create fake executive personas to rush finance teams into unauthorized wire payments. Legitimate high-value disbursements always require dual authorization.',
    skills: ['impersonation_detection', 'social_engineering', 'context_reasoning', 'evidence_verification'],
    email: {
      id: 'm-bec-ceo', arrives: 0, date: 'Mon 14:15', contact: 'dean-vance', fromName: 'Dean Vance (Executive Office)', addr: 'vance.dean@eastbrook-exec.example',
      subject: 'URGENT & CONFIDENTIAL: Hardware vendor contract settlement', layout: 'plain', sig: null, attachments: [],
      links: {},
      greeting: 'Confidential,',
      body: [
        { p: ['I am currently in an off-site donor trustee meeting and cannot take calls. ', { clue: 'urgency', text: 'We have an immediate settlement deadline of $4,800' }, ' for the new robotics cluster servers.'] },
        { p: [{ clue: 'payment-request', text: 'Please process the attached wire instruction directly' }, ' to avoid delaying the laboratory delivery. ', { clue: 'unusual-request', text: 'Bypass standard procurement approval for this emergency transaction' }, ' and I will sign off when I return tomorrow.'] },
      ],
      truth: { phish: true, category: 'impersonation', alt: ['payment', 'social'], evidence: ['sender-domain', 'lookalike-domain', 'urgency', 'payment-request', 'unusual-request'] },
      lesson: 'Executive impersonation attempts to leverage authority and artificial isolation ("in a meeting, do not call") to bypass financial safeguards. Always confirm wire transfers through verified, out-of-band channels.',
    },
    truth: {
      phish: true,
      category: 'impersonation',
      alt: ['payment', 'social'],
      evidence: ['sender-domain', 'lookalike-domain', 'urgency', 'payment-request', 'unusual-request'],
      lesson: 'Executive impersonation attempts to leverage authority and artificial isolation ("in a meeting, do not call") to bypass financial safeguards. Always confirm wire transfers through verified, out-of-band channels.',
    },
    verification: {
      directory: { name: 'Dean Marcus Vance', title: 'Dean of Engineering', email: 'm.vance@eastbrook.example', phone: 'ext. 1002', verified: true },
      domain: { hostname: 'eastbrook-exec.example', status: 'suspicious_lookalike' }
    }
  },
  {
    id: 'm-qr-phish',
    title: 'MFA Migration Notice with QR Code Authentication',
    category: 'credential',
    difficulty: 'advanced',
    objective: 'Identify quishing (QR code phishing) intended to bypass desktop link filters.',
    narrative: 'QR code phishing moves the user from protected desktop browsers to mobile devices where inspection tools are scarce. Authentic MFA setup is always managed directly within the identity management portal.',
    skills: ['impersonation_detection', 'url_analysis', 'credential_theft'],
    email: {
      id: 'm-qr-phish', arrives: 0, date: 'Mon 15:05', contact: 'helpdesk', fromName: 'Eastbrook Identity Security', addr: 'auth-update@eastbrook-mfa.example',
      subject: 'Action Required: Scan QR code to update your authenticator app', layout: 'notice', sig: 'sig-it', attachments: [],
      banner: { brand: 'EASTBROOK AUTHENTICATION', color: '#1a4a2a', title: 'MFA Enrollment' },
      links: { qr: { text: 'https://eastbrook-mfa.example/qr-enroll', href: 'https://eastbrook.secure-mfa-verify.example/qr' } },
      greeting: 'Employee / Student,',
      body: [
        { p: ['Eastbrook is upgrading to mandatory hardware-backed Multi-Factor Authentication. ', { clue: 'urgency', text: 'You must scan the QR code within 24 hours to prevent account lockout.' }] },
        { p: [{ clue: 'credential-request', text: 'Scan with your mobile camera or click the enrollment portal to confirm your password' }, ': ', { link: 'qr' }] },
      ],
      truth: { phish: true, category: 'credential', alt: ['impersonation', 'link'], evidence: ['sender-domain', 'lookalike-domain', 'link-mismatch', 'urgency', 'credential-request'] },
      lesson: 'QR code phishing (quishing) tries to evade email URL scanners by embedding malicious destinations in QR codes. Legitimate IT services never demand urgent QR scans to avoid account lockout.',
    },
    truth: {
      phish: true,
      category: 'credential',
      alt: ['impersonation', 'link'],
      evidence: ['sender-domain', 'lookalike-domain', 'link-mismatch', 'urgency', 'credential-request'],
      lesson: 'QR code phishing (quishing) tries to evade email URL scanners by embedding malicious destinations in QR codes. Legitimate IT services never demand urgent QR scans to avoid account lockout.',
    },
    verification: {
      directory: { name: 'Identity & Access Management Desk', email: 'iam@eastbrook.example', phone: 'ext. 2200', verified: true },
      domain: { hostname: 'eastbrook-mfa.example', status: 'suspicious_lookalike' }
    }
  }
];

export function seedScenarios() {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO scenarios (
      id, title, category, difficulty, objective, narrative,
      email_json, truth_json, verification_json, skills_json,
      is_ai_generated, validation_status, version, created_at
    ) VALUES (
      @id, @title, @category, @difficulty, @objective, @narrative,
      @email_json, @truth_json, @verification_json, @skills_json,
      0, 'approved', 1, @created_at
    )
  `);

  const tx = db.transaction(() => {
    const now = Date.now();
    for (const sc of SEED_SCENARIOS) {
      insert.run({
        id: sc.id,
        title: sc.title,
        category: sc.category,
        difficulty: sc.difficulty,
        objective: sc.objective,
        narrative: sc.narrative,
        email_json: JSON.stringify(sc.email),
        truth_json: JSON.stringify(sc.truth),
        verification_json: JSON.stringify(sc.verification || {}),
        skills_json: JSON.stringify(sc.skills),
        created_at: now,
      });
    }

    // Seed Daily Challenge
    const today = new Date().toISOString().split('T')[0];
    db.prepare(`
      INSERT OR REPLACE INTO daily_challenges (id, scenario_id, bonus_xp, title, description)
      VALUES (?, ?, ?, ?, ?)
    `).run(today, 'm-registrar', 75, 'Daily Triage Challenge', "Inspect today's suspicious incident report and verify the sender before taking action.");
  });

  tx();
}
