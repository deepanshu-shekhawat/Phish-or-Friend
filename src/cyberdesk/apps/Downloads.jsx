import React from 'react';
import { useStore } from '../engine/store.jsx';
import { A } from '../engine/assets.js';
import { Px, Button, ProgressBar } from '../os/ui.jsx';

const LABEL = { queued: 'Queued', downloading: 'Downloading…', complete: 'Complete', blocked: 'Blocked' };
export function Downloads() {
  const { s, d } = useStore();
  return (
    <div className="downloads app-col">
      <div className="toolbar"><Button disabled={!s.downloads.some((x) => x.status === 'complete' || x.status === 'blocked')} onClick={() => s.downloads.filter((x) => x.status === 'complete' || x.status === 'blocked').forEach((x) => d({ type: 'dl/patch', id: x.id, patch: { hidden: true } }))}>Clear finished</Button><span className="grow" /><span className="sim">Simulated downloads: nothing is saved to your real device.</span></div>
      <div className="dl-list">
        {s.downloads.filter((x) => !x.hidden).length === 0 && <div className="empty big"><Px src={A.app('downloads')} size={32} /><p>No downloads yet.</p></div>}
        {s.downloads.filter((x) => !x.hidden).map((x) => (
          <div key={x.id} className={`dl st-${x.status}`}>
            <span className="aimg"><Px src={A.attach(['pdf', 'doc', 'img', 'xls', 'zip', 'exe', 'txt', 'js', 'html', 'unknown'].includes(x.type) ? x.type : 'unknown')} size={32} />{x.status === 'blocked' && <Px src={A.overlay('blocked')} size={14} className="ov" />}{x.status === 'complete' && <Px src={A.overlay('check')} size={14} className="ov" />}</span>
            <div className="dl-info"><b>{x.name}</b><small>From {x.source}</small><ProgressBar value={x.progress} label={`${x.name} progress`} />
              <small className="stt">{x.status === 'blocked' ? 'Blocked: executable files are never downloaded in this simulation.' : `${LABEL[x.status]}${x.status === 'downloading' ? ` ${x.progress}%` : ''}`}</small></div>
          </div>))}
      </div>
    </div>
  );
}
