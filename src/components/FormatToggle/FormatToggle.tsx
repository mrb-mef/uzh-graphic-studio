import { OUTPUT_FORMATS } from '../../data/formats';
import type { FormatId } from '../../types';
import styles from './FormatToggle.module.css';

interface Props {
  activeFormatIds: FormatId[];
  onToggle: (id: FormatId) => void;
}

export default function FormatToggle({ activeFormatIds, onToggle }: Props) {
  const categories = ['print', 'social', 'digital'] as const;

  return (
    <div className={styles.bar}>
      {categories.map((cat) => (
        <div key={cat} className={styles.group}>
          <span className={styles.groupLabel}>{cat}</span>
          {OUTPUT_FORMATS.filter((f) => f.category === cat).map((fmt) => {
            const active = activeFormatIds.includes(fmt.id);
            return (
              <button
                key={fmt.id}
                className={`${styles.toggle} ${active ? styles.toggleActive : ''}`}
                onClick={() => onToggle(fmt.id)}
                title={`${fmt.widthPx}×${fmt.heightPx}px`}
              >
                {fmt.label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
