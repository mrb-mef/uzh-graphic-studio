import { toBlob, toPng } from 'html-to-image';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
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
    throw new Error(`Failed to render format ${formatId} to PNG`);
  }
  return blob;
}

export async function exportFormatAsJpeg(
  el: HTMLElement,
  formatId: FormatId,
): Promise<Blob> {
  const fmt = getFormatById(formatId);
  const blob = await toBlob(el, {
    width: fmt.widthPx,
    height: fmt.heightPx,
    pixelRatio: 1,
    type: 'image/jpeg',
    quality: 0.95,
    style: {
      transform: 'none',
      transformOrigin: 'top left',
      position: 'relative',
      top: '0',
      left: '0',
    },
  });
  if (!blob) {
    throw new Error(`Failed to render format ${formatId} to JPEG`);
  }
  return blob;
}

const PRINT_FORMAT_DIMENSIONS: Record<string, [number, number]> = {
  a4: [210, 297],
  a5: [148, 210],
  a3: [297, 420],
  a0: [841, 1189],
};

export async function exportFormatAsPdf(
  el: HTMLElement,
  formatId: FormatId,
): Promise<Blob> {
  const fmt = getFormatById(formatId);
  const dataUrl = await toPng(el, {
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
  if (!dataUrl) {
    throw new Error(`Failed to render format ${formatId} for PDF`);
  }

  const dims = PRINT_FORMAT_DIMENSIONS[formatId];
  if (dims) {
    const [widthMm, heightMm] = dims;
    const pdf = new jsPDF({
      orientation: widthMm > heightMm ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [widthMm, heightMm],
    });
    pdf.addImage(dataUrl, 'PNG', 0, 0, widthMm, heightMm);
    return pdf.output('blob');
  } else {
    const pdf = new jsPDF({
      orientation: fmt.widthPx > fmt.heightPx ? 'landscape' : 'portrait',
      unit: 'px',
      format: [fmt.widthPx, fmt.heightPx],
      hotfixes: ['px_scaling'],
    });
    pdf.addImage(dataUrl, 'PNG', 0, 0, fmt.widthPx, fmt.heightPx);
    return pdf.output('blob');
  }
}

export async function exportAllAsZip(
  canvasElements: Map<FormatId, HTMLElement>,
): Promise<void> {
  console.log(`Starting ZIP export of ${canvasElements.size} formats...`);
  const zip = new JSZip();

  for (const [formatId, el] of canvasElements.entries()) {
    const fmt = getFormatById(formatId);
    console.log(`Rendering format ${fmt.label} (${formatId})...`);

    if (fmt.category === 'print') {
      // Print options get default PDF download
      const pdfBlob = await exportFormatAsPdf(el, formatId);
      zip.file(`uzh-graphic-${formatId}.pdf`, pdfBlob);
    } else {
      // Social and Digital get PNG and JPEG
      const pngBlob = await exportFormatAsPng(el, formatId);
      zip.file(`uzh-graphic-${formatId}.png`, pngBlob);

      const jpegBlob = await exportFormatAsJpeg(el, formatId);
      zip.file(`uzh-graphic-${formatId}.jpg`, jpegBlob);
    }
  }

  console.log('Generating ZIP file...');
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  
  console.log('Initiating download...');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'uzh-graphic-studio-export.zip';
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  setTimeout(() => {
    URL.revokeObjectURL(url);
    console.log('Export resources cleaned up successfully.');
  }, 1500);
}

