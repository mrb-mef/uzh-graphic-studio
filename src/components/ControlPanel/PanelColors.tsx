import { COLOR_SWATCHES } from '../../data/colors';
import styles from './panels.module.css';

interface Props {
  swatchId: string;
  onChange: (id: string) => void;
}

export default function PanelColors({ swatchId, onChange }: Props) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Colours</h3>
      <div className={styles.swatchGrid}>
        {COLOR_SWATCHES.map((s) => (
          <button
            key={s.id}
            className={`${styles.swatchBtn} ${swatchId === s.id ? styles.swatchBtnActive : ''}`}
            onClick={() => onChange(s.id)}
            title={s.label}
          >
            <span className={styles.swatchDot} style={{ background: s.background, border: '1px solid #ccc' }} />
            <span className={styles.swatchDot} style={{ background: s.accent }} />
            <span className={styles.swatchLabel}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
