import Mail from '../apps/Mail.jsx';
import Browser from '../apps/Browser.jsx';
import LinkInspector from '../apps/LinkInspector.jsx';
import SecurityCenter from '../apps/SecurityCenter.jsx';
import Files from '../apps/Files.jsx';
import { Notes, Viewer } from '../apps/Notes.jsx';
import Calculator from '../apps/Calculator.jsx';
import { Downloads } from '../apps/Downloads.jsx';
import Terminal from '../apps/Terminal.jsx';
import LearningDashboard from '../apps/LearningDashboard.jsx';
import Academy from '../apps/Academy.jsx';
import Directory from '../apps/Directory.jsx';
import { Help, Settings, SystemProperties } from '../apps/Utilities.jsx';
import { Debrief, Summary } from '../apps/Debrief.jsx';

export const REGISTRY = {
  mail: Mail,
  browser: Browser,
  inspector: LinkInspector,
  security: SecurityCenter,
  files: Files,
  notes: Notes,
  viewer: Viewer,
  calculator: Calculator,
  downloads: Downloads,
  terminal: Terminal,
  dashboard: LearningDashboard,
  academy: Academy,
  directory: Directory,
  help: Help,
  settings: Settings,
  sysprops: SystemProperties,
  debrief: Debrief,
  summary: Summary,
};
