import styles from './panels.module.css';

interface Props {
  onExport: () => void;
  exporting: boolean;
}

export default function PanelExport({ onExport, exporting }: Props) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Export</h3>
      <button
        className={styles.exportBtn}
        onClick={onExport}
        disabled={exporting}
      >
        {exporting ? 'Generating…' : 'Export as .zip (PNG)'}
      </button>
      <p className={styles.hint}>All active formats are exported at full resolution.</p>
    </div>
  );
}
