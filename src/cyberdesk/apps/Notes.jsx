import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../engine/store.jsx';
import { audio } from '../engine/audio.js';
import { A } from '../engine/assets.js';
import { Px, Button } from '../os/ui.jsx';

export function Notes({ win, file, nonce }) {
  const { s, d } = useStore(); const f = file ? s.files.find((x) => x.id === file) : null;
  const [text, setText] = useState(f ? f.content : 'Study notes\n\n- Check sender domain\n- Hover before clicking\n- When in doubt, report it');
  const [saved, setSaved] = useState(true); const last = useRef(0);
  useEffect(() => { if (f) { setText(f.content); setSaved(true); } }, [file, nonce]);
  const key = () => { const n = Date.now(); if (n - last.current > 70) { audio.play('typing'); last.current = n; } };
  const save = () => { if (f) d({ type: 'file/patch', id: f.id, patch: { content: text, modified: 'Today' } }); setSaved(true); };
  return (
    <div className="notes app-col">
      <div className="toolbar"><Button onClick={save} disabled={saved}>Save</Button><span className="grow" /><span className="sim">{f ? f.name : 'Untitled'}{saved ? '' : ' *'}</span></div>
      <textarea className="editor" value={text} spellCheck={false} aria-label="Document text" onKeyDown={key} onChange={(e) => { setText(e.target.value); setSaved(false); }} />
      <div className="statusbar"><span className="sb-main">{text.length} characters</span><span className="sb-cell">Plain text</span></div>
    </div>
  );
}

export function Viewer({ win, fileId }) {
  const { s } = useStore(); const f = s.files.find((x) => x.id === fileId);
  if (!f) return <div className="empty big">File not found.</div>;
  return (
    <div className="viewer app-col">
      <div className="docpage"><div className="doc-head"><Px src={A.file(f.type)} size={32} /><div><b>{f.name}</b><small>{f.size} · simulated content</small></div></div>
        <pre>{f.content || '(no preview)'}</pre></div>
    </div>
  );
}
