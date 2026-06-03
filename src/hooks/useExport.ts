import { useRef, useCallback, useState } from 'react';
import type { FormatId } from '../types';
import {
  exportAllAsZip,
  exportFormatAsPng,
  exportFormatAsJpeg,
  exportFormatAsPdf,
} from '../utils/export';

export function useExport() {
  const canvasRefs = useRef<Map<FormatId, HTMLElement>>(new Map());
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerCanvas = useCallback((id: FormatId, el: HTMLElement | null) => {
    if (el) {
      canvasRefs.current.set(id, el);
    } else {
      canvasRefs.current.delete(id);
    }
  }, []);

  const exportAll = useCallback(async () => {
    if (canvasRefs.current.size === 0) return;
    setExporting(true);
    setError(null);
    try {
      await exportAllAsZip(canvasRefs.current);
    } catch (err: any) {
      console.error('Export failed:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setError(errMsg);
      alert('Export failed: ' + errMsg);
    } finally {
      setExporting(false);
    }
  }, []);

  const exportSingle = useCallback(async (id: FormatId, type: 'pdf' | 'png' | 'jpeg') => {
    const el = canvasRefs.current.get(id);
    if (!el) return;
    setExporting(true);
    setError(null);
    try {
      let blob: Blob;
      let extension: string = type;
      if (type === 'pdf') {
        blob = await exportFormatAsPdf(el, id);
      } else if (type === 'jpeg') {
        blob = await exportFormatAsJpeg(el, id);
        extension = 'jpg';
      } else {
        blob = await exportFormatAsPng(el, id);
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `uzh-graphic-${id}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (err: any) {
      console.error(`Export of ${id} failed:`, err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setError(errMsg);
      alert('Export failed: ' + errMsg);
    } finally {
      setExporting(false);
    }
  }, []);

  return { registerCanvas, exportAll, exportSingle, exporting, error };
}

