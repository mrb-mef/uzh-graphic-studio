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
      const showFooter = !!state.url;
      if (!showFooter) return null;

      return zone('url', styles.footer, (
        <div className={styles.footerInner}>
          <span className={styles.urlText} style={{ color: swatch.textSecondary }}>
            {state.url}
          </span>
        </div>
      ));
    };

    // Step 3.3 styles
    const imageStyle: React.CSSProperties = {
      transform: `scale(${state.imageZoom}) translate(${state.imageOffsetX}px, ${state.imageOffsetY}px)`,
      transformOrigin: 'center center',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transition: 'transform 0.05s ease-out',
    };

    const renderGradientOverlay = () => {
      if (fmt.category !== 'social') return null;
      if (!state.gradientEnabled || !state.imageUrl) return null;
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(to bottom, transparent ${state.gradientStart * 100}%, ${state.gradientColor} 100%)`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      );
    };

    // Step 3.5 styles
    const glowStyle: React.CSSProperties = state.textGlow
      ? { textShadow: '0 0 10px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.9)' }
      : {};

    const overlayTextColor = getOverlayTextColor(swatch);

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
            '--font-size-multiplier': state.fontSizeMultiplier,
            '--social-font-size-multiplier': state.socialFontSizeMultiplier,
          } as React.CSSProperties}
        >
          {/* Header bar - hidden for social templates */}
          {fmt.category !== 'social' && (
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
          )}

          {/* Layout body components */}
          {fmt.category === 'social' ? (
            <SocialBody
              state={state}
              swatch={swatch}
              zone={zone}
              renderFooter={renderFooter}
              imageStyle={imageStyle}
              renderGradientOverlay={renderGradientOverlay}
              glowStyle={glowStyle}
            />
          ) : (
            <>
              {state.presetId === 'layout-1' && (
                <Layout1Body
                  state={state}
                  swatch={swatch}
                  zone={zone}
                  formatId={formatId}
                  renderFooter={renderFooter}
                  imageStyle={imageStyle}
                  renderGradientOverlay={renderGradientOverlay}
                  glowStyle={glowStyle}
                  overlayTextColor={overlayTextColor}
                />
              )}
              {state.presetId === 'layout-2' && (
                <Layout2Body
                  state={state}
                  swatch={swatch}
                  zone={zone}
                  renderFooter={renderFooter}
                  imageStyle={imageStyle}
                  renderGradientOverlay={renderGradientOverlay}
                  glowStyle={glowStyle}
                />
              )}
              {state.presetId === 'layout-3' && (
                <Layout3Body
                  state={state}
                  swatch={swatch}
                  zone={zone}
                  renderFooter={renderFooter}
                  imageStyle={imageStyle}
                  renderGradientOverlay={renderGradientOverlay}
                  glowStyle={glowStyle}
                />
              )}
              {state.presetId === 'layout-4' && (
                <Layout4Body
                  state={state}
                  swatch={swatch}
                  zone={zone}
                  renderFooter={renderFooter}
                  imageStyle={imageStyle}
                  renderGradientOverlay={renderGradientOverlay}
                  glowStyle={glowStyle}
                />
              )}
            </>
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
  imageStyle: React.CSSProperties;
  renderGradientOverlay: () => ReactNode;
  glowStyle: React.CSSProperties;
  overlayTextColor?: string;
}

function Layout1Body({
  state,
  swatch,
  zone,
  renderFooter,
  imageStyle,
  renderGradientOverlay,
  glowStyle,
  overlayTextColor,
}: LayoutProps) {
  const showFooter = !!state.url;
  const titleColor = state.textColor === '#ffffff' ? (overlayTextColor || '#000') : state.textColor;

  return (
    <div className={styles.layout1Body}>
      {/* Main Image field (Grey Field) */}
      {zone('image', `${styles.layout1ImageZone} ${showFooter ? styles.layout1ImageZoneWithFooter : ''}`, (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          {state.imageUrl ? (
            <img src={state.imageUrl} alt="" style={imageStyle} />
          ) : (
            <div
              className={styles.imagePlaceholder}
              style={{ backgroundColor: swatch.accent + '22', width: '100%', height: '100%' }}
            />
          )}
          {renderGradientOverlay()}
          {state.imageUrl && state.imageCredit && (
            <span
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                fontSize: '12px',
                color: state.textColor,
                zIndex: 2,
                opacity: 0.8,
                pointerEvents: 'none',
              }}
            >
              {state.imageCredit}
            </span>
          )}
        </div>
      ))}

      {/* White text overlay box */}
      <div className={styles.layout1TextOverlay}>
        {zone('title', styles.titleZone, (
          <h1 className={styles.layout1Title} style={{ color: titleColor, ...glowStyle }}>
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

function Layout2Body({
  state,
  swatch,
  zone,
  renderFooter,
  imageStyle,
  renderGradientOverlay,
  glowStyle,
}: LayoutProps) {
  const defaultTitleColor = getTextBoxTextColor(swatch);
  const titleColor = state.textColor === '#ffffff' ? defaultTitleColor : state.textColor;

  return (
    <div className={styles.body}>
      <div className={styles.twoCol}>
        <div className={styles.textBoxFull}>
          <div className={styles.textBoxInner} style={{ backgroundColor: swatch.accent }}>
            {zone('title', styles.titleZone, (
              <p className={styles.title} style={{ color: titleColor, ...glowStyle }}>{state.title}</p>
            ))}
            {zone('boxText', styles.boxTextZone, (
              <p className={styles.boxText} style={{ color: getTextBoxTextColor(swatch) }}>{state.boxText}</p>
            ))}
          </div>
        </div>
        {zone('image', styles.imageSideFull, (
          <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {state.imageUrl ? (
              <img src={state.imageUrl} alt="" style={imageStyle} />
            ) : (
              <div
                className={styles.imagePlaceholder}
                style={{ backgroundColor: swatch.accent + '33', width: '100%', height: '100%' }}
              />
            )}
            {renderGradientOverlay()}
            {state.imageUrl && state.imageCredit && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  fontSize: '12px',
                  color: state.textColor,
                  zIndex: 2,
                  opacity: 0.8,
                  pointerEvents: 'none',
                }}
              >
                {state.imageCredit}
              </span>
            )}
          </div>
        ))}
      </div>
      {renderFooter()}
    </div>
  );
}

function Layout3Body({
  state,
  swatch,
  zone,
  renderFooter,
  imageStyle,
  renderGradientOverlay,
  glowStyle,
}: LayoutProps) {
  return (
    <div className={styles.body} style={{ position: 'relative' }}>
      {zone('image', styles.imageFullBleed, (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          {state.imageUrl ? (
            <img src={state.imageUrl} alt="" style={imageStyle} />
          ) : (
            <div
              className={styles.imagePlaceholder}
              style={{ backgroundColor: swatch.accent + '44', width: '100%', height: '100%' }}
            />
          )}
          {renderGradientOverlay()}
          {state.imageUrl && state.imageCredit && (
            <span
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                fontSize: '12px',
                color: state.textColor,
                zIndex: 2,
                opacity: 0.8,
                pointerEvents: 'none',
              }}
            >
              {state.imageCredit}
            </span>
          )}
        </div>
      ))}
      <div className={styles.textOverlay}>
        {zone('title', styles.titleZone, (
          <p className={styles.titleLarge} style={{ color: state.textColor, ...glowStyle }}>{state.title}</p>
        ))}
        {zone('boxText', styles.boxTextZone, (
          <p className={styles.boxText} style={{ color: '#FFFFFF' }}>{state.boxText}</p>
        ))}
      </div>
      {renderFooter()}
    </div>
  );
}

function Layout4Body({
  state,
  swatch,
  zone,
  renderFooter,
  imageStyle,
  renderGradientOverlay,
  glowStyle,
}: LayoutProps) {
  const titleColor = state.textColor === '#ffffff' ? swatch.accent : state.textColor;

  return (
    <div className={styles.body}>
      <div className={styles.textFocus}>
        <div style={{ width: '100%' }}>
          {zone('title', styles.titleZone, (
            <p className={styles.titleXL} style={{ color: titleColor, ...glowStyle }}>{state.title}</p>
          ))}
          {zone('boxText', styles.boxTextZone, (
            <p className={styles.boxTextLarge} style={{ color: swatch.textPrimary }}>{state.boxText}</p>
          ))}
        </div>
      </div>
      {zone('image', styles.imageStrip, (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          {state.imageUrl ? (
            <img src={state.imageUrl} alt="" style={imageStyle} />
          ) : (
            <div
              className={styles.imagePlaceholder}
              style={{ backgroundColor: swatch.accent + '33', width: '100%', height: '100%' }}
            />
          )}
          {renderGradientOverlay()}
          {state.imageUrl && state.imageCredit && (
            <span
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                fontSize: '12px',
                color: state.textColor,
                zIndex: 2,
                opacity: 0.8,
                pointerEvents: 'none',
              }}
            >
              {state.imageCredit}
            </span>
          )}
        </div>
      ))}
      {renderFooter()}
    </div>
  );
}

function SocialBody({
  state,
  swatch,
  zone,
  imageStyle,
  renderGradientOverlay,
  glowStyle,
}: LayoutProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Background Image (Edge to Edge / Full Bleed) */}
      {zone('image', styles.imageFullBleed, (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          {state.imageUrl ? (
            <img src={state.imageUrl} alt="" style={imageStyle} />
          ) : (
            <div
              className={styles.imagePlaceholder}
              style={{ backgroundColor: swatch.accent + '22', width: '100%', height: '100%' }}
            />
          )}
          {renderGradientOverlay()}
          
          {/* Image Credit */}
          {state.imageUrl && state.imageCredit && (
            <span
              style={{
                position: 'absolute',
                bottom: 'calc(var(--canvas-height) * 0.0133 * 1px)',
                right: 'calc(var(--canvas-width) * 0.0222 * 1px)',
                fontSize: 'calc(var(--canvas-width) * 0.0222 * 1px)',
                color: state.textColor,
                zIndex: 2,
                opacity: 0.8,
                pointerEvents: 'none',
              }}
            >
              {state.imageCredit}
            </span>
          )}
        </div>
      ))}

      {/* Text Overlay (Headline with shadow/glow) */}
      <div
        style={{
          position: 'absolute',
          bottom: 'calc(var(--canvas-height) * 0.0740 * 1px)',
          left: 'calc(var(--canvas-width) * 0.0926 * 1px)',
          right: 'calc(var(--canvas-width) * 0.0926 * 1px)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {zone('title', styles.titleZone, (
          <h1
            style={{
              margin: 0,
              fontSize: 'calc(var(--canvas-width) * 0.0778 * var(--social-font-size-multiplier, 1) * 1px)',
              fontWeight: 700,
              lineHeight: 1.08,
              color: state.textColor,
              pointerEvents: 'auto',
              whiteSpace: 'pre-wrap',
              ...glowStyle,
            }}
          >
            {state.socialTitle || 'Your Event Title'}
          </h1>
        ))}
      </div>
    </div>
  );
}

