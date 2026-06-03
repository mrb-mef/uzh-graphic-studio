import { FACULTIES } from '../../data/templates';
import styles from './panels.module.css';

interface Props {
  orgUnit: string;
  orgUnitCustom: string;
  useCustom: boolean;
  onOrgUnitChange: (v: string) => void;
  onCustomChange: (v: string) => void;
  onToggleCustom: (v: boolean) => void;
}

export default function PanelOrgUnit({
  orgUnit,
  orgUnitCustom,
  useCustom,
  onOrgUnitChange,
  onCustomChange,
  onToggleCustom,
}: Props) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Organisational Unit</h3>

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={useCustom}
          onChange={(e) => onToggleCustom(e.target.checked)}
        />
        Custom name
      </label>

      {useCustom ? (
        <input
          className={styles.input}
          type="text"
          value={orgUnitCustom}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="e.g. Institute of Biochemistry"
        />
      ) : (
        <select
          className={styles.select}
          value={orgUnit}
          onChange={(e) => onOrgUnitChange(e.target.value)}
        >
          {FACULTIES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      )}
    </div>
  );
}
