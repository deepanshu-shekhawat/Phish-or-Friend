import React, { useEffect, useState } from 'react';
import { useStore } from '../engine/store.jsx';
import { FOLDERS, EMAILS, emailById } from '../engine/scenario.js';
import { A } from '../engine/assets.js';
import { Px, Button, Tabs, useUI } from '../os/ui.jsx';

const KIND = { text: 'Text Document', pdf: 'PDF Document', document: 'Document', spreadsheet: 'Spreadsheet', image: 'Image', shortcut: 'Shortcut', executable: 'Application', script: 'Script', unknown: 'Unknown file', archive: 'Archive' };

function PropsBody({ f }) {
  const [t, setT] = useState('general');
  return (
    <Tabs tabs={[{ id: 'general', label: 'General' }, { id: 'details', label: 'Details' }]} value={t} onChange={setT}>
      {t === 'general' ? (<div className="cert"><Px src={A.file(f.type)} size={32} /><table className="props"><tbody><tr><th>Name</th><td>{f.name}</td></tr><tr><th>Type</th><td>{KIND[f.type] || f.type}</td></tr><tr><th>Location</th><td>{f.folder}</td></tr><tr><th>Size</th><td>{f.size}</td></tr><tr><th>Modified</th><td>{f.modified}</td></tr></tbody></table></div>)
        : (<table className="props"><tbody><tr><th>Extension</th><td>.{f.name.split('.').pop()}</td></tr><tr><th>Source</th><td>{f.risky ? 'Unknown / downloaded' : 'Local'}</td></tr><tr><th>Digital signature</th><td>{f.risky ? 'None' : 'n/a'}</td></tr><tr><th>Risk</th><td className={f.risky ? 'bad' : ''}>{f.risky ? 'Executable or unknown content: treat with caution' : 'Low (simulated document)'}</td></tr></tbody></table>)}
    </Tabs>
  );
}

export default function Files({ win, folder: initial, nonce }) {
  const { s, act, d } = useStore(); const ui = useUI();
  const [folder, setFolder] = useState(initial || 'Documents'); const [sel, setSel] = useState(null);
  useEffect(() => { if (initial) { setFolder(initial); setSel(null); } }, [initial, nonce]);
  const places = [...FOLDERS, 'Recycle Bin'];
  const files = folder === 'Recycle Bin' ? s.files.filter((f) => f.folder === '__trash') : s.files.filter((f) => f.folder === folder);
  const mails = folder === 'Recycle Bin' ? EMAILS.filter((e) => s.mail[e.id]?.folder === 'trash') : [];
  const items = [...files.map((f) => ({ ...f, kind: 'file' })), ...mails.map((e) => ({ id: e.id, name: `${e.subject}.eml`, type: 'attachment', size: '4 KB', modified: e.date, kind: 'mail' }))];
  const cur = items.find((i) => i.id === sel);

  const risky = async (f) => {
    const r = await ui.dialog({ kind: 'warning', title: 'Unknown or risky file', wide: true, text: `${f.name} is ${f.type === 'unknown' ? 'a file with no recognisable type' : 'a program or script'} you downloaded. Running unknown files is how most malware gets in.`,
      children: <table className="props"><tbody><tr><th>File</th><td>{f.name}</td></tr><tr><th>Size</th><td>{f.size}</td></tr><tr><th>Source</th><td>Downloaded, unsigned</td></tr></tbody></table>,
      buttons: [{ label: 'Quarantine', value: 'q', def: true }, { label: 'Run anyway', value: 'run' }, { label: 'Cancel', value: 'c', cancel: true }] });
    if (r === 'q') act.quarantine(f.id);
    if (r === 'run') { act.log(`Ran risky file ${f.name} (simulated)`, 'warn'); act.tray({ security: 'alert' }); setTimeout(() => act.tray({ security: 'ok' }), 4500); ui.dialog({ kind: 'error', title: 'Simulated outcome', text: 'In real life this could have installed malware. Nothing ran here. Quarantine unknown files instead.' }); }
  };
  const openItem = (f) => {
    if (f.kind === 'mail') { act.launch('mail', { open: f.id }); return; }
    if (f.folder === 'Quarantine') { ui.dialog({ kind: 'info', title: 'Quarantined', text: `${f.name} is quarantined and cannot be opened.` }); return; }
    if (f.risky) return risky(f);
    if (f.type === 'text' || f.type === 'shortcut') act.launch('notes', { file: f.type === 'shortcut' ? 'f1' : f.id, nonce: Date.now() });
    else act.launch('viewer', { fileId: f.id }, { title: f.name });
  };
  const props = (f) => ui.dialog({ kind: 'properties', icon: null, title: `${f.name} Properties`, buttons: [{ label: 'OK', value: 'ok', def: true }], children: <PropsBody f={f} /> });
  const menu = (e, f) => { setSel(f.id); ui.menu(e, f.folder === '__trash' || f.kind === 'mail' ? [
    { label: 'Restore', onClick: () => (f.kind === 'mail' ? act.restoreEmail(f.id) : act.restoreFile(f.id)) }, { label: 'Properties', disabled: f.kind === 'mail', onClick: () => props(f) },
  ] : [
    { label: 'Open', onClick: () => openItem(f) }, { label: 'Quarantine', disabled: f.folder === 'Quarantine', onClick: () => act.quarantine(f.id) }, { label: 'Delete', onClick: () => act.deleteFile(f.id) }, { sep: 1 }, { label: 'Properties', onClick: () => props(f) }]); };
  const empty = async () => { const r = await ui.dialog({ kind: 'confirm', title: 'Empty Recycle Bin', text: 'Permanently delete all items in the Recycle Bin?', buttons: [{ label: 'Yes', value: 'y', def: true }, { label: 'No', value: 'n', cancel: true }] }); if (r === 'y') { act.emptyRecycle(); setSel(null); } };

  return (
    <div className="files app-col">
      <div className="toolbar">
        <Button disabled={!cur} onClick={() => cur && openItem(cur)}>Open</Button><Button disabled={!cur || cur.kind === 'mail' || folder === 'Quarantine'} onClick={() => cur && act.quarantine(cur.id)}>Quarantine</Button>
        <Button disabled={!cur || cur.kind === 'mail' || folder === 'Recycle Bin'} onClick={() => { cur && act.deleteFile(cur.id); setSel(null); }}>Delete</Button>
        {folder === 'Recycle Bin' && <><Button disabled={!cur} onClick={() => cur && (cur.kind === 'mail' ? act.restoreEmail(cur.id) : act.restoreFile(cur.id))}>Restore</Button><Button disabled={!items.length} onClick={empty}>Empty Recycle Bin</Button></>}
        <Button disabled={!cur || cur.kind === 'mail'} onClick={() => cur && props(cur)}>Properties</Button>
      </div>
      <div className="files-main">
        <ul className="tree" aria-label="Folders">
          <li className="root"><Px src={A.sys('my_computer')} size={16} /> My Computer</li>
          {places.map((p) => <li key={p}><button className={`folder ${folder === p ? 'on' : ''}`} onClick={() => { setFolder(p); setSel(null); }}>
            <Px src={p === 'Recycle Bin' ? A.sys('documents') : p === 'Quarantine' ? A.file('quarantined') : A.file('folder')} size={16} />{p}</button></li>)}
        </ul>
        <div className="flist" role="listbox" aria-label={`${folder} contents`} key={folder}>
          <div className="fh"><span>Name</span><span>Type</span><span>Size</span><span>Modified</span></div>
          {items.length === 0 && <div className="empty">This folder is empty.</div>}
          {items.map((f) => (
            <div key={f.id} role="option" aria-selected={sel === f.id} tabIndex={0} className={`frow ${sel === f.id ? 'sel' : ''}`} onClick={() => setSel(f.id)} onDoubleClick={() => openItem(f)} onContextMenu={(e) => menu(e, f)} onKeyDown={(e) => { if (e.key === 'Enter') openItem(f); }}>
              <span className="fname"><span className="fi"><Px src={A.file(f.folder === 'Quarantine' ? 'quarantined' : f.type)} size={16} />{f.risky && f.folder !== 'Quarantine' && <Px src={A.overlay('warning')} size={8} className="ov" />}</span>{f.name}</span>
              <span>{KIND[f.type] || 'Item'}</span><span>{f.size}</span><span>{f.modified}</span>
            </div>))}
        </div>
      </div>
      <div className="statusbar"><span className="sb-main">{cur ? `${cur.name} - ${cur.size}` : `${items.length} object(s)`}</span>{cur?.risky && <span className="sb-cell bad">Risky file</span>}</div>
    </div>
  );
}
