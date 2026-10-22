import { useBusyCursor } from '../engine/busy.js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../engine/store.jsx';
import { SITES } from '../engine/scenario.js';
import { parseUrl } from '../engine/urlTools.js';
import { A } from '../engine/assets.js';
import { Px, Input, Tip, Button } from '../os/ui.jsx';
import { PageCtx, PAGES, LoginPage, NewTab, ErrorPage } from './pages/Pages.jsx';

const NEWTAB = 'cyberdesk://newtab';
let tid = 1;
const mk = (url = NEWTAB) => ({ id: tid++, url, history: [url], idx: 0, loading: false, hop: '', bypass: {}, key: 0 });

function smartResolveUrl(input) {
  let v = input.trim();
  if (!v) return null;
  if (v.startsWith('cyberdesk://')) return v;
  if (/^https?:\/\//i.test(v)) return v;
  // If user entered a domain (e.g. google.com, wikipedia.org, news.ycombinator.com/item)
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(v) || /^localhost(:[0-9]+)?(\/.*)?$/i.test(v)) {
    return 'https://' + v;
  }
  // Otherwise treat as search query on DuckDuckGo HTML
  return `https://html.duckduckgo.com/html/?q=${encodeURIComponent(v)}`;
}

function route(url, bypass) {
  if (url === NEWTAB) return { kind: 'newtab', title: 'New Tab' };
  const p = parseUrl(url);
  if (!p.ok || !/^https?$/.test(p.protocol)) return { kind: 'unavailable', title: 'Page unavailable' };
  const site = SITES[p.hostname];
  if (!site) {
    // Real external website (like in Google Chrome)
    return { kind: 'live_web', title: p.hostname || 'Live Web', p, url };
  }
  if (site.interstitial && !bypass[p.hostname]) {
    return { kind: site.interstitial === 'blocked' ? 'blocked' : 'warning', title: site.interstitial === 'blocked' ? 'Blocked' : 'Warning', site, p };
  }
  if (site.page === 'redirect') return { kind: 'unavailable', title: 'Redirect', site, p };
  return { kind: 'page', site, p, title: site.brand.replace(' (look-alike)', '') };
}

function LiveWebPage({ url, host, p, onNavigate }) {
  const [mode, setMode] = useState('proxy'); // 'proxy' or 'direct'
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    setLoading(true);
  }, [url, mode]);

  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === 'CYBERDESK_NAV' && e.data.url) {
        onNavigate(e.data.url);
      } else if (e.data?.type === 'CYBERDESK_TOGGLE_DIRECT') {
        setMode('direct');
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [onNavigate]);

  const copyUrl = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const iframeSrc = mode === 'proxy'
    ? `/api/proxy?url=${encodeURIComponent(url)}`
    : url;

  return (
    <div className="live-web-container">
      <div className="live-web-bar">
        <div className="live-web-info">
          <span className="live-badge">🌐 LIVE WEB</span>
          <span className="live-host">{host}</span>
          <span className="live-protocol">{p.protocol.toUpperCase()}</span>
        </div>
        <div className="live-web-actions">
          <button
            type="button"
            className="lw-btn"
            title="Toggle between proxy (embed-friendly) and direct iframe mode"
            onClick={() => setMode((m) => (m === 'proxy' ? 'direct' : 'proxy'))}
          >
            {mode === 'proxy' ? '⚡ Proxy Mode (Active)' : '🌐 Direct Mode'}
          </button>
          <button
            type="button"
            className="lw-btn"
            onClick={copyUrl}
            title="Copy URL to clipboard"
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
          <button
            type="button"
            className="lw-btn primary"
            onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
            title="Open in your real Google Chrome browser window"
          >
            Open in Chrome ↗
          </button>
        </div>
      </div>
      <div className="live-web-frame-wrap">
        {loading && (
          <div className="live-web-loading">
            <span className="live-spinner" /> Loading {host}…
          </div>
        )}
        <iframe
          ref={iframeRef}
          key={`${url}-${mode}`}
          src={iframeSrc}
          title={`Live Web: ${host}`}
          className="live-web-iframe"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
}

export default function Browser({ win, url, from, nonce }) {
  const { s, act } = useStore();
  const [tabs, setTabs] = useState([mk(NEWTAB)]);
  const [cur, setCur] = useState(tabs[0].id);
  const [status, setStatus] = useState('');
  const [addr, setAddr] = useState('');

  useBusyCursor(tabs.some((t) => t.loading));
  const tab = tabs.find((t) => t.id === cur) || tabs[0];
  const patch = (id, f) => setTabs((ts) => ts.map((t) => (t.id === id ? { ...t, ...(typeof f === 'function' ? f(t) : f) } : t)));
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const load = useCallback((id, target, push = true) => {
    let dest = target;
    const p = parseUrl(target);
    const site = p.ok ? SITES[p.hostname] : null;
    const hops = site?.redirects && p.path.length > 1 ? site.redirects : null;

    patch(id, { loading: true, hop: '' });
    act.log(`Navigating to ${target}`);
    let delay = 350;

    if (hops) {
      hops.slice(1).forEach((h, i) => later(() => patch(id, { hop: `Redirecting (${i + 1}/${hops.length - 1}): ${parseUrl(h).hostname}` }), 350 + i * 450));
      dest = hops[hops.length - 1];
      delay = 350 + (hops.length - 1) * 450;
    }

    later(() => {
      patch(id, (t) => {
        const history = push ? [...t.history.slice(0, t.idx + 1), dest] : t.history;
        return { url: dest, loading: false, hop: '', history, idx: push ? history.length - 1 : t.idx, key: t.key + 1 };
      });
      const pr = parseUrl(dest);
      const st = pr.ok ? SITES[pr.hostname] : null;
      if (st) {
        act.visitSite({ host: pr.hostname, fake: !!st.fake, login: st.page === 'login' || st.page === 'payment' || (st.page === 'job' && st.fake) });
      }
    }, delay);
  }, [act]);

  useEffect(() => {
    if (url) {
      const id = cur;
      setTabs((ts) => ts.map((t) => (t.id === id ? { ...t } : t)));
      load(id, url);
    }
  }, [nonce]);

  useEffect(() => {
    setAddr(tab.url === NEWTAB ? '' : tab.url);
  }, [tab.url, cur]);

  const leave = (t) => {
    const p = parseUrl(t.url);
    if (p.ok && SITES[p.hostname]) act.siteLeft(p.hostname);
  };

  const nav = (target) => {
    leave(tab);
    load(tab.id, target);
  };

  const back = () => {
    if (tab.idx > 0) {
      leave(tab);
      const i = tab.idx - 1;
      patch(tab.id, { idx: i, url: tab.history[i], key: tab.key + 1 });
    }
  };

  const fwd = () => {
    if (tab.idx < tab.history.length - 1) {
      const i = tab.idx + 1;
      patch(tab.id, { idx: i, url: tab.history[i], key: tab.key + 1 });
    }
  };

  const addTab = () => {
    const t = mk();
    setTabs((ts) => [...ts, t]);
    setCur(t.id);
  };

  const closeTab = (id) => {
    if (tabs.length === 1) {
      patch(id, { ...mk(), id });
      return;
    }
    const i = tabs.findIndex((t) => t.id === id);
    const rest = tabs.filter((t) => t.id !== id);
    setTabs(rest);
    if (cur === id) setCur(rest[Math.max(0, i - 1)].id);
  };

  const submitAddr = (e) => {
    e.preventDefault();
    const resolved = smartResolveUrl(addr);
    if (resolved) nav(resolved);
  };

  const r = route(tab.url, tab.bypass);
  const p = parseUrl(tab.url);
  const site = p.ok ? SITES[p.hostname] : null;

  const secIcon = tab.url === NEWTAB ? null
    : !p.ok ? 'lock_open'
    : p.protocol === 'http' ? 'lock_open'
    : site?.cert && !site.cert.valid ? 'warning'
    : 'lock';

  const ctxFor = (t) => ({
    url: t.url,
    nav: (u) => { leave(t); load(t.id, u); },
    setStatus,
    download: (d) => act.startDownload({ ...d, source: parseUrl(t.url).hostname }),
    onSubmitted: () => {
      const pp = parseUrl(t.url);
      act.siteSubmitted(pp.hostname);
      act.log(`Simulated form submitted on ${pp.hostname}`, 'warn');
    },
  });

  const renderPage = (t) => {
    const rt = route(t.url, t.bypass);
    if (rt.kind === 'newtab') return <NewTab />;
    if (rt.kind === 'live_web') {
      return <LiveWebPage url={t.url} host={rt.p.hostname} p={rt.p} onNavigate={(u) => nav(u)} />;
    }
    if (rt.kind === 'unavailable' || rt.kind === 'blocked' || rt.kind === 'warning') {
      return (
        <ErrorPage
          kind={rt.kind}
          url={t.url}
          onBack={() => (t.idx > 0 ? patch(t.id, { idx: t.idx - 1, url: t.history[t.idx - 1], key: t.key + 1 }) : load(t.id, NEWTAB))}
          onContinue={() => patch(t.id, (x) => ({ bypass: { ...x.bypass, [parseUrl(t.url).hostname]: true } }))}
        />
      );
    }
    const st = rt.site;
    const host = rt.p.hostname;
    if (st.page === 'login') return <LoginPage site={st} host={host} />;
    const C = PAGES[st.page];
    return C ? <C host={host} site={st} /> : null;
  };

  const isLiveWeb = r.kind === 'live_web';

  return (
    <div className="browser app-col">
      <div className="tabstrip" role="tablist">
        {tabs.map((t) => {
          const rt = route(t.url, t.bypass);
          return (
            <div
              key={t.id}
              role="tab"
              aria-selected={t.id === cur}
              className={`btab ${t.id === cur ? 'on' : ''}`}
              onClick={() => setCur(t.id)}
            >
              <Px src={t.url === NEWTAB ? A.sys('internet') : rt.kind === 'live_web' ? A.sys('internet') : A.sys('internet')} size={16} />
              <span className="btitle">{t.loading ? 'Loading…' : rt.title}</span>
              <button className="tclose" aria-label="Close tab" onClick={(e) => { e.stopPropagation(); closeTab(t.id); }}>×</button>
            </div>
          );
        })}
        <button className="btab new" aria-label="New tab" onClick={addTab}>
          <Px src={A.tb('new_tab')} size={16} />
        </button>
      </div>

      <div className="toolbar nav" role="toolbar" aria-label="Browser toolbar">
        <Tip text="Back">
          <button className="tbtn" onClick={back} disabled={tab.idx === 0} aria-label="Back">
            <Px src={A.tb('back')} size={16} />
          </button>
        </Tip>
        <Tip text="Forward">
          <button className="tbtn" onClick={fwd} disabled={tab.idx >= tab.history.length - 1} aria-label="Forward">
            <Px src={A.tb('forward_nav')} size={16} />
          </button>
        </Tip>
        <Tip text="Refresh">
          <button className="tbtn" onClick={() => load(tab.id, tab.url, false)} aria-label="Refresh">
            <Px src={A.tb('refresh')} size={16} />
          </button>
        </Tip>
        <Tip text="Home">
          <button className="tbtn" onClick={() => nav(NEWTAB)} aria-label="Home">
            <Px src={A.tb('home')} size={16} />
          </button>
        </Tip>

        <form className="addrform" onSubmit={submitAddr}>
          <span className="secind">
            {secIcon && (
              <button
                type="button"
                className="tbtn flat"
                aria-label="Site security details"
                title={isLiveWeb ? `Live Web: Secure SSL connection to ${p.hostname}` : 'Site security details (opens Link Inspector)'}
                onClick={() => {
                  if (!isLiveWeb) {
                    act.launch('inspector', { url: tab.url, nonce: Date.now() });
                  }
                }}
              >
                <Px src={secIcon === 'warning' ? A.status('warning') : A.tb(secIcon)} size={16} />
              </button>
            )}
          </span>
          <Input
            className="addr"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            aria-label="Address"
            placeholder="Type any website address (e.g. google.com, wikipedia.org) or search..."
          />
          <button className="tbtn go" type="submit" aria-label="Go">Go</button>
          {isLiveWeb && (
            <button
              type="button"
              className="tbtn chrome-pop-btn"
              title="Open website in real Chrome browser tab"
              onClick={() => window.open(tab.url, '_blank', 'noopener,noreferrer')}
            >
              Chrome ↗
            </button>
          )}
        </form>
        <span className={`throbber ${tab.loading ? 'on' : ''}`} aria-hidden="true"><i /></span>
      </div>

      <div className={`loadbar ${tab.loading ? 'on' : ''}`}><i /></div>

      <div className="viewport">
        {tabs.map((t) => (
          <div key={t.id} className="pane" hidden={t.id !== cur} aria-hidden={t.id !== cur}>
            <PageCtx.Provider value={ctxFor(t)}>
              <div key={t.key} style={{ height: '100%', width: '100%' }}>{renderPage(t)}</div>
            </PageCtx.Provider>
          </div>
        ))}
        {tab.loading && <div className="loading-veil"><Px src={A.finn('thinking')} size={32} />{tab.hop || 'Loading website…'}</div>}
      </div>

      <div className="statusbar">
        <span className="sb-main">{status || (tab.loading ? tab.hop || 'Connecting…' : isLiveWeb ? `Connected to ${p.hostname}` : 'Done')}</span>
        <span className="sb-cell">
          {isLiveWeb ? '🌐 Live World Wide Web (Embedded)' : '🎓 Simulated Lab Portal'}
        </span>
      </div>
    </div>
  );
}

