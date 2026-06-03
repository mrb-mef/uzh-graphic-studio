export const FONT_FACE_CSS = `
@font-face {
  font-family: 'Source Sans Pro';
  src: url('/fonts/SourceSansPro-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Source Sans Pro';
  src: url('/fonts/SourceSansPro-Italic.ttf') format('truetype');
  font-weight: 400;
  font-style: italic;
}
@font-face {
  font-family: 'Source Sans Pro';
  src: url('/fonts/SourceSansPro-SemiBold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
}
@font-face {
  font-family: 'Source Sans Pro';
  src: url('/fonts/SourceSansPro-SemiBoldItalic.ttf') format('truetype');
  font-weight: 600;
  font-style: italic;
}
@font-face {
  font-family: 'Source Sans Pro';
  src: url('/fonts/SourceSansPro-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: 'Source Sans Pro';
  src: url('/fonts/SourceSansPro-BoldItalic.ttf') format('truetype');
  font-weight: 700;
  font-style: italic;
}
`.trim();

export const FONT_WEIGHTS = [
  { value: 400, label: 'Regular' },
  { value: 600, label: 'SemiBold' },
  { value: 700, label: 'Bold' },
] as const;
