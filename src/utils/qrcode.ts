import QRCode from 'qrcode';

export async function generateQRDataURL(url: string): Promise<string> {
  if (!url) return '';
  return QRCode.toDataURL(url, {
    width: 200,
    margin: 1,
    color: { dark: '#000000', light: '#FFFFFF' },
  });
}
