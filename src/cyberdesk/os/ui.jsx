import React, { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { A } from '../engine/assets.js';
import { audio } from '../engine/audio.js';

export const Px = ({ src, size, w, h, className = '', alt = '', style, ...r }) => (
  <img className={'px ' + className} src={src} width={w || size} height={h || size} alt={alt} draggable={false} style={style} {...r} />
);

export function Button({ children, onClick, disabled, def, className = '', title, type = 'button', sound = true, ...r }) {
  return (
    <button type={type} className={`btn ${def ? 'default' : ''} ${className}`} disabled={disabled} title={title}
      onClick={(e) => { if (sound) audio.play('click'); onClick && onClick(e); }} {...r}>{children}</button>
  );
}

export function Checkbox({ checked, onChange, label, disabled, className = '' }) {
  return (
    <label className={`chk ${disabled ? 'disabled' : ''} ${className}`}>
      <input type="checkbox" checked={!!checked} disabled={disabled} onChange={(e) => { audio.play('click'); onChange && onChange(e.target.checked); }} />
      <span className="box" aria-hidden="true" />
      <span className="lbl">{label}</span>
    </label>
  );
}
export function Radio({ checked, onChange, label, name, value, disabled }) {
  return (
    <label className={`chk radio ${disabled ? 'disabled' : ''}`}>
      <input type="radio" name={name} value={value} checked={!!checked} disabled={disabled} onChange={() => { audio.play('click'); onChange && onChange(value); }} />
      <span className="box" aria-hidden="true" />
      <span className="lbl">{label}</span>
    </label>
  );
}
export const Input = React.forwardRef(function Input({ className = '', invalid, ...r }, ref) {
  return <input ref={ref} className={`inp ${invalid ? 'invalid' : ''} ${className}`} {...r} />;
});
export function Select({ value, onChange, options, className = '', ...r }) {
  return (
    <span className={`sel ${className}`}>
      <select value={value} onChange={(e) => onChange(e.target.value)} {...r}>
        {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </span>
  );
}
export function GroupBox({ title, children, className = '' }) {
  return <fieldset className={'group ' + className}><legend>{title}</legend>{children}</fieldset>;
}

export function Tabs({ tabs, value, onChange, children, className = '' }) {
  const id = useId();
  const onKey = (e) => {
    const i = tabs.findIndex((t) => t.id === value);
    if (e.key === 'ArrowRight') onChange(tabs[(i + 1) % tabs.length].id);
    if (e.key === 'ArrowLeft') onChange(tabs[(i - 1 + tabs.length) % tabs.length].id);
  };
  return (
    <div className={'tabs ' + className}>
      <div className="tablist" role="tablist" onKeyDown={onKey}>
        {tabs.map((t) => (
          <button key={t.id} role="tab" id={`${id}-${t.id}`} aria-selected={value === t.id} aria-controls={`${id}-panel`} tabIndex={value === t.id ? 0 : -1}
            className={'tab ' + (value === t.id ? 'on' : '')} onClick={() => { audio.play('click'); onChange(t.id); }}>{t.label}</button>
        ))}
      </div>
      <div className="tabpanel" role="tabpanel" id={`${id}-panel`}>{children}</div>
    </div>
  );
}

export function ProgressBar({ value, segments = true, label, className = '' }) {
  return (
    <div className={`pbar ${segments ? 'seg' : ''} ${className}`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)} aria-label={label}>
      <div className="fill" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

/** Tooltip appears after a short delay on hover/focus. */
export function Tip({ text, children, delay = 600 }) {
  const [show, setShow] = useState(false); const t = useRef();
  const on = () => { clearTimeout(t.current); t.current = setTimeout(() => setShow(true), delay); };
  const off = () => { clearTimeout(t.current); setShow(false); };
  useEffect(() => () => clearTimeout(t.current), []);
  return (
    <span className="tipwrap" onMouseEnter={on} onMouseLeave={off} onFocus={on} onBlur={off} onMouseDown={off}>
      {children}{show && <span className="tip" role="tooltip">{text}</span>}
    </span>
  );
}

// ------------------------------------------------------------------ dialogs + context menus
const UICtx = createContext(null);
export const useUI = () => useContext(UICtx);
let did = 1;

export function UIProvider({ children, layerRef }) {
  const [dialogs, setDialogs] = useState([]);
  const [menu, setMenu] = useState(null);

  const dialog = useCallback((opts) => new Promise((resolve) => {
    audio.play(opts.kind === 'error' ? 'error' : opts.kind === 'warning' ? 'warning' : 'dialog-pop');
    setDialogs((d) => [...d, { id: did++, ...opts, resolve }]);
  }), []);
  const close = (id, value) => setDialogs((ds) => { const d = ds.find((x) => x.id === id); if (d) setTimeout(() => d.resolve(value), 0); return ds.map((x) => (x.id === id ? { ...x, closing: true } : x)); });
  const remove = (id) => setDialogs((ds) => ds.filter((x) => x.id !== id));
  const openMenu = useCallback((e, items) => {
    e.preventDefault(); e.stopPropagation(); audio.play('menu-open');
    setMenu({ x: e.clientX, y: e.clientY, items });
  }, []);
  const openMenuAt = useCallback((x, y, items) => { audio.play('menu-open'); setMenu({ x, y, items }); }, []);

  return (
    <UICtx.Provider value={{ dialog, menu: openMenu, menuAt: openMenuAt, closeMenu: () => setMenu(null) }}>
      {children}
      {dialogs.map((d, i) => <DialogView key={d.id} d={d} top={i === dialogs.length - 1} close={close} remove={remove} />)}
      {menu && <ContextMenu {...menu} onClose={() => setMenu(null)} />}
    </UICtx.Provider>
  );
}

function DialogView({ d, top, close, remove }) {
  const btns = d.buttons || [{ label: 'OK', value: 'ok', def: true }];
  const [pressed, setPressed] = useState(null);
  const ref = useRef();
  useEffect(() => { const b = ref.current && (ref.current.querySelector('.btn.default') || ref.current.querySelector('.btn')); if (b && top) b.focus(); }, [top]);
  const choose = (b) => { setPressed(b.value); audio.play('click'); setTimeout(() => close(d.id, b.value), 110); };
  const onKey = (e) => {
    if (e.key === 'Escape') { const c = btns.find((b) => b.cancel) || btns[btns.length - 1]; choose(c); e.stopPropagation(); }
  };
  const icon = d.icon || ({ info: 'info', warning: 'warning', error: 'error', confirm: 'question', success: 'success', properties: null }[d.kind] || 'info');
  return (
    <div className={`modal-shade ${d.closing ? 'out' : ''}`} onKeyDown={onKey}>
      <div ref={ref} className={`dialog win active ${d.closing ? 'closing' : ''} ${d.wide ? 'wide' : ''}`} role="alertdialog" aria-modal="true" aria-label={d.title} onAnimationEnd={(e) => { if (d.closing && e.target === e.currentTarget) remove(d.id); }}
        onTransitionEnd={() => {}}>
        <div className="titlebar"><Px src={A.sys('help')} size={16} className="ticon" /><span className="ttext">{d.title}</span>
          <button className="wbtn" aria-label="Close" onClick={() => choose(btns.find((b) => b.cancel) || btns[btns.length - 1])}><span className="g close" /></button></div>
        <div className="dlg-body">
          {icon && <Px src={A.status(icon)} size={32} className="dlg-icon" />}
          <div className="dlg-text">{d.text && <p>{d.text}</p>}{d.children}</div>
        </div>
        <div className="dlg-btns">
          {btns.map((b) => <Button key={b.value} def={b.def} className={pressed === b.value ? 'pressed' : ''} onClick={() => choose(b)} sound={false}>{b.label}</Button>)}
        </div>
        {d.closing && <CloseFallback id={d.id} remove={remove} />}
      </div>
    </div>
  );
}
// guarantee removal even if animations are disabled (reduced motion)
function CloseFallback({ id, remove }) { useEffect(() => { const t = setTimeout(() => remove(id), 220); return () => clearTimeout(t); }, [id, remove]); return null; }

function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef(); const [pos, setPos] = useState({ x, y }); const [hi, setHi] = useState(-1);
  useLayoutEffect(() => {
    const r = ref.current.getBoundingClientRect();
    setPos({ x: Math.min(x, window.innerWidth - r.width - 2), y: Math.min(y, window.innerHeight - r.height - 2) });
    ref.current.focus();
  }, [x, y]);
  useEffect(() => {
    const down = (e) => { if (!ref.current || !ref.current.contains(e.target)) onClose(); };
    window.addEventListener('mousedown', down, true); window.addEventListener('blur', onClose);
    return () => { window.removeEventListener('mousedown', down, true); window.removeEventListener('blur', onClose); };
  }, [onClose]);
  const act = items.filter((i) => !i.sep && !i.disabled);
  const run = (it) => { onClose(); audio.play('click'); it.onClick && it.onClick(); };
  const onKey = (e) => {
    if (e.key === 'Escape') { onClose(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => (h + 1) % act.length); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => (h - 1 + act.length) % act.length); }
    if (e.key === 'Enter' && hi >= 0) run(act[hi]);
  };
  return (
    <div ref={ref} className="ctxmenu" role="menu" tabIndex={-1} style={{ left: pos.x, top: pos.y }} onKeyDown={onKey} onContextMenu={(e) => e.preventDefault()}>
      {items.map((it, i) => it.sep ? <div key={i} className="msep" /> : (
        <button key={i} role="menuitem" className={`mrow ${it.disabled ? 'disabled' : ''} ${act[hi] === it ? 'hi' : ''}`} disabled={it.disabled}
          onMouseEnter={() => setHi(act.indexOf(it))} onClick={() => run(it)}>
          <span className="micon">{it.icon && <Px src={it.icon} size={16} />}</span><span>{it.label}</span>
        </button>
      ))}
    </div>
  );
}
