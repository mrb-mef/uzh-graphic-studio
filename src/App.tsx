import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FormatToggle } from './components/FormatToggle';
import { CanvasWorkspace } from './components/Canvas';
import { ControlPanel } from './components/ControlPanel';
import { useDesignState } from './hooks/useDesignState';
import { useExport } from './hooks/useExport';
import type { ZoneId, FormatId } from './types';
import styles from './App.module.css';

export default function App() {
  const { state, ...actions } = useDesignState();
  const { registerCanvas, exportAll, exportSingle, exporting } = useExport();
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null);

  const handleZoneClick = useCallback((zone: ZoneId) => {
    setActiveZone(zone);
  }, []);

  const handleZoneClose = useCallback(() => {
    setActiveZone(null);
  }, []);

  const handleRegisterCanvas = useCallback(
    (id: FormatId, el: HTMLElement | null) => {
      registerCanvas(id, el);
    },
    [registerCanvas],
  );

  return (
    <div className={styles.app}>
      <Header />
      <FormatToggle
        activeFormatIds={state.activeFormatIds}
        onToggle={actions.toggleFormat}
      />
      <div className={styles.editor}>
        <CanvasWorkspace
          state={state}
          onZoneClick={handleZoneClick}
          onRegisterCanvas={handleRegisterCanvas}
        />
        <ControlPanel
          state={state}
          actions={actions}
          activeZone={activeZone}
          onZoneClose={handleZoneClose}
          onExportAll={exportAll}
          onExportSingle={exportSingle}
          exporting={exporting}
        />
      </div>
    </div>
  );
}
