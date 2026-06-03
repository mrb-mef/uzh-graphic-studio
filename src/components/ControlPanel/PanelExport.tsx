import type { FormatId } from '../../types';
import { getFormatById } from '../../data/formats';
import styles from './panels.module.css';

interface Props {
  activeFormatIds: FormatId[];
  onExportAll: () => void;
  onExportSingle: (id: FormatId, type: 'pdf' | 'png' | 'jpeg') => void;
  exporting: boolean;
}

export default function PanelExport({
  activeFormatIds,
  onExportAll,
  onExportSingle,
  exporting,
}: Props) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Export Options</h3>
      
      <div className={styles.individualExports}>
        {activeFormatIds.map((id) => {
          const fmt = getFormatById(id);
          const isPrint = fmt.category === 'print';
          return (
            <div key={id} className={styles.exportItem}>
              <span className={styles.exportLabel}>{fmt.label}</span>
              <div className={styles.exportButtons}>
                {isPrint ? (
                  <button
                    className={styles.singleExportBtn}
                    onClick={() => onExportSingle(id, 'pdf')}
                    disabled={exporting}
                    title={`Download ${fmt.label} as PDF (Default)`}
                  >
                    PDF
                  </button>
                ) : (
                  <>
                    <button
                      className={styles.singleExportBtn}
                      onClick={() => onExportSingle(id, 'png')}
                      disabled={exporting}
                      title={`Download ${fmt.label} as PNG`}
                    >
                      PNG
                    </button>
                    <button
                      className={styles.singleExportBtn}
                      onClick={() => onExportSingle(id, 'jpeg')}
                      disabled={exporting}
                      title={`Download ${fmt.label} as JPEG`}
                    >
                      JPEG
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <hr className={styles.dividerSub} />

      <button
        className={styles.exportBtn}
        onClick={onExportAll}
        disabled={exporting}
      >
        {exporting ? 'Generating…' : 'Export All as .zip'}
      </button>
      <p className={styles.hint}>
        Downloads all active formats (PDF for Print, PNG & JPEG for Social/Digital).
      </p>
    </div>
  );
}

