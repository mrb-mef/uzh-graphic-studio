import styles from './panels.module.css';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function PanelBoxText({ value, onChange }: Props) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Details Box</h3>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder="Date, time and location&#10;&#10;A short description..."
      />
      <p className={styles.hint}>Use line breaks to separate sections. Supports plain text only.</p>
    </div>
  );
}
