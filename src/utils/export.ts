import { toBlob } from 'html-to-image';
import JSZip from 'jszip';
import type { FormatId } from '../types';
import { getFormatById } from '../data/formats';

export async function exportFormatAsPng(
  el: HTMLElement,
  formatId: FormatId,
): Promise<Blob> {
  const fmt = getFormatById(formatId);
  const blob = await toBlob(el, {
    width: fmt.widthPx,
    height: fmt.heightPx,
    pixelRatio: 1,
    style: {
      transform: 'none',
      transformOrigin: 'top left',
      position: 'relative',
      top: '0',
      left: '0',
    },
  });
  if (!blob) {
    throw new Error(`Failed to render format ${formatId} to image`);
  }
  return blob;
}

export async function exportAllAsZip(
  canvasElements: Map<FormatId, HTMLElement>,
): Promise<void> {
  console.log(`Starting ZIP export of ${canvasElements.size} formats...`);
  const zip = new JSZip();

  for (const [formatId, el] of canvasElements.entries()) {
    console.log(`Rendering format ${formatId}...`);
    const blob = await exportFormatAsPng(el, formatId);
    zip.file(`uzh-graphic-${formatId}.png`, blob);
  }

  console.log('Generating ZIP file...');
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  
  console.log('Initiating download...');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'uzh-graphic-studio-export.zip';
  
  // Appending to the body is required in Firefox and many other browser configurations
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Delay revocation to ensure the browser has started the download stream
  setTimeout(() => {
    URL.revokeObjectURL(url);
    console.log('Export resources cleaned up successfully.');
  }, 1500);
}
