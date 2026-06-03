export type FormatId = 'a4' | 'a5' | 'a3' | 'a0' | 'sq' | 'port' | 'story' | 'screen';

export type FormatCategory = 'print' | 'social' | 'digital';

export interface OutputFormat {
  id: FormatId;
  label: string;
  widthPx: number;
  heightPx: number;
  category: FormatCategory;
}

export type LogoVariant = 'standard' | 'white' | 'black';

export type FontWeight = 400 | 600 | 700;

export interface ColorSwatch {
  id: string;
  label: string;
  background: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  logoVariantHint: LogoVariant;
}

export interface DesignPreset {
  id: string;
  label: string;
  description: string;
}

export interface DesignState {
  presetId: string;
  title: string;
  boxText: string;
  orgUnit: string;
  orgUnitCustom: string;
  useCustomOrgUnit: boolean;
  imageUrl: string | null;
  imageCredit: string | null;
  logoVariant: LogoVariant;
  colorSwatchId: string;
  fontWeight: FontWeight;
  url: string;
  activeFormatIds: FormatId[];
}

export type ZoneId =
  | 'logo'
  | 'orgUnit'
  | 'title'
  | 'boxText'
  | 'image'
  | 'url'
  | 'qr';

export interface ImageSearchResult {
  id: string;
  thumbUrl: string;
  fullUrl: string;
  credit: string;
  source: 'unsplash' | 'wikimedia' | 'upload';
}

export interface AIAssistPayload {
  zone: 'title' | 'boxText';
  currentValue: string;
  context: string;
}
