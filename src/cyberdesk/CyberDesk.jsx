import React, { useEffect, useRef, useState } from 'react';
import { StoreProvider, useStore } from './engine/store.jsx';
import { asset, cursorVars, setAssetBase } from './engine/assets.js';
import { audio } from './engine/audio.js';
import { UIProvider, useUI, Button, Px } from './os/ui.jsx';
import Desktop from './os/Desktop.jsx';
import { Taskbar } from './os/Taskbar.jsx';
import { Toasts } from './os/Notifications.jsx';
import { BootScreen, WarningScreen, ShutdownScreen, CrtOverlay } from './os/Boot.jsx';
import LandingPage from './Landing.jsx';
import './styles/tokens.css';
import './styles/base.css';
import './styles/os.css';
import './styles/apps.css';
import './styles/anim.css';

function useFonts() {
  useEffect(() => {
    const id = 'cyberdesk-fonts'; if (document.getElementById(id)) return;
    const l = document.createElement('link'); l.id = id; l.rel = 'stylesheet'; l.href = asset('fonts/fonts.css'); document.head.appendChild(l);
  }, []);
}

function Inner({ onExit }) {
  const { s, d, act, reduced } = useStore(); const ui = useUI();
  const [reveal, setReveal] = useState(false);
  useFonts();

  const hasSavedSession = (() => {
    try {
      return !!(sessionStorage.getItem('cyberdesk.session.v1') || localStorage.getItem('cyberdesk.session.v1'));
    } catch {
      return false;
    }
  })();

  const handleStartLanding = (cadetName, mode = 'direct') => {
    d({ type: 'user/set', patch: { name: cadetName } });
    d({ type: 'launchApp', app: mode === 'academy' ? 'academy' : 'mail' });
    d({ type: 'phase', phase: 'warning' });
  };

  const handleResumeLanding = () => {
    d({ type: 'phase', phase: 'boot' });
  };

  const startBoot = () => {
    audio.play('click');
    d({ type: 'phase', phase: 'boot' });
  };

  const bootDone = () => {
    d({ type: 'phase', phase: 'desktop' });
    setReveal(true);
    setTimeout(() => setReveal(false), 2600);
    audio.play('startup');
    audio.startAmbience();
    act.log(`CyberDesk initialized for ${s.user?.name || 'Cadet Analyst'}`);
    act.log('Simulation environment active (isolated safe mode)');

    const targetApp = s.launchAppAfterBoot || 'mail';
    setTimeout(() => {
      act.launch(targetApp);
      if (targetApp === 'academy') {
        act.notify({
          kind: 'task',
          title: 'Welcome to Academy',
          text: 'Complete the interactive tutorial to learn threat investigation.',
          action: { app: 'academy' },
          ms: 7000
        });
      } else {
        act.notify({
          kind: 'task',
          title: 'New mission assigned',
          text: 'Mission 01: Monday Inbox triage. Open CyberMail to begin.',
          action: { app: 'mail' },
          ms: 6000
        });
      }
    }, 1400);
  };

  const shutdown = async () => {
    const r = await ui.dialog({
      kind: 'confirm',
      title: 'Shut Down CyberDesk',
      text: 'Are you sure you want to shut down? Your progress and skill mastery are saved.',
      buttons: [
        { label: 'Shut Down', value: 'y', def: true },
        { label: 'Return to Landing', value: 'landing' },
        { label: 'Cancel', value: 'n', cancel: true }
      ]
    });

    if (r === 'landing') {
      d({ type: 'phase', phase: 'landing' });
      return;
    }

    if (r === 'y') {
      try {
        const o = {};
        ['mail', 'reports', 'evidence', 'analysed', 'inspectedAttachments', 'sites', 'flags', 'files', 'xp', 'achievements', 'notes', 'downloads', 'startedAt', 'log', 'nextIncident', 'user']
          .forEach((k) => { o[k] = s[k]; });
        sessionStorage.setItem('cyberdesk.session.v1', JSON.stringify(o));
      } catch {}
      d({ type: 'phase', phase: 'shutdown' });
    }
  };

  const afterShutdown = () => {
    if (onExit) onExit(s);
    d({ type: 'phase', phase: 'off' });
  };

  const vars = cursorVars();
  const online = s.phase === 'desktop' || s.phase === 'shutdown';

  return (
    <div
      className={`cyberdesk phase-${s.phase}`}
      style={vars}
      data-motion={reduced ? 'reduce' : 'full'}
      data-contrast={s.settings.contrast ? 'high' : 'normal'}
      data-touch={s.settings.touch ? 'true' : 'false'}
    >
      {s.phase === 'landing' && (
        <LandingPage
          onStart={handleStartLanding}
          onResume={handleResumeLanding}
          hasSavedSession={hasSavedSession}
        />
      )}
      {s.phase === 'warning' && <WarningScreen onStart={startBoot} />}
      {s.phase === 'boot' && <BootScreen onDone={bootDone} />}
      {online && (
        <div className={`os ${s.phase === 'shutdown' ? 'dimming' : ''}`}>
          <Desktop reveal={reveal} onShutdown={shutdown} />
          <Taskbar onShutdown={shutdown} />
          <Toasts />
        </div>
      )}
      {s.phase === 'shutdown' && <ShutdownScreen onExit={afterShutdown} />}
      {s.phase === 'off' && (
        <div className="screen black center off-screen">
          <div className="win active dialog pop">
            <div className="titlebar"><span className="ttext">CyberDesk is off</span></div>
            <div className="dlg-body">
              <Px src={asset('boot/emblem.svg')} size={32} className="dlg-icon" />
              <div className="dlg-text">
                <p>Session and BKT skill mastery saved. You can power on again or return to the landing portal.</p>
              </div>
            </div>
            <div className="dlg-btns">
              <Button def onClick={() => d({ type: 'phase', phase: 'landing' })}>Landing Portal</Button>
              <Button onClick={() => d({ type: 'phase', phase: 'warning' })}>Power on</Button>
            </div>
          </div>
        </div>
      )}
      {s.phase !== 'warning' && s.phase !== 'off' && s.phase !== 'landing' && <CrtOverlay flicker={reveal} />}
    </div>
  );
}

export default function CyberDesk({ onExit, assetBase }) {
  if (assetBase) setAssetBase(assetBase);
  return (
    <StoreProvider>
      <UIProvider><Inner onExit={onExit} /></UIProvider>
    </StoreProvider>
  );
}
