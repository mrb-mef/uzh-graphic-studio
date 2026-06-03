import type { OutputFormat, FormatId } from '../types';

export const OUTPUT_FORMATS: OutputFormat[] = [
  { id: 'a4',     label: 'A4 Flyer',        widthPx: 2480,  heightPx: 3508,  category: 'print' },
  { id: 'a5',     label: 'A5 Flyer',        widthPx: 1748,  heightPx: 2480,  category: 'print' },
  { id: 'a3',     label: 'A3 Poster',       widthPx: 3508,  heightPx: 4961,  category: 'print' },
  { id: 'a0',     label: 'A0 Poster',       widthPx: 9933,  heightPx: 14043, category: 'print' },
  { id: 'sq',     label: 'Social Square',   widthPx: 1080,  heightPx: 1080,  category: 'social' },
  { id: 'port',   label: 'Social Portrait', widthPx: 1080,  heightPx: 1350,  category: 'social' },
  { id: 'story',  label: 'Story',           widthPx: 1080,  heightPx: 1920,  category: 'social' },
  { id: 'screen', label: 'Screen 16:9',     widthPx: 1920,  heightPx: 1080,  category: 'digital' },
];

export const DEFAULT_FORMAT_IDS: FormatId[] = ['a4', 'sq'];

export function getFormatById(id: FormatId): OutputFormat {
  return OUTPUT_FORMATS.find((f) => f.id === id)!;
}

export function formatAspectRatio(fmt: OutputFormat): number {
  return fmt.widthPx / fmt.heightPx;
}
