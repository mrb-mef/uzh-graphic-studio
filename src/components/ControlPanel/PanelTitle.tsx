import type { DesignState } from '../../types';
import styles from './panels.module.css';

interface Props {
  value: string;
  onChange: (v: string) => void;
  state: DesignState;
  onFontSizeMultiplierChange: (v: number) => void;
  onTextGlowChange: (v: boolean) => void;
  onTextColorChange: (v: string) => void;
}

export default function PanelTitle({
  value,
  onChange,
  state,
  onFontSizeMultiplierChange,
  onTextGlowChange,
  onTextColorChange,
}: Props) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Headline (Step 3.5)</h3>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="Enter your event title..."
      />
      <p className={styles.hint}>Click the AI button below to generate suggestions.</p>

      <hr className={styles.dividerSub} />
      <h4 className={styles.sectionTitle} style={{ color: '#0028A5' }}>Text Adjustments</h4>

      <label className={styles.sliderGroup}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span>Font size multiplier</span>
          <strong>{state.fontSizeMultiplier.toFixed(1)}×</strong>
        </div>
        <input
          type="range"
          min="0.5"
          max="2.5"
          step="0.1"
          value={state.fontSizeMultiplier}
          onChange={(e) => onFontSizeMultiplierChange(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </label>

      <div className={styles.checkboxLabel} style={{ marginTop: '8px' }}>
        <input
          type="checkbox"
          id="textGlow"
          checked={state.textGlow}
          onChange={(e) => onTextGlowChange(e.target.checked)}
        />
        <label htmlFor="textGlow" style={{ fontWeight: 600 }}>Enable text shadow / glow (black)</label>
      </div>

      <div className={styles.field} style={{ marginTop: '8px' }}>
        <span style={{ fontSize: '12px' }}>Text color</span>
        <div className={styles.colorPickerWrapper} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
          <input
            type="color"
            value={state.textColor}
            onChange={(e) => onTextColorChange(e.target.value)}
            className={styles.colorPicker}
          />
          <div className={styles.colorPresets} style={{ display: 'flex', gap: '4px' }}>
            {['#ffffff', '#0028A5', '#000000', '#f4f4f4'].map((c) => (
              <button
                key={c}
                type="button"
                className={`${styles.colorPreset} ${state.textColor === c ? styles.colorPresetActive : ''}`}
                style={{
                  backgroundColor: c,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: state.textColor === c ? '2px solid #0028A5' : '1px solid #ccc',
                  cursor: 'pointer',
                }}
                onClick={() => onTextColorChange(c)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
