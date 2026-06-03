import type { DesignPreset } from '../types';

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'layout-1',
    label: 'Layout 1 — Classic',
    description: 'Header + full-width image top + text box left / image right + image bottom',
  },
  {
    id: 'layout-2',
    label: 'Layout 2 — Two Column',
    description: 'Header + two-column content area with text and image side by side',
  },
  {
    id: 'layout-3',
    label: 'Layout 3 — Full Image',
    description: 'Header + full bleed image with text overlay',
  },
  {
    id: 'layout-4',
    label: 'Layout 4 — Text Focus',
    description: 'Header + large title and body text, minimal image',
  },
];

export const FACULTIES: string[] = [
  'Faculty of Theology and the Study of Religion',
  'Faculty of Law',
  'Faculty of Business, Economics and Informatics',
  'Faculty of Medicine',
  'Vetsuisse Faculty',
  'Faculty of Arts and Social Sciences',
  'Faculty of Science',
];

export const DEFAULT_ORG_UNIT = FACULTIES[0];
