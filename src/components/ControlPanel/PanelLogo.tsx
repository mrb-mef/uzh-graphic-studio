import type { LogoVariant } from '../../types';
import styles from './panels.module.css';

interface Props {
  variant: LogoVariant;
  onChange: (v: LogoVariant) => void;
}

const VARIANTS: { value: LogoVariant; label: string }[] = [
  { value: 'standard', label: 'Standard (Blue)' },
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
];

export default function PanelLogo({ variant, onChange }: Props) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Logo Variant</h3>
      <div className={styles.buttonRow}>
        {VARIANTS.map((v) => (
          <button
            key={v.value}
            className={`${styles.chipBtn} ${variant === v.value ? styles.chipBtnActive : ''}`}
            onClick={() => onChange(v.value)}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
