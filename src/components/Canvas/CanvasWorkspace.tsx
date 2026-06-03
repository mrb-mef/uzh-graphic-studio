import { useState } from 'react';
import type { DesignState, ZoneId, FormatId } from '../../types';
import { OUTPUT_FORMATS } from '../../data/formats';
import TemplateCanvas from './TemplateCanvas';
import styles from './CanvasWorkspace.module.css';

interface Props {
  state: DesignState;
  onZoneClick: (zone: ZoneId) => void;
  onRegisterCanvas: (id: FormatId, el: HTMLElement | null) => void;
}

const PREVIEW_WIDTH = 320;

export default function CanvasWorkspace({ state, onZoneClick, onRegisterCanvas }: Props) {
  const [zoomFactor, setZoomFactor] = useState(1.0);

  const activeFormats = OUTPUT_FORMATS.filter((f) =>
    state.activeFormatIds.includes(f.id),
  );

  const handleZoomOut = () => {
    setZoomFactor((prev) => Math.max(prev - 0.25, 0.25));
  };

  const handleZoomIn = () => {
    setZoomFactor((prev) => Math.min(prev + 0.25, 3.0));
  };

  const handleReset = () => {
    setZoomFactor(1.0);
  };

  return (
    <div className={styles.workspace}>
      {/* Zoom Controls */}
      <div className={styles.zoomContainer}>
        <div className={styles.zoomToolbar}>
          <button
            onClick={handleZoomOut}
            className={styles.zoomBtn}
            disabled={zoomFactor <= 0.25}
            title="Zoom Out (-25%)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          
          <button
            onClick={handleReset}
            className={styles.zoomResetBtn}
            title="Reset Zoom (100%)"
          >
            <span className={styles.zoomLabel}>{Math.round(zoomFactor * 100)}%</span>
            <svg className={styles.resetIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
          </button>

          <button
            onClick={handleZoomIn}
            className={styles.zoomBtn}
            disabled={zoomFactor >= 3.0}
            title="Zoom In (+25%)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.row}>
        {activeFormats.map((fmt) => {
          const scale = (PREVIEW_WIDTH / fmt.widthPx) * zoomFactor;
          return (
            <div key={fmt.id} className={styles.canvasSlot}>
              <div className={styles.formatLabel}>{fmt.label}</div>
              <TemplateCanvas
                ref={(el) => onRegisterCanvas(fmt.id, el)}
                state={state}
                formatId={fmt.id}
                onZoneClick={onZoneClick}
                scale={scale}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
