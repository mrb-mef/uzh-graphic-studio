import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { DesignState, ZoneId } from '../../types';
import { getSwatchById } from '../../data/colors';
import { getFormatById } from '../../data/formats';
// import { generateQRDataURL } from '../../utils/qrcode';
import styles from './TemplateCanvas.module.css';

interface Props {
  state: DesignState;
  formatId: string;
  onZoneClick?: (zone: ZoneId) => void;
  scale?: number;
}

const PREVIEW_WIDTH = 320;

const getTextBoxTextColor = (swatch: ReturnType<typeof getSwatchById>) => {
  return swatch.accent.toUpperCase() === '#FFFFFF' ? swatch.background : '#FFFFFF';
};

const getOverlayTextColor = (swatch: ReturnType<typeof getSwatchById>) => {
  if (swatch.id === 'white') return '#000000'; // Black (Black & White)
  if (swatch.id === 'black') return '#000000'; // Black
  return swatch.background; // The brand colored background (e.g. Cyan, Orange, Apple, Berry)
};

const TemplateCanvas = forwardRef<HTMLDivElement, Props>(
  ({ state, formatId, onZoneClick, scale }, ref) => {
    const fmt = getFormatById(formatId as any);
    const swatch = getSwatchById(state.colorSwatchId);
    // const [qrDataUrl, setQrDataUrl] = useState('');

    // Comment out QR code generation for now
    // useEffect(() => {
    //   generateQRDataURL(state.url).then(setQrDataUrl);
    // }, [state.url]);

    const computedScale = scale ?? PREVIEW_WIDTH / fmt.widthPx;
    const canvasH = fmt.heightPx * computedScale;
    const canvasW = fmt.widthPx * computedScale;

    // Use standard logo for black too, since we apply CSS filter brightness(0) on it
    const logoSrc =
      state.logoVariant === 'white'
        ? '/logos/UZH_Logo_white.svg'
        : '/logos/uzh-logo.svg';

    const logoStyle: React.CSSProperties = {};
    if (state.logoVariant === 'black') {
      logoStyle.filter = 'brightness(0)';
    }

    const orgUnitLabel = state.useCustomOrgUnit
      ? state.orgUnitCustom
      : state.orgUnit;

    const zone = (id: ZoneId, className: string, children: React.ReactNode) => (
      <div
        className={`${styles.zone} ${className}`}
        onClick={() => onZoneClick?.(id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onZoneClick?.(id)}
      >
        {children}
      </div>
    );

    const renderFooter = () => {
      // Comment out the empty URL field placeholder/footer rendering if url is empty per user request
      const showFooter = !!state.url;

      if (!showFooter) return null;

      return zone('url', styles.footer, (
        <div className={styles.footerInner}>
          {/* QR Code commented out for now
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR" className={styles.qrImg} />
          ) : (
            isEditing && (
              <div className={styles.qrImgPlaceholder} style={{ borderColor: swatch.textSecondary }}>
                <span className={styles.qrPlaceholderText} style={{ color: swatch.textSecondary }}>QR</span>
              </div>
            )
          )}
          */}
          <span className={styles.urlText} style={{ color: swatch.textSecondary }}>
            {state.url}
          </span>
        </div>
      ));
    };

    return (
      <div
        className={styles.wrapper}
        style={{ width: canvasW, height: canvasH }}
      >
        <div
          ref={ref}
          className={styles.canvas}
          style={{
            width: fmt.widthPx,
            height: fmt.heightPx,
            transform: `scale(${computedScale})`,
            transformOrigin: 'top left',
            backgroundColor: swatch.background,
            fontFamily: "'Source Sans Pro', sans-serif",
            fontWeight: state.fontWeight,
            color: swatch.textPrimary,
            '--canvas-width': fmt.widthPx,
            '--canvas-height': fmt.heightPx,
          } as React.CSSProperties}
        >
          {/* Header bar */}
          <div
            className={styles.header}
            style={{ backgroundColor: swatch.background }}
          >
            {zone('logo', styles.logoZone, (
              <img src={logoSrc} alt="UZH Logo" className={styles.logoImg} style={logoStyle} />
            ))}
            <div className={styles.headerDivider} style={{ backgroundColor: swatch.accent }} />
            {zone('orgUnit', styles.orgUnitZone, (
              <span className={styles.orgUnitText} style={{ color: swatch.textPrimary }}>{orgUnitLabel}</span>
            ))}
          </div>

          {/* Layout body components */}
          {state.presetId === 'layout-1' && (
            <Layout1Body
              state={state}
              swatch={swatch}
              zone={zone}
              formatId={formatId}
              renderFooter={renderFooter}
            />
          )}
          {state.presetId === 'layout-2' && (
            <Layout2Body
              state={state}
              swatch={swatch}
              zone={zone}
              renderFooter={renderFooter}
            />
          )}
          {state.presetId === 'layout-3' && (
            <Layout3Body
              state={state}
              swatch={swatch}
              zone={zone}
              renderFooter={renderFooter}
            />
          )}
          {state.presetId === 'layout-4' && (
            <Layout4Body
              state={state}
              swatch={swatch}
              zone={zone}
              renderFooter={renderFooter}
            />
          )}
        </div>
      </div>
    );
  },
);

TemplateCanvas.displayName = 'TemplateCanvas';
export default TemplateCanvas;

// ——— Layout sub-components ———

type ZoneFn = (id: ZoneId, className: string, children: ReactNode) => JSX.Element;

interface LayoutProps {
  state: DesignState;
  swatch: ReturnType<typeof getSwatchById>;
  zone: ZoneFn;
  formatId?: string;
  renderFooter: () => ReactNode;
}

function Layout1Body({ state, swatch, zone, renderFooter }: LayoutProps) {
  const overlayTextColor = getOverlayTextColor(swatch);
  const showFooter = !!state.url;

  return (
    <div className={styles.layout1Body}>
      {/* Main Image field (Grey Field) */}
      {zone('image', `${styles.layout1ImageZone} ${showFooter ? styles.layout1ImageZoneWithFooter : ''}`, (
        state.imageUrl ? (
          <img src={state.imageUrl} alt="" className={styles.fillImg} />
        ) : (
          <div
            className={styles.imagePlaceholder}
            style={{ backgroundColor: swatch.accent + '22' }}
          />
        )
      ))}

      {/* White text overlay box */}
      <div className={styles.layout1TextOverlay}>
        {zone('title', styles.titleZone, (
          <h1 className={styles.layout1Title} style={{ color: overlayTextColor }}>
            {state.title || 'Haupttitel'}
          </h1>
        ))}
        {zone('boxText', styles.boxTextZone, (
          <p className={styles.layout1Subtitle} style={{ color: swatch.textSecondary }}>
            {state.boxText || 'Untertitel'}
          </p>
        ))}
      </div>

      {/* Footer (URL and QR) */}
      {renderFooter()}
    </div>
  );
}

function Layout2Body({ state, swatch, zone, renderFooter }: LayoutProps) {
  return (
    <div className={styles.body}>
      <div className={styles.twoCol}>
        <div className={styles.textBoxFull}>
          <div className={styles.textBoxInner} style={{ backgroundColor: swatch.accent }}>
            {zone('title', styles.titleZone, (
              <p className={styles.title} style={{ color: getTextBoxTextColor(swatch) }}>{state.title}</p>
            ))}
            {zone('boxText', styles.boxTextZone, (
              <p className={styles.boxText} style={{ color: getTextBoxTextColor(swatch) }}>{state.boxText}</p>
            ))}
          </div>
        </div>
        {zone('image', styles.imageSideFull, (
          state.imageUrl
            ? <img src={state.imageUrl} alt="" className={styles.fillImg} />
            : <div className={styles.imagePlaceholder} style={{ backgroundColor: swatch.accent + '33' }} />
        ))}
      </div>
      {renderFooter()}
    </div>
  );
}

function Layout3Body({ state, swatch, zone, renderFooter }: LayoutProps) {
  return (
    <div className={styles.body} style={{ position: 'relative' }}>
      {zone('image', styles.imageFullBleed, (
        state.imageUrl
          ? <img src={state.imageUrl} alt="" className={styles.fillImg} />
          : <div className={styles.imagePlaceholder} style={{ backgroundColor: swatch.accent + '44' }} />
      ))}
      <div className={styles.textOverlay}>
        {zone('title', styles.titleZone, (
          <p className={styles.titleLarge}>{state.title}</p>
        ))}
        {zone('boxText', styles.boxTextZone, (
          <p className={styles.boxText} style={{ color: '#FFFFFF' }}>{state.boxText}</p>
        ))}
      </div>
      {renderFooter()}
    </div>
  );
}

function Layout4Body({ state, swatch, zone, renderFooter }: LayoutProps) {
  return (
    <div className={styles.body}>
      <div className={styles.textFocus}>
        <div style={{ width: '100%' }}>
          {zone('title', styles.titleZone, (
            <p className={styles.titleXL} style={{ color: swatch.accent }}>{state.title}</p>
          ))}
          {zone('boxText', styles.boxTextZone, (
            <p className={styles.boxTextLarge} style={{ color: swatch.textPrimary }}>{state.boxText}</p>
          ))}
        </div>
      </div>
      {zone('image', styles.imageStrip, (
        state.imageUrl
          ? <img src={state.imageUrl} alt="" className={styles.fillImg} />
          : <div className={styles.imagePlaceholder} style={{ backgroundColor: swatch.accent + '33' }} />
      ))}
      {renderFooter()}
    </div>
  );
}
