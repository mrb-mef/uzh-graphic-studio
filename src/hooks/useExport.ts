import { useRef, useCallback, useState } from 'react';
import type { FormatId } from '../types';
import { exportAllAsZip } from '../utils/export';

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

  return { registerCanvas, exportAll, exporting, error };
}
