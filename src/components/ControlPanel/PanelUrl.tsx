import styles from './panels.module.css';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function PanelUrl({ value, onChange }: Props) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>URL / QR Code</h3>
      <input
        className={styles.input}
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://www.uzh.ch/..."
      />
      <p className={styles.hint}>A QR code will be generated automatically.</p>
    </div>
  );
}
