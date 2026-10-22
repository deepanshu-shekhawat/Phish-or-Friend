import React, { useState } from 'react';
import { asset, A } from './engine/assets.js';
import { audio } from './engine/audio.js';
import { Px, Button } from './os/ui.jsx';

export default function LandingPage({ onStart, onResume, hasSavedSession }) {
  const [cadetName, setCadetName] = useState('');
  const [showPreEntryPrompt, setShowPreEntryPrompt] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [targetMode, setTargetMode] = useState('direct'); // 'direct' | 'academy'
  const [videoEnded, setVideoEnded] = useState(false);

  const handleBegin = (mode = 'direct') => {
    audio.play('click');
    setTargetMode(mode);
    setShowPreEntryPrompt(true);
  };

  const handleChooseTutorial = () => {
    audio.play('click');
    setShowPreEntryPrompt(false);
    setVideoEnded(false);
    setShowVideoModal(true);
  };

  const handleChooseEnter = () => {
    audio.play('click');
    setShowPreEntryPrompt(false);
    setShowNameModal(true);
  };

  const handleEnterFromVideo = () => {
    audio.play('click');
    setShowVideoModal(false);
    setShowNameModal(true);
  };

  const handleConfirmStart = (e) => {
    e?.preventDefault();
    audio.play('click');
    setShowNameModal(false);
    onStart(cadetName.trim() || 'Cadet Analyst', targetMode);
  };

  return (
    <div className="landing-screen">
      <div className="landing-scanlines" />
      
      {/* Top Retro Navigation Header */}
      <header className="landing-header">
        <div className="landing-brand">
          <Px src={asset('boot/emblem.svg')} size={20} />
          <span className="brand-text">CYBERDESK // ACADEMY 1.0</span>
        </div>
        <div className="landing-meta">
          <span className="status-badge"><span className="dot" /> SIMULATION ENVIRONMENT ACTIVE</span>
          <span className="safety-badge">100% ISOLATED &bull; NO REAL MALWARE</span>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="landing-main">
        {/* Hero Card */}
        <div className="landing-card">
          <div className="titlebar">
            <span className="ttext">Welcome to CyberDesk &mdash; Standalone Cybersecurity Learning OS</span>
          </div>
          
          <div className="landing-card-body">
            <div className="hero-top-row">
              <img src={asset('boot/logo-frame3.svg')} alt="CyberDesk Logo" className="landing-logo" />
              <div className="hero-titles">
                <h1 className="hero-title">INVESTIGATE. VERIFY. DEFEND.</h1>
                <p className="hero-tagline">
                  A realistic simulated desktop environment designed to teach threat triage, 
                  phishing detection, deceptive URL analysis, and social engineering response through authentic digital investigation.
                </p>
              </div>
            </div>

            {/* Core Methodology Cards */}
            <div className="methodology-grid">
              <div className="m-card">
                <div className="m-step-num">1. STOP</div>
                <div className="m-step-desc">Pause impulsive clicks. Spot urgency, panic, and suspicious requests.</div>
              </div>
              <div className="m-card">
                <div className="m-step-num">2. INVESTIGATE</div>
                <div className="m-step-desc">Examine envelope headers, Link Inspector destinations, and file metadata.</div>
              </div>
              <div className="m-card">
                <div className="m-step-num">3. VERIFY</div>
                <div className="m-step-desc">Cross-check senders out-of-band via Directory lookups and Terminal WHOIS.</div>
              </div>
              <div className="m-card">
                <div className="m-step-num">4. ACT</div>
                <div className="m-step-desc">Submit evidence-backed reports to Security Center or mark safe.</div>
              </div>
            </div>

            {/* Launch Action Buttons */}
            <div className="hero-actions">
              <Button def className="btn-large" onClick={() => handleBegin('direct')}>
                <Px src={A.app('mail')} size={18} />
                <span>Start Learning as Guest</span>
              </Button>

              <Button className="btn-large btn-tutorial-highlight" onClick={handleChooseTutorial}>
                <span style={{ fontSize: '16px' }}>🎬</span>
                <span>View Video Tutorial (60s)</span>
              </Button>

              <Button className="btn-large" onClick={() => handleBegin('academy')}>
                <Px src={A.app('help')} size={18} />
                <span>Interactive Tutorial &amp; Academy</span>
              </Button>

              {hasSavedSession && (
                <Button className="btn-large" onClick={onResume}>
                  <Px src={A.sys('hard_drive')} size={18} />
                  <span>Resume Saved Session</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="features-grid">
          <div className="landing-card feature-card">
            <div className="titlebar"><span className="ttext">Simulated Digital OS</span></div>
            <div className="f-body">
              <Px src={A.sys('display')} size={28} />
              <h4>Authentic OS Interactions</h4>
              <p>Triage realistic digital scenarios inside CyberMail, CyberSurf browser, interactive Terminal, and File Manager.</p>
            </div>
          </div>

          <div className="landing-card feature-card">
            <div className="titlebar"><span className="ttext">Evidence-Driven Scoring</span></div>
            <div className="f-body">
              <Px src={A.app('inspector')} size={28} />
              <h4>Evidence Over Guesswork</h4>
              <p>Scores reward identifying verified clues (lookalike domains, double extensions, redirect chains) rather than guessing.</p>
            </div>
          </div>

          <div className="landing-card feature-card">
            <div className="titlebar"><span className="ttext">BKT Adaptive Engine</span></div>
            <div className="f-body">
              <Px src={A.app('mission')} size={28} />
              <h4>8-Skill Competency Matrix</h4>
              <p>Bayesian Knowledge Tracing models your mastery across 8 skills and recommends targeted practice challenges.</p>
            </div>
          </div>

          <div className="landing-card feature-card">
            <div className="titlebar"><span className="ttext">Safe Sandbox Isolation</span></div>
            <div className="f-body">
              <Px src={A.status('shield')} size={28} />
              <h4>100% Isolated Safety</h4>
              <p>Zero real phishing or live payloads. All destinations use reserved <code>.example</code> domains. No credentials collected.</p>
            </div>
          </div>
        </div>

        {/* Learning Objectives Box */}
        <div className="landing-card">
          <div className="titlebar"><span className="ttext">Core Learning Objectives &amp; Tracked Skills</span></div>
          <div className="obj-content">
            <div className="obj-columns">
              <div className="obj-col">
                <div className="obj-item">
                  <span className="obj-bullet">&#10003;</span>
                  <div><strong>URL &amp; Domain Analysis:</strong> Identify deceptive subdomains, punycode, and typo-squatting lookalikes.</div>
                </div>
                <div className="obj-item">
                  <span className="obj-bullet">&#10003;</span>
                  <div><strong>Sender Header Verification:</strong> Compare display names against actual envelope Return-Path and SPF/DKIM records.</div>
                </div>
                <div className="obj-item">
                  <span className="obj-bullet">&#10003;</span>
                  <div><strong>Impersonation &amp; Spoofing:</strong> Spot forged authority requests, brand mimicry, and fake security warnings.</div>
                </div>
              </div>
              <div className="obj-col">
                <div className="obj-item">
                  <span className="obj-bullet">&#10003;</span>
                  <div><strong>Social Engineering &amp; Urgency:</strong> Resist psychological pressure, manufactured panics, and curiosity traps.</div>
                </div>
                <div className="obj-item">
                  <span className="obj-bullet">&#10003;</span>
                  <div><strong>Attachment &amp; File Safety:</strong> Unmask double-extension payloads (e.g., <code>.pdf.exe</code>) inside archives.</div>
                </div>
                <div className="obj-item">
                  <span className="obj-bullet">&#10003;</span>
                  <div><strong>Independent Verification:</strong> Cross-check anomalous requests through campus directories and WHOIS.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Pre-Entry Orientation Prompt Modal */}
      {showPreEntryPrompt && (
        <div className="modal-overlay">
          <div className="landing-card modal-dialog orientation-gate-modal">
            <div className="titlebar">
              <span className="ttext">CyberDesk Academy &mdash; Pre-Flight Orientation</span>
              <button className="win-btn close" type="button" onClick={() => setShowPreEntryPrompt(false)}>×</button>
            </div>
            <div className="dlg-body" style={{ flexDirection: 'column', gap: '14px', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Px src={A.app('help')} size={44} className="dlg-icon" />
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: 'var(--cd-title)' }}>
                    Welcome to CyberDesk!
                  </h3>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: '#333' }}>
                    Before entering the website, would you like to view the 60-second video tutorial first, or enter directly?
                  </p>
                </div>
              </div>

              <div className="entry-choice-grid">
                <button
                  type="button"
                  className="entry-choice-card choice-tutorial"
                  onClick={handleChooseTutorial}
                >
                  <div className="choice-icon-wrap">
                    <span className="play-icon">🎬</span>
                  </div>
                  <div className="choice-text">
                    <strong>View Tutorial (60s Video)</strong>
                    <span>Watch how threat triage, headers, and Link Inspector work</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="entry-choice-card choice-enter"
                  onClick={handleChooseEnter}
                >
                  <div className="choice-icon-wrap">
                    <span className="enter-icon">🚀</span>
                  </div>
                  <div className="choice-text">
                    <strong>Enter Website Directly</strong>
                    <span>Skip tutorial and launch into the CyberDesk operating system</span>
                  </div>
                </button>
              </div>

              <div className="dlg-btns" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
                <Button type="button" onClick={() => setShowPreEntryPrompt(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {showVideoModal && (
        <div className="modal-overlay">
          <div className="landing-card modal-dialog video-modal-dialog">
            <div className="titlebar">
              <span className="ttext">CyberDesk Video Tutorial &mdash; 60s Explainer</span>
              <button className="win-btn close" type="button" onClick={() => setShowVideoModal(false)}>×</button>
            </div>
            <div className="video-modal-content">
              <div className="video-player-container">
                <video
                  src={asset('video/CyberDesk_Explainer_60s_VO.mp4')}
                  controls
                  autoPlay
                  playsInline
                  onEnded={() => setVideoEnded(true)}
                  className="explainer-video-player"
                >
                  <source src={asset('video/CyberDesk_Explainer_60s_VO.mp4')} type="video/mp4" />
                  <source src="./CyberDesk_Explainer_60s_VO.mp4" type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
              </div>

              {videoEnded && (
                <div className="video-completed-banner">
                  <Px src={A.status('success')} size={24} />
                  <div>
                    <strong>Tutorial completed!</strong> You are ready to start investigating threats.
                  </div>
                </div>
              )}

              <div className="video-modal-footer">
                <div className="video-tip">
                  💡 <strong>Methodology:</strong> STOP &bull; INVESTIGATE &bull; VERIFY &bull; ACT
                </div>
                <div className="video-modal-btns">
                  <Button def className="btn-large" onClick={handleEnterFromVideo}>
                    🚀 Enter Website Now &rarr;
                  </Button>
                  <Button type="button" onClick={() => setShowVideoModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Name Input Modal */}
      {showNameModal && (
        <div className="modal-overlay">
          <div className="landing-card modal-dialog">
            <div className="titlebar"><span className="ttext">Analyst Identification</span></div>
            <form onSubmit={handleConfirmStart} className="modal-form">
              <div className="dlg-body">
                <Px src={A.finn('happy')} size={40} className="dlg-icon" />
                <div className="dlg-text">
                  <p style={{ margin: '0 0 10px 0', fontSize: '13px' }}>Welcome to CyberDesk! Enter your analyst callsign or continue as guest:</p>
                  <input
                    type="text"
                    className="inp wide"
                    style={{ fontSize: '14px', padding: '5px 8px' }}
                    placeholder="Cadet Analyst"
                    value={cadetName}
                    onChange={(e) => setCadetName(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="dlg-btns" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', padding: '10px 14px' }}>
                <Button def type="submit">Launch Desktop &rarr;</Button>
                <Button type="button" onClick={() => setShowNameModal(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="landing-footer">
        CyberDesk 1.0 &bull; Standalone Cybersecurity Learning Platform &bull; All brands, domains, and contacts use the reserved .example TLD simulation.
      </footer>
    </div>
  );
}
