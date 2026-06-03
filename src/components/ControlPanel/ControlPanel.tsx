import type { DesignState, ZoneId } from '../../types';
import type { useDesignState } from '../../hooks/useDesignState';
import PanelDesign from './PanelDesign';
import PanelColors from './PanelColors';
import PanelTitle from './PanelTitle';
import PanelBoxText from './PanelBoxText';
import PanelOrgUnit from './PanelOrgUnit';
import PanelImage from './PanelImage';
import PanelUrl from './PanelUrl';
import PanelLogo from './PanelLogo';
import PanelExport from './PanelExport';
import PanelAI from './PanelAI';
import styles from './ControlPanel.module.css';

type DesignActions = ReturnType<typeof useDesignState>;

interface Props {
  state: DesignState;
  actions: Omit<DesignActions, 'state'>;
  activeZone: ZoneId | null;
  onZoneClose: () => void;
  onExport: () => void;
  exporting: boolean;
}

export default function ControlPanel({
  state,
  actions,
  activeZone,
  onZoneClose,
  onExport,
  exporting,
}: Props) {
  return (
    <aside className={styles.panel}>
      {activeZone ? (
        <div className={styles.contextPanel}>
          <button className={styles.backBtn} onClick={onZoneClose}>
            ← Back
          </button>
          {activeZone === 'title' && (
            <PanelTitle value={state.title} onChange={actions.setTitle} />
          )}
          {activeZone === 'boxText' && (
            <PanelBoxText value={state.boxText} onChange={actions.setBoxText} />
          )}
          {activeZone === 'orgUnit' && (
            <PanelOrgUnit
              orgUnit={state.orgUnit}
              orgUnitCustom={state.orgUnitCustom}
              useCustom={state.useCustomOrgUnit}
              onOrgUnitChange={actions.setOrgUnit}
              onCustomChange={actions.setOrgUnitCustom}
              onToggleCustom={actions.setUseCustomOrgUnit}
            />
          )}
          {activeZone === 'image' && (
            <PanelImage onImageSelect={actions.setImageUrl} />
          )}
          {activeZone === 'url' && (
            <PanelUrl value={state.url} onChange={actions.setUrl} />
          )}
          {activeZone === 'logo' && (
            <PanelLogo variant={state.logoVariant} onChange={actions.setLogoVariant} />
          )}
          {(activeZone === 'qr') && (
            <PanelUrl value={state.url} onChange={actions.setUrl} />
          )}
        </div>
      ) : (
        <div className={styles.defaultPanel}>
          <PanelDesign
            presetId={state.presetId}
            onPresetChange={actions.setPreset}
            fontWeight={state.fontWeight}
            onFontWeightChange={actions.setFontWeight}
          />
          <hr className={styles.divider} />
          <PanelColors
            swatchId={state.colorSwatchId}
            onChange={actions.setColorSwatch}
          />
          <hr className={styles.divider} />
          <PanelAI state={state} setTitle={actions.setTitle} setBoxText={actions.setBoxText} />
          <hr className={styles.divider} />
          <PanelExport onExport={onExport} exporting={exporting} />
        </div>
      )}
    </aside>
  );
}
