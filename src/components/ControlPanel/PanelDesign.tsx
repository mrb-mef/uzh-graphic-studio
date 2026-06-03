import { DESIGN_PRESETS } from '../../data/templates';
import { FONT_WEIGHTS } from '../../data/fonts';
import type { FontWeight } from '../../types';
import styles from './panels.module.css';

interface Props {
  presetId: string;
  onPresetChange: (id: string) => void;
  fontWeight: FontWeight;
  onFontWeightChange: (w: FontWeight) => void;
}

export default function PanelDesign({ presetId, onPresetChange, fontWeight, onFontWeightChange }: Props) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Design</h3>
      <div className={styles.presetGrid}>
        {DESIGN_PRESETS.map((p) => (
          <button
            key={p.id}
            className={`${styles.presetBtn} ${presetId === p.id ? styles.presetBtnActive : ''}`}
            onClick={() => onPresetChange(p.id)}
            title={p.description}
          >
            {p.label.split(' — ')[0]}
          </button>
        ))}
      </div>

      <h3 className={styles.sectionTitle} style={{ marginTop: 20 }}>Font Weight</h3>
      <div className={styles.buttonRow}>
        {FONT_WEIGHTS.map((fw) => (
          <button
            key={fw.value}
            className={`${styles.chipBtn} ${fontWeight === fw.value ? styles.chipBtnActive : ''}`}
            onClick={() => onFontWeightChange(fw.value as FontWeight)}
          >
            {fw.label}
          </button>
        ))}
      </div>
    </div>
  );
}
