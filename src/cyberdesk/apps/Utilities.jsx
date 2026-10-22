import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../engine/store.jsx';
import { ACHIEVEMENTS, RANKS } from '../engine/scenario.js';
import { rankFor } from '../engine/scoring.js';
import { A, asset, WALLPAPERS } from '../engine/assets.js';
import { audio } from '../engine/audio.js';
import { Px, Button, Checkbox, Radio, Select, Tabs, GroupBox, useUI } from '../os/ui.jsx';
import { XpCounter } from '../os/Notifications.jsx';

export function SystemLog() {
  const { s } = useStore(); const end = useRef();
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [s.log.length]);
  return (
    <div className="termlog app-col" role="log" aria-live="off" aria-label="System log">
      <div className="term"><div className="tl dim">CyberDesk event log (simulated). Everything you do is recorded here.</div>
        {s.log.map((l, i) => <div key={i} className={`tl ${l.kind}`}>[{l.t}] {l.msg}</div>)}
        <div className="tl" ref={end}>&gt; <span className="cursor" /></div></div>
    </div>
  );
}

const GLOSSARY = [
  ['Phishing', 'A message that pretends to be someone you trust to steal information or money.'], ['Spoofing', 'Faking the name or address a message appears to come from.'],
  ['Look-alike domain', 'A web address that imitates a real one by changing a character or adding words, such as nimbusdrlve.example.'], ['Registrable domain', 'The owned part of an address, just before the final dot. Compare this first.'],
  ['Redirect', 'A link that sends you through other addresses before showing the final page. Shorteners hide the destination.'], ['Credential theft', 'Tricking you into typing your password into a fake sign-in page.'],
  ['Quarantine', 'Isolating a risky file so it cannot run.'],
];
const TOPICS = [
  ['Getting started', 'Open CyberMail from the desktop. Read each message, then choose: Report (phishing), Mark safe (legitimate) or Delete. Your mission card lists the objectives.'],
  ['Spotting evidence', 'Click [Details] in a message header to see the real sender address. Hover a link: the real destination appears in the status bar. Right-click a link and choose Inspect Destination to open it in Link Inspector. Turn on the Clue highlighter to save suspicious phrases.'],
  ['Reporting', 'Press Report in CyberMail or New report in Security Center. Choose a category, tick the evidence you found and submit. Each message is scored once.'],
  ['Accessibility', 'Open Display & Sound Settings for high contrast, reduced motion, touch mode and sound controls. Every control works with the keyboard.'],
];
export function Help() {
  const [t, setT] = useState('video');
  const ui = useUI();
  const [open, setOpen] = useState(0);

  return (
    <div className="help app-col">
      <Tabs
        tabs={[
          { id: 'video', label: '🎬 Video Tutorial' },
          { id: 'topics', label: 'Contents' },
          { id: 'gloss', label: 'Glossary' },
          { id: 'about', label: 'About' },
        ]}
        value={t}
        onChange={setT}
        className="grow"
      >
        {t === 'video' && (
          <div className="help-video-panel">
            <div className="help-video-meta">
              <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: 'var(--cd-title)' }}>
                CyberDesk Explainer &amp; Orientation (60s)
              </h3>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#444' }}>
                Follow this quick animated overview to learn the <strong>STOP &bull; INVESTIGATE &bull; VERIFY &bull; ACT</strong> workflow.
              </p>
            </div>
            <div className="help-video-frame">
              <video
                src={asset('video/CyberDesk_Explainer_60s_VO.mp4')}
                controls
                playsInline
                preload="metadata"
                className="help-video-player"
              >
                <source src={asset('video/CyberDesk_Explainer_60s_VO.mp4')} type="video/mp4" />
                <source src="./CyberDesk_Explainer_60s_VO.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="help-video-notes">
              <div className="hvn-item">
                <b>1. STOP:</b> Notice urgency, high pressure, or unexpected links before clicking.
              </div>
              <div className="hvn-item">
                <b>2. INVESTIGATE:</b> Inspect sender <code>[Details]</code> and test links in <strong>Link Inspector</strong>.
              </div>
              <div className="hvn-item">
                <b>3. VERIFY:</b> Check identities out-of-band using the <strong>Campus Directory</strong> or <strong>Terminal</strong>.
              </div>
              <div className="hvn-item">
                <b>4. ACT:</b> Submit evidence-backed reports to <strong>Security Center</strong> or mark safe.
              </div>
            </div>
          </div>
        )}
        {t === 'topics' && (
          <div className="helpbody">
            <ul className="topics">
              {TOPICS.map(([h], i) => (
                <li key={h}>
                  <button className={open === i ? 'on' : ''} onClick={() => setOpen(i)}>{h}</button>
                </li>
              ))}
            </ul>
            <div className="topic">
              <h3>{TOPICS[open][0]}</h3>
              <p>{TOPICS[open][1]}</p>
            </div>
          </div>
        )}
        {t === 'gloss' && (
          <dl className="gloss">
            {GLOSSARY.map(([k, v]) => (
              <React.Fragment key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </React.Fragment>
            ))}
          </dl>
        )}
        {t === 'about' && (
          <div className="about">
            <Px src={A.finn('happy')} size={64} />
            <h3>CyberDesk 1.0</h3>
            <p>Part of <b>Friend or Phish?</b>, a security-awareness game. All brands, people and sites are fictional.</p>
            <p>Fonts: Pixelify Sans, VT323, Press Start 2P (SIL OFL). All art and sound original.</p>
            <Button onClick={() => ui.dialog({ kind: 'info', icon: 'shield', title: 'About CyberDesk', text: 'CyberDesk 1.0 - a fictional retro desktop for security training. No real malware, no real accounts, no stored passwords.' })}>About CyberDesk…</Button>
          </div>
        )}
      </Tabs>
    </div>
  );
}

export function Settings() {
  const { s, act } = useStore(); const st = s.settings; const [t, setT] = useState('bg');
  return (
    <div className="settings app-col">
      <Tabs tabs={[{ id: 'bg', label: 'Background' }, { id: 'acc', label: 'Accessibility' }, { id: 'snd', label: 'Sound' }]} value={t} onChange={setT} className="grow">
        {t === 'bg' && <div><div className="wp-preview" style={st.wallpaper === 'teal' ? { background: 'var(--cd-desktop)' } : { backgroundImage: `url(${A.wallThumb(st.wallpaper)})` }} aria-label="Wallpaper preview" />
          <GroupBox title="Wallpaper"><div className="wp-list" role="radiogroup">{WALLPAPERS.map((w) => <Radio key={w.id} name="wp" value={w.id} checked={st.wallpaper === w.id} onChange={(v) => act.set({ wallpaper: v })} label={w.name} />)}</div></GroupBox></div>}
        {t === 'acc' && <div className="stack">
          <GroupBox title="Display"><Checkbox checked={st.scanlines} onChange={(v) => act.set({ scanlines: v })} label="CRT scanline overlay" /><Checkbox checked={st.contrast} onChange={(v) => act.set({ contrast: v })} label="High contrast" /></GroupBox>
          <GroupBox title="Motion"><Select value={st.motion} onChange={(v) => act.set({ motion: v })} options={[{ value: 'system', label: 'Follow system setting' }, { value: 'reduce', label: 'Reduce motion' }, { value: 'full', label: 'Full animations' }]} aria-label="Motion" /></GroupBox>
          <GroupBox title="Touch"><Checkbox checked={st.touch} onChange={(v) => act.set({ touch: v })} label="Touch mode: bigger targets, single tap opens icons" /></GroupBox></div>}
        {t === 'snd' && <div className="stack"><GroupBox title="Sound effects"><Checkbox checked={st.sound} onChange={(v) => act.set({ sound: v })} label="Enable sound effects" />
          <label className="blk">Volume <input type="range" min="0" max="1" step="0.05" value={st.volume} onChange={(e) => act.set({ volume: +e.target.value })} aria-label="Volume" /></label>
          <div className="row">{['click', 'email', 'warning', 'success', 'achievement'].map((id) => <Button key={id} onClick={() => audio.play(id)}>{id}</Button>)}</div></GroupBox></div>}
      </Tabs>
    </div>
  );
}

export function SystemProperties() {
  const { s } = useStore(); const [t, setT] = useState('general'); const r = rankFor(s.xp);
  return (
    <div className="sysprops app-col">
      <Tabs tabs={[{ id: 'general', label: 'General' }, { id: 'progress', label: 'Progress' }]} value={t} onChange={setT} className="grow">
        {t === 'general' ? <div className="stack"><div className="about"><Px src={A.sprite('crt-on')} w={96} /><div><b>CyberDesk 1.0</b><br />Security Training Edition<br />Fictional PC · 64 MB RAM · 640x480</div></div>
          <GroupBox title="Registered to"><p>Student, Eastbrook University (fictional)</p></GroupBox><XpCounter big /></div>
          : <div className="stack"><GroupBox title="Ranks"><div className="rankrow">{RANKS.map((x) => <Px key={x.id} src={A.rank(x.id, s.xp < x.xp)} size={32} title={`${x.name} (${x.xp} XP)`} className={s.xp >= x.xp ? '' : 'locked'} />)}</div></GroupBox>
            <GroupBox title="Achievements"><div className="achgrid">{ACHIEVEMENTS.map((a) => <Px key={a.id} src={A.ach(a.id, !s.achievements[a.id])} size={32} title={`${a.name}: ${a.desc}`} className={s.achievements[a.id] ? 'unlocked' : 'locked'} />)}</div></GroupBox></div>}
      </Tabs>
    </div>
  );
}
