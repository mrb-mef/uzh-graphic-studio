import type { DesignState } from '../../types';
import { getFormatById } from '../../data/formats';
import styles from './panels.module.css';

interface Props {
  value: string;
  onChange: (v: string) => void;
  socialValue: string;
  onSocialChange: (v: string) => void;
  state: DesignState;
  onFontSizeMultiplierChange: (v: number) => void;
  onSocialFontSizeMultiplierChange: (v: number) => void;
  onTextGlowChange: (v: boolean) => void;
  onTextColorChange: (v: string) => void;
}

export default function PanelTitle({
  value,
  onChange,
  socialValue,
  onSocialChange,
  state,
  onFontSizeMultiplierChange,
  onSocialFontSizeMultiplierChange,
  onTextGlowChange,
  onTextColorChange,
}: Props) {
  const hasPrintOrDigital = state.activeFormatIds.some((id) => {
    const fmt = getFormatById(id);
    return fmt.category === 'print' || fmt.category === 'digital';
  });

  const hasSocial = state.activeFormatIds.some((id) => {
    const fmt = getFormatById(id);
    return fmt.category === 'social';
  });

  return (
    <div className={styles.section}>
      {hasPrintOrDigital && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: hasSocial ? '1.5rem' : '0' }}>
          <h3 className={styles.sectionTitle}>Headline (Print & Digital)</h3>
          <textarea
            className={styles.textarea}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            placeholder="Enter print event title..."
          />
          
          <label className={styles.sliderGroup} style={{ marginTop: '4px' }}>
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
        </div>
      )}

      {hasSocial && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 className={styles.sectionTitle}>Headline (Social)</h3>
          <textarea
            className={styles.textarea}
            value={socialValue}
            onChange={(e) => onSocialChange(e.target.value)}
            rows={4}
            placeholder="Enter social post headline..."
          />

          <label className={styles.sliderGroup} style={{ marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span>Font size multiplier</span>
              <strong>{state.socialFontSizeMultiplier.toFixed(1)}×</strong>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={state.socialFontSizeMultiplier}
              onChange={(e) => onSocialFontSizeMultiplierChange(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>
      )}

      <hr className={styles.dividerSub} />
      <h4 className={styles.sectionTitle} style={{ color: '#0028A5' }}>Text Styling</h4>

      <div className={styles.checkboxLabel}>
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
