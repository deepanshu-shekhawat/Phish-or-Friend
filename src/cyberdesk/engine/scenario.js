// Simulated scenario data. Every domain uses the reserved ".example" TLD, every brand is fictional,
// nothing here performs a network request. Link analysis is *authored*, never a live scan.

export const EVIDENCE = [
  { id: 'sender-domain', label: "Sender address doesn't match the organisation", where: 'Mail → sender "Details"' },
  { id: 'lookalike-domain', label: 'Look-alike or misspelled domain', where: 'Mail details / Link Inspector' },
  { id: 'link-mismatch', label: 'Link text differs from the real destination', where: 'Mail link menu / Link Inspector' },
  { id: 'shortened-link', label: 'Shortened or redirecting link', where: 'Link Inspector → Redirects' },
  { id: 'urgency', label: 'Urgent or threatening language', where: 'Message text (clue highlighter)' },
  { id: 'credential-request', label: 'Asks for password or login details', where: 'Message text (clue highlighter)' },
  { id: 'payment-request', label: 'Asks for payment or bank details', where: 'Message text (clue highlighter)' },
  { id: 'unexpected-attachment', label: 'Unexpected or risky attachment', where: 'Attachment properties' },
  { id: 'generic-greeting', label: 'Generic greeting / no personal detail', where: 'Message text (clue highlighter)' },
  { id: 'unusual-request', label: 'Unusual request for this sender or role', where: 'Message text (clue highlighter)' },
  { id: 'too-good', label: 'Too-good-to-be-true offer', where: 'Message text (clue highlighter)' },
];

export const CATEGORIES = [
  { id: 'credential', label: 'Credential theft' },
  { id: 'impersonation', label: 'Impersonation' },
  { id: 'link', label: 'Malicious link' },
  { id: 'attachment', label: 'Risky attachment' },
  { id: 'payment', label: 'Payment fraud' },
  { id: 'social', label: 'Social engineering' },
  { id: 'spoof', label: 'Spoofed domain' },
  { id: 'other', label: 'Other' },
];

export const ME = { name: 'You', addr: 'student@eastbrook.example' };

// ---------------------------------------------------------------- emails
// body blocks: string | { p: [segments] }.  segments: string | {link:id} | {clue:evidenceId, text}
export const EMAILS = [
  {
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
  {
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
  {
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
  {
    id: 'm-it', arrives: 0, date: 'Mon 10:05', contact: 'alex-kim', fromName: 'Alex Kim (IT Help Desk)', addr: 'helpdesk@eastbrook.example',
    subject: 'Reminder: password expires in 7 days', layout: 'notice', sig: 'sig-it', attachments: [],
    banner: { brand: 'EASTBROOK IT', color: '#006a3a', title: 'Password reminder' },
    links: { acct: { text: 'portal.eastbrook.example/account', href: 'https://portal.eastbrook.example/account' } },
    greeting: 'Hello,',
    body: [{ p: ['Your Eastbrook password will expire in 7 days. You can change it any time from your account page: ', { link: 'acct' }, '.'] }, { p: ['We will never ask you to send your password by email or reply with it.'] }],
    truth: { phish: false },
    legit: ['Real IT domain eastbrook.example', 'Mild deadline, but no threat and no login form in the email', 'Tells you to go to the known portal yourself'],
    lesson: 'A deadline alone is not a red flag. Legitimate IT mail sends you to the official portal and never asks for the password itself.',
  },
  {
    id: 'm-bank', arrives: 0, date: 'Mon 10:40', contact: 'northvale-bank', fromName: 'Northvale Bank', addr: 'statements@northvale.example',
    subject: 'Your October statement is ready', layout: 'receipt', sig: 'sig-bank', attachments: [],
    banner: { brand: 'NORTHVALE BANK', color: '#0a3a7a', title: 'Statement notification' },
    links: { st: { text: 'northvale.example/statements', href: 'https://northvale.example/statements' } },
    greeting: 'Hello,',
    summary: [['Statement period', '1-31 October'], ['Account ending', '4821'], ['Delivery', 'Online banking']],
    body: [{ p: ['Your statement is available in online banking. For your security this email does not contain account numbers or ask for any details.'] }],
    button: { label: 'View in online banking', link: 'st' },
    truth: { phish: false },
    legit: ['Sender domain northvale.example matches the real bank', 'Link goes to the same domain', 'Email explicitly asks for no details'],
    lesson: 'The safest habit for banks: use the address you already know. Here the link matches, so this one is fine either way.',
  },
  {
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
  {
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
  {
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
  {
    id: 'm-parcel', arrives: 25, date: 'Mon 13:05', contact: 'parcelpoint', fromName: 'ParcelPoint Delivery', addr: 'notifications@parcelpoint-delivery.example',
    subject: 'Parcel PP4821 on hold - redelivery fee $1.99', layout: 'receipt', sig: 'sig-courier', attachments: [],
    banner: { brand: 'ParcelPoint', color: '#c8700c', title: 'Delivery attempt failed' },
    links: { trk: { text: 'parcelpoint.example/track?id=PP4821', href: 'https://parcelpoint-delivery.example/pay?ref=PP4821' } },
    greeting: 'Dear customer,',
    summary: [['Parcel', 'PP4821'], ['Status', 'On hold - address check'], ['Fee due', '$1.99 within 12 hours']],
    body: [{ p: [{ clue: 'payment-request', text: 'Pay the small redelivery fee' }, ' by card to release your parcel. ', { clue: 'urgency', text: 'Unpaid parcels are returned in 12 hours.' }] }],
    button: { label: 'Track parcel', link: 'trk' },
    truth: { phish: true, category: 'payment', alt: ['spoof', 'link'], evidence: ['sender-domain', 'lookalike-domain', 'link-mismatch', 'urgency', 'payment-request', 'generic-greeting'] },
    lesson: 'Delivery-fee texts and emails are a top scam. The link text claims parcelpoint.example but the button goes to parcelpoint-delivery.example and asks for card details.',
  },
  {
    id: 'm-sam', arrives: 60, date: 'Mon 13:41', contact: 'sam-rivera', fromName: 'Sam Rivera', addr: 'sam.rivera@eastbrook.example',
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
];

export const emailById = (id) => EMAILS.find((e) => e.id === id);

// ---------------------------------------------------------------- link intelligence (authored)
// reputation: known | suspicious | unknown. expected = the domain the user would assume.
export const SITES = {
  'portal.eastbrook.example': { reputation: 'known', brand: 'Eastbrook University', page: 'portal', ageDays: 7300, cert: { subject: 'portal.eastbrook.example', org: 'Eastbrook University', issuer: 'Fictional Trust CA', valid: true, from: '2025-09-01', to: '2026-12-31', san: ['portal.eastbrook.example', 'eastbrook.example'] } },
  'eastbrook.secure-login.example': { reputation: 'suspicious', brand: 'Eastbrook University (look-alike)', page: 'login', login: 'uni', fake: true, expected: 'eastbrook.example', ageDays: 3, flags: ['mismatch', 'lookalike', 'new-domain'], cert: { subject: 'secure-login.example', org: '(not validated)', issuer: 'Budget Certs Ltd', valid: true, from: '2026-10-14', to: '2027-01-12', san: ['*.secure-login.example'], mismatch: true } },
  'files.nimbusdrive.example': { reputation: 'known', brand: 'NimbusDrive', page: 'cloud', ageDays: 3100, cert: { subject: 'files.nimbusdrive.example', org: 'NimbusDrive Cloud, Inc.', issuer: 'Fictional Trust CA', valid: true, from: '2026-03-01', to: '2027-03-01', san: ['*.nimbusdrive.example'] } },
  'nimbusdrlve.example': { reputation: 'suspicious', brand: 'NimbusDrive (look-alike)', page: 'login', login: 'cloud', fake: true, expected: 'nimbusdrive.example', ageDays: 2, interstitial: 'warning', flags: ['lookalike', 'new-domain'], cert: { subject: 'nimbusdrlve.example', org: '(not validated)', issuer: 'Budget Certs Ltd', valid: true, from: '2026-10-15', to: '2027-01-13', san: ['nimbusdrlve.example'], mismatch: true } },
  'northvale.example': { reputation: 'known', brand: 'Northvale Bank', page: 'bank', ageDays: 9500, cert: { subject: 'northvale.example', org: 'Northvale Bank plc', issuer: 'Fictional Trust CA', valid: true, from: '2026-01-10', to: '2027-01-10', san: ['northvale.example', 'www.northvale.example'] } },
  'northvale-bank.example': { reputation: 'suspicious', brand: 'Northvale Bank (look-alike)', page: 'login', login: 'bank', fake: true, expected: 'northvale.example', ageDays: 6, flags: ['lookalike', 'new-domain'], cert: { subject: 'northvale-bank.example', org: '(not validated)', issuer: 'Budget Certs Ltd', valid: true, from: '2026-10-11', to: '2027-01-09', san: ['northvale-bank.example'], mismatch: true } },
  'parcelpoint.example': { reputation: 'known', brand: 'ParcelPoint', page: 'tracking', ageDays: 4200, cert: { subject: 'parcelpoint.example', org: 'ParcelPoint Ltd', issuer: 'Fictional Trust CA', valid: true, from: '2026-02-01', to: '2027-02-01', san: ['parcelpoint.example'] } },
  'parcelpoint-delivery.example': { reputation: 'suspicious', brand: 'ParcelPoint (look-alike)', page: 'payment', fake: true, expected: 'parcelpoint.example', ageDays: 5, flags: ['mismatch', 'lookalike', 'new-domain'], cert: { subject: 'parcelpoint-delivery.example', org: '(not validated)', issuer: 'Budget Certs Ltd', valid: true, from: '2026-10-12', to: '2027-01-10', san: ['parcelpoint-delivery.example'], mismatch: true } },
  'help.eastbrook.example': { reputation: 'known', brand: 'Eastbrook IT', page: 'support', ageDays: 7300, cert: { subject: 'help.eastbrook.example', org: 'Eastbrook University', issuer: 'Fictional Trust CA', valid: true, from: '2025-09-01', to: '2026-12-31', san: ['help.eastbrook.example'] } },
  'careers.eastbrook.example': { reputation: 'known', brand: 'Eastbrook Careers', page: 'job', ageDays: 7000, cert: { subject: 'careers.eastbrook.example', org: 'Eastbrook University', issuer: 'Fictional Trust CA', valid: true, from: '2025-09-01', to: '2026-12-31', san: ['careers.eastbrook.example'] } },
  'eastbrook-careers.example': { reputation: 'suspicious', brand: 'Eastbrook Careers (look-alike)', page: 'job', fake: true, expected: 'eastbrook.example', ageDays: 4, flags: ['mismatch', 'lookalike', 'new-domain'], cert: { subject: 'eastbrook-careers.example', org: '(not validated)', issuer: 'Budget Certs Ltd', valid: true, from: '2026-10-13', to: '2027-01-11', san: ['eastbrook-careers.example'], mismatch: true } },
  'paysure.example': { reputation: 'known', brand: 'PaySure Payroll', page: 'login', login: 'payroll', ageDays: 5000, cert: { subject: 'paysure.example', org: 'PaySure Payroll Services', issuer: 'Fictional Trust CA', valid: true, from: '2026-04-01', to: '2027-04-01', san: ['paysure.example'] } },
  'paysure-hr.example': { reputation: 'suspicious', brand: 'PaySure (look-alike)', page: 'login', login: 'payroll', fake: true, expected: 'paysure.example', ageDays: 1, flags: ['lookalike', 'new-domain'], cert: { subject: 'paysure-hr.example', org: '(not validated)', issuer: 'Budget Certs Ltd', valid: true, from: '2026-10-16', to: '2027-01-14', san: ['paysure-hr.example'], mismatch: true } },
  'bizsupply-mail.example': { reputation: 'unknown', brand: 'Unknown sender domain', page: 'invoice', fake: true, expected: null, ageDays: 9, flags: ['unknown'], cert: { subject: 'bizsupply-mail.example', org: '(not validated)', issuer: 'Budget Certs Ltd', valid: true, from: '2026-10-08', to: '2027-01-06', san: ['bizsupply-mail.example'] } },
  'bit.example': { reputation: 'unknown', brand: 'URL shortener', page: 'redirect', ageDays: 2500, redirects: ['https://bit.example/x7Qa2', 'https://trk.adnet-click.example/r?u=aHR0cHM6Ly9waWNz', 'https://pics-share.example/v/8821'], flags: ['shortener'], cert: { subject: 'bit.example', org: 'Bit Links', issuer: 'Fictional Trust CA', valid: true, from: '2026-05-01', to: '2027-05-01', san: ['bit.example'] } },
  'trk.adnet-click.example': { reputation: 'suspicious', brand: 'Ad tracker', page: 'redirect', ageDays: 40, flags: ['tracker'], cert: { subject: 'trk.adnet-click.example', org: '(not validated)', issuer: 'Budget Certs Ltd', valid: true, from: '2026-09-10', to: '2026-12-09', san: ['*.adnet-click.example'] } },
  'pics-share.example': { reputation: 'suspicious', brand: 'Photo-share (look-alike login)', page: 'login', login: 'photos', fake: true, expected: null, interstitial: 'blocked', ageDays: 2, flags: ['new-domain', 'credential-form'], cert: { subject: 'pics-share.example', org: '(not validated)', issuer: 'Budget Certs Ltd', valid: false, from: '2026-10-15', to: '2026-10-22', san: ['pics-share.example'], mismatch: true } },
  'invoice-view.example': { reputation: 'suspicious', brand: 'Invoice viewer', page: 'invoice', fake: true, ageDays: 3, flags: ['new-domain'], cert: { subject: 'invoice-view.example', org: '(not validated)', issuer: 'Budget Certs Ltd', valid: true, from: '2026-10-14', to: '2027-01-12', san: ['invoice-view.example'], mismatch: true } },
};

export const BOOKMARKS = [
  { title: 'Eastbrook Portal', url: 'https://portal.eastbrook.example/', icon: 'internet' },
  { title: 'NimbusDrive', url: 'https://files.nimbusdrive.example/', icon: 'documents' },
  { title: 'Northvale Bank', url: 'https://northvale.example/', icon: 'hard_drive' },
  { title: 'ParcelPoint Tracking', url: 'https://parcelpoint.example/track?id=PP4821', icon: 'programs' },
  { title: 'Eastbrook IT Help', url: 'https://help.eastbrook.example/', icon: 'help' },
  { title: 'Eastbrook Careers', url: 'https://careers.eastbrook.example/', icon: 'user' },
  { title: 'PaySure Payroll', url: 'https://paysure.example/', icon: 'clock' },
];

// ---------------------------------------------------------------- files
export const INITIAL_FILES = [
  { id: 'f1', folder: 'Documents', name: 'Lab 2 notes.txt', type: 'text', size: '3 KB', modified: 'Oct 02', content: 'Lab 2 - TCP handshake\n\n- SYN, SYN/ACK, ACK\n- Draw the state diagram before Thursday.\n- Ask Dr. Okafor about the bonus question.' },
  { id: 'f2', folder: 'Documents', name: 'Syllabus CS240.pdf', type: 'pdf', size: '184 KB', modified: 'Sep 05', content: 'CS240 - Networks and Security\n\nWeek 1: Layers and protocols\nWeek 2: Addressing and DNS\nWeek 3: Phishing and social engineering\n(simulated document)' },
  { id: 'f3', folder: 'Documents', name: 'Budget.xls', type: 'spreadsheet', size: '22 KB', modified: 'Oct 09', content: 'Rent   600\nFood   220\nBooks   80\n(simulated spreadsheet)' },
  { id: 'f4', folder: 'Documents', name: 'Campus map.png', type: 'image', size: '540 KB', modified: 'Aug 28', content: '(simulated image preview)' },
  { id: 'f5', folder: 'Desktop', name: 'Study group.lnk', type: 'shortcut', size: '1 KB', modified: 'Oct 01', content: 'Shortcut to Documents/Lab 2 notes.txt' },
  { id: 'f6', folder: 'Downloads', name: 'font-pack-free.exe', type: 'executable', size: '1.4 MB', modified: 'Oct 12', risky: true, content: '' },
  { id: 'f7', folder: 'Downloads', name: 'scholarship-form.pdf', type: 'pdf', size: '96 KB', modified: 'Oct 11', content: 'Scholarship application form (simulated)\n\nName: ________\nStudent ID: ________' },
  { id: 'f8', folder: 'Downloads', name: 'photo-viewer.js', type: 'script', size: '8 KB', modified: 'Oct 10', risky: true, content: '// simulated script - does nothing\nconsole.log("hello")' },
  { id: 'f9', folder: 'Downloads', name: 'mystery_file', type: 'unknown', size: '12 KB', modified: 'Oct 08', risky: true, content: '' },
];
export const FOLDERS = ['Desktop', 'Documents', 'Downloads', 'Quarantine'];

// ---------------------------------------------------------------- mission
export const MISSION = {
  title: 'Mission 01: Monday Inbox',
  brief: 'Eastbrook IT thinks a phishing wave has hit student mailboxes. Triage the inbox: report the phishing, mark the safe messages, and learn how to tell them apart.',
  objectives: [
    { id: 'o-review', label: 'Open every message in the inbox' },
    { id: 'o-inspect', label: 'Analyse at least one link with Link Inspector' },
    { id: 'o-report', label: 'Report at least three phishing messages' },
    { id: 'o-safe', label: 'Mark at least two legitimate messages as safe' },
    { id: 'o-xp', label: 'Earn 150 XP' },
  ],
};

export const RANKS = [
  { id: 'trainee', name: 'Trainee', xp: 0 }, { id: 'junior', name: 'Junior Analyst', xp: 100 }, { id: 'analyst', name: 'Analyst', xp: 200 },
  { id: 'senior', name: 'Senior Analyst', xp: 350 }, { id: 'specialist', name: 'Specialist', xp: 500 }, { id: 'investigator', name: 'Investigator', xp: 700 },
  { id: 'chief', name: 'Chief Inspector', xp: 1000 }, { id: 'sage', name: 'Cyber Sage', xp: 1500 },
];

export const ACHIEVEMENTS = [
  { id: 'first_report', name: 'First Report', desc: 'Have a phishing report accepted.' },
  { id: 'sharp_eyes', name: 'Sharp Eyes', desc: 'Discover 3 pieces of evidence.' },
  { id: 'link_sleuth', name: 'Link Sleuth', desc: 'Analyse 2 links in Link Inspector.' },
  { id: 'safe_clicker', name: 'Safe Clicker', desc: 'Make 3 decisions without clicking a phishing link.' },
  { id: 'speed_reader', name: 'Speed Reader', desc: 'Correctly resolve a message within 45 s of opening it.' },
  { id: 'perfect_run', name: 'Perfect Run', desc: 'Resolve every message correctly.' },
  { id: 'champion', name: 'Champion', desc: 'Reach the Senior Analyst rank.' },
  { id: 'key_keeper', name: 'Key Keeper', desc: 'Visit a look-alike login page and leave without typing credentials.' },
  { id: 'inbox_clear', name: 'Inbox Clear', desc: 'Make a decision on every message.' },
  { id: 'attachment_hawk', name: 'Attachment Hawk', desc: 'Inspect a risky attachment and report it.' },
  { id: 'on_the_clock', name: 'On the Clock', desc: 'Finish the whole inbox within 10 minutes.' },
  { id: 'bullseye', name: 'Bullseye', desc: 'Get the category right on 3 reports.' },
  { id: 'bookworm', name: 'Bookworm', desc: 'Open the Help utility.' },
  { id: 'lockdown', name: 'Lockdown', desc: 'Quarantine a risky file.' },
  { id: 'all_seeing', name: 'All-Seeing', desc: 'Discover every clue in one phishing message.' },
  { id: 'cyber_royalty', name: 'Cyber Royalty', desc: 'Unlock every other achievement.' },
];
