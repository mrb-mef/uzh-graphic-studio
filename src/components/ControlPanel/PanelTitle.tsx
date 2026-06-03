import styles from './panels.module.css';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function PanelTitle({ value, onChange }: Props) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Title</h3>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="Enter your event title..."
      />
      <p className={styles.hint}>Click the AI button below to generate suggestions.</p>
    </div>
  );
}
