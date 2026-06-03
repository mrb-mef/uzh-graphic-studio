import type { ColorSwatch } from '../types';

export const UZH_PALETTE = {
  blue:   ['#0028A5', '#BDC9E8', '#7596FF', '#3062FF', '#001E7C', '#001452'],
  cyan:   ['#4AC9E3', '#DBF4F9', '#B7E9F4', '#92DFEE', '#1EA7C4', '#147082'],
  apple:  ['#A4D233', '#ECF6D6', '#DBEDAD', '#C8E485', '#7CA023', '#536B18'],
  gold:   ['#FFC845', '#FFF4DA', '#FFE9B5', '#FFDE8F', '#F3AB00', '#A27200'],
  orange: ['#FC4C02', '#FFDBCC', '#FEB799', '#FE9367', '#BD3902', '#7E2601'],
  berry:  ['#BF0D3E', '#FBC6D4', '#F78CAA', '#F3537F', '#8F0A2E', '#60061F'],
  grey:   ['#000000', '#666666', '#C2C2C2', '#A3A3A3', '#4D4D4D', '#333333'],
  lgrey:  ['#FFFFFF', '#FAFAFA', '#EFEFEF', '#E7E7E7', '#E0E0E0', '#D7D7D7'],
} as const;

export const COLOR_SWATCHES: ColorSwatch[] = [
  {
    id: 'white',
    label: 'Black & White',
    background: '#FFFFFF',
    accent: '#000000',
    textPrimary: '#000000',
    textSecondary: '#000000',
    logoVariantHint: 'standard',
  },
  {
    id: 'blue',
    label: 'UZH Blue',
    background: '#0028A5',
    accent: '#FFFFFF',
    textPrimary: '#FFFFFF',
    textSecondary: '#BDC9E8',
    logoVariantHint: 'white',
  },
  {
    id: 'black',
    label: 'Dark',
    background: '#000000',
    accent: '#0028A5',
    textPrimary: '#FFFFFF',
    textSecondary: '#C2C2C2',
    logoVariantHint: 'white',
  },
  {
    id: 'cyan',
    label: 'Cyan',
    background: '#4AC9E3',
    accent: '#0028A5',
    textPrimary: '#000000',
    textSecondary: '#147082',
    logoVariantHint: 'standard',
  },
  {
    id: 'apple',
    label: 'Apple',
    background: '#A4D233',
    accent: '#0028A5',
    textPrimary: '#000000',
    textSecondary: '#536B18',
    logoVariantHint: 'standard',
  },
  {
    id: 'gold',
    label: 'Gold',
    background: '#FFC845',
    accent: '#0028A5',
    textPrimary: '#000000',
    textSecondary: '#A27200',
    logoVariantHint: 'standard',
  },
  {
    id: 'orange',
    label: 'Orange',
    background: '#FC4C02',
    accent: '#FFFFFF',
    textPrimary: '#FFFFFF',
    textSecondary: '#FFDBCC',
    logoVariantHint: 'white',
  },
  {
    id: 'berry',
    label: 'Berry',
    background: '#BF0D3E',
    accent: '#FFFFFF',
    textPrimary: '#FFFFFF',
    textSecondary: '#FBC6D4',
    logoVariantHint: 'white',
  },
];

export function getSwatchById(id: string): ColorSwatch {
  return COLOR_SWATCHES.find((s) => s.id === id) ?? COLOR_SWATCHES[0];
}
