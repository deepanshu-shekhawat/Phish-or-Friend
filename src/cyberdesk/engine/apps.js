import { A } from './assets.js';

// Window defaults for every app. Components are registered separately (os/registry.jsx).
export const APPS = {
  mission: { title: 'Mission Brief', icon: ['app', 'mission'], w: 460, h: 400, single: true },
  mail: { title: 'CyberMail', icon: ['app', 'mail'], w: 880, h: 560, single: true },
  browser: { title: 'CyberSurf', icon: ['app', 'browser'], w: 880, h: 560, single: true },
  inspector: { title: 'Link Inspector', icon: ['app', 'inspector'], w: 600, h: 530, single: true },
  security: { title: 'Security Center', icon: ['app', 'security'], w: 720, h: 540, single: true },
  files: { title: 'Files', icon: ['app', 'files'], w: 660, h: 440 },
  notes: { title: 'Notes', icon: ['app', 'notes'], w: 470, h: 360 },
  calculator: { title: 'Calculator', icon: ['app', 'calculator'], w: 236, h: 322, single: true, fixed: true },
  downloads: { title: 'Download Manager', icon: ['app', 'downloads'], w: 500, h: 320, single: true },
  terminal: { title: 'Interactive Terminal', icon: ['app', 'terminal'], w: 640, h: 430, single: true },
  dashboard: { title: 'Learning Dashboard', icon: ['app', 'mission'], w: 740, h: 550, single: true },
  academy: { title: 'Academy & Tutorial', icon: ['app', 'help'], w: 720, h: 530, single: true },
  directory: { title: 'Campus Directory', icon: ['sys', 'user'], w: 640, h: 460, single: true },
  help: { title: 'CyberDesk Help', icon: ['app', 'help'], w: 660, h: 520, single: true },
  settings: { title: 'Display & Sound Settings', icon: ['app', 'settings'], w: 430, h: 470, single: true, fixed: true },
  sysprops: { title: 'System Properties', icon: ['sys', 'my_computer'], w: 400, h: 460, single: true, fixed: true },
  debrief: { title: 'Investigation Debrief', icon: ['app', 'security'], w: 540, h: 510 },
  summary: { title: 'Session Summary', icon: ['app', 'mission'], w: 540, h: 530, single: true },
  viewer: { title: 'Document Viewer', icon: ['app', 'notes'], w: 480, h: 380 },
};

export const appIcon = (id) => {
  const def = APPS[id] || { icon: ['app', 'help'] };
  const [k, n] = def.icon;
  return k === 'app' ? A.app(n) : A.sys(n);
};

export const DESKTOP_ICONS = [
  { id: 'academy', label: 'Academy', app: 'academy' },
  { id: 'mail', label: 'CyberMail', app: 'mail' },
  { id: 'browser', label: 'CyberSurf', app: 'browser' },
  { id: 'inspector', label: 'Link Inspector', app: 'inspector' },
  { id: 'terminal', label: 'Terminal', app: 'terminal' },
  { id: 'directory', label: 'Directory', app: 'directory' },
  { id: 'security', label: 'Security Center', app: 'security' },
  { id: 'dashboard', label: 'Dashboard', app: 'dashboard' },
  { id: 'files', label: 'Files', app: 'files' },
  { id: 'notes', label: 'Notes', app: 'notes' },
  { id: 'downloads', label: 'Downloads', app: 'downloads' },
  { id: 'mission', label: 'Mission Brief', app: 'mission' },
  { id: 'help', label: 'Help', app: 'help' },
  { id: 'recycle', label: 'Recycle Bin', special: 'recycle' },
];
