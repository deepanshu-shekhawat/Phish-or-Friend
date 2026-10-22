import React, { useState } from 'react';
import { useStore } from '../engine/store.jsx';
import { A } from '../engine/assets.js';
import { Px, Button } from '../os/ui.jsx';

const MODULES = [
  {
    id: 'intro',
    title: '1. The Core Cycle: STOP \u2192 INVESTIGATE \u2192 VERIFY \u2192 ACT',
    summary: 'Master the four-step methodology for evaluating digital communications safely.',
    content: (
      <div>
        <p>CyberDesk simulates realistic digital threats. Unlike standard quizzes, you will investigate simulated evidence across desktop tools before making decisions.</p>
        <div className="cycle-grid">
          <div className="cycle-card"><b>1. STOP</b><p>Do not click impulsively. Recognize urgency, emotion, and unexpected requests.</p></div>
          <div className="cycle-card"><b>2. INVESTIGATE</b><p>Inspect sender envelope details, URL links, and file metadata.</p></div>
          <div className="cycle-card"><b>3. VERIFY</b><p>Cross-check requests out-of-band using the Intranet Directory or Terminal.</p></div>
          <div className="cycle-card"><b>4. ACT</b><p>Report genuine threats to the Security Center, or safely handle legitimate messages.</p></div>
        </div>
      </div>
    ),
    action: { label: 'Open CyberMail to Begin', app: 'mail' },
  },
  {
    id: 'headers',
    title: '2. Inspecting Message Headers & Sender Envelopes',
    summary: 'Learn why the display name is trivial to fake and how to inspect the real envelope address.',
    content: (
      <div>
        <p>An attacker can easily set the display name to <b>"Eastbrook Registrar"</b> or <b>"Dean of Students"</b>. The display name is merely an arbitrary text string.</p>
        <p>In CyberMail, always click <code>[Details]</code> next to the sender name. Look for:</p>
        <ul>
          <li><b>Lookalike domains:</b> <code>eastbrook-registrar.example</code> instead of <code>eastbrook.example</code>.</li>
          <li><b>Subtle character swaps:</b> <code>nimbusdrlve.example</code> (with a lowercase 'L') instead of <code>nimbusdrive.example</code>.</li>
          <li><b>Unrelated free webmail:</b> Internal notices sent from <code>@bizsupply-mail.example</code>.</li>
        </ul>
      </div>
    ),
    action: { label: 'Practice Header Inspection in Mail', app: 'mail' },
  },
  {
    id: 'links',
    title: '3. Link Inspection & URL Breakdown',
    summary: 'Deconstruct links safely using Link Inspector without risking malware exposure.',
    content: (
      <div>
        <p>Hovering over a link shows the destination in the status bar, but sophisticated phishing hides destinations behind shorteners or lookalike subdomains.</p>
        <p>Right-click any link in CyberMail and select <b>"Inspect Destination"</b> to open <b>Link Inspector</b>:</p>
        <ul>
          <li><b>Registrable Domain:</b> The actual domain owned (e.g., in <code>eastbrook.secure-login.example</code>, the real owner is <code>secure-login.example</code>, NOT Eastbrook!).</li>
          <li><b>Redirect Chains:</b> Track URL shorteners and ad trackers that bounce your connection.</li>
          <li><b>SSL Certificates:</b> Remember: HTTPS only encrypts the connection. Phishing sites frequently have free SSL certificates!</li>
        </ul>
      </div>
    ),
    action: { label: 'Launch Link Inspector', app: 'inspector' },
  },
  {
    id: 'verify',
    title: '4. Independent Out-of-Band Verification',
    summary: 'How to verify requests using trusted external channels within the simulation.',
    content: (
      <div>
        <p>When an email requests sensitive action (money transfer, password verification, or emergency procedure changes), <b>never reply to the email or use contact info provided in the message itself</b>.</p>
        <p>Use CyberDesk's built-in verification tools:</p>
        <ul>
          <li><b>Intranet Directory:</b> Look up the authentic contact details, office phone, and official department notices.</li>
          <li><b>Interactive Terminal:</b> Use <code>whois &lt;domain&gt;</code> to check when a domain was created, or <code>nslookup</code> to check DNS infrastructure.</li>
        </ul>
      </div>
    ),
    action: { label: 'Explore Campus Directory', app: 'directory' },
  },
  {
    id: 'report',
    title: '5. Incident Reporting & Decision Calibration',
    summary: 'Submit well-supported reports and avoid rewarding reckless over-reporting.',
    content: (
      <div>
        <p>In CyberDesk, you are scored on the quality of your evidence, not just guessing:</p>
        <ul>
          <li><b>Selecting the Threat Category:</b> Correctly classify credential theft, impersonation, or malicious attachments.</li>
          <li><b>Citing Evidence:</b> Collect and cite valid clues. False accusations of legitimate emails reduce your XP.</li>
          <li><b>Safe Handling:</b> Clicking phishing links or submitting forms incurs safety penalties.</li>
        </ul>
      </div>
    ),
    action: { label: 'Open Security Center', app: 'security' },
  },
];

export default function Academy({ win }) {
  const { act } = useStore();
  const [activeStep, setActiveStep] = useState(0);

  const mod = MODULES[activeStep];

  return (
    <div className="academy-app app-col">
      <div className="acad-nav">
        {MODULES.map((m, idx) => (
          <button
            key={m.id}
            className={`acad-step-btn ${activeStep === idx ? 'active' : ''}`}
            onClick={() => setActiveStep(idx)}
          >
            <span>{idx + 1}. {m.title.split('. ')[1] || m.title}</span>
          </button>
        ))}
      </div>

      <div className="acad-body">
        <div className="acad-header">
          <Px src={A.finn('happy')} size={40} />
          <div>
            <h3>{mod.title}</h3>
            <p className="sub">{mod.summary}</p>
          </div>
        </div>

        <div className="acad-content">
          {mod.content}
        </div>

        <div className="acad-footer">
          <Button
            disabled={activeStep === 0}
            onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
          >
            &larr; Previous
          </Button>

          {mod.action && (
            <Button def onClick={() => act.launch(mod.action.app)}>
              {mod.action.label}
            </Button>
          )}

          <Button
            disabled={activeStep === MODULES.length - 1}
            onClick={() => setActiveStep(prev => Math.min(MODULES.length - 1, prev + 1))}
          >
            Next &rarr;
          </Button>
        </div>
      </div>
    </div>
  );
}
