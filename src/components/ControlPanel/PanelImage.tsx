import React, { useState, useRef } from 'react';
import type { DesignState } from '../../types';
import { getSwatchById } from '../../data/colors';
import { getFormatById } from '../../data/formats';
import styles from './panels.module.css';

interface UnsplashPhoto {
  id: string;
  thumb: string;
  full: string;
  credit: string;
}

interface WikiPhoto {
  title: string;
  thumb: string;
  full: string;
}

interface Props {
  state: DesignState;
  onImageSelect: (url: string | null, credit: string | null) => void;
  onImageZoomChange: (v: number) => void;
  onImageOffsetXChange: (v: number) => void;
  onImageOffsetYChange: (v: number) => void;
  onGradientEnabledChange: (v: boolean) => void;
  onGradientStartChange: (v: number) => void;
  onGradientColorChange: (v: string) => void;
  onImageCreditChange: (v: string | null) => void;
  onSocialImageCreditChange: (v: string | null) => void;
}

export default function PanelImage({
  state,
  onImageSelect,
  onImageZoomChange,
  onImageOffsetXChange,
  onImageOffsetYChange,
  onGradientEnabledChange,
  onGradientStartChange,
  onGradientColorChange,
  onImageCreditChange,
  onSocialImageCreditChange,
}: Props) {
  const [tab, setTab] = useState<'upload' | 'unsplash' | 'wikimedia'>('upload');
  const [unsplashQuery, setUnsplashQuery] = useState('');
  const [unsplashResults, setUnsplashResults] = useState<UnsplashPhoto[]>([]);
  const [wikiQuery, setWikiQuery] = useState('');
  const [wikiResults, setWikiResults] = useState<WikiPhoto[]>([]);
  const [searching, setSearching] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onImageSelect(url, null);
  };

  const searchUnsplash = async () => {
    const key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    if (!key || !unsplashQuery) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(unsplashQuery)}&per_page=12&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${key}` } },
      );
      const data = await res.json();
      setUnsplashResults(
        (data.results ?? []).map((p: any) => ({
          id: p.id,
          thumb: p.urls.small,
          full: p.urls.regular,
          credit: `Photo by ${p.user.name} on Unsplash`,
        })),
      );
    } finally {
      setSearching(false);
    }
  };

  const searchWikimedia = async () => {
    if (!wikiQuery) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(wikiQuery)}&srnamespace=6&format=json&origin=*&srlimit=12`,
      );
      const data = await res.json();
      const titles: string[] = (data.query?.search ?? []).map((r: any) => r.title);

      const imgRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${titles.join('|')}&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=200&format=json&origin=*`,
      );
      const imgData = await imgRes.json();
      const pages = Object.values(imgData.query?.pages ?? {}) as any[];
      setWikiResults(
        pages
          .filter((p) => p.imageinfo?.[0]?.url)
          .map((p) => ({
            title: p.title.replace('File:', ''),
            thumb: p.imageinfo[0].thumburl ?? p.imageinfo[0].url,
            full: p.imageinfo[0].url,
          })),
      );
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Image Selection</h3>

      <div className={styles.tabRow}>
        {(['upload', 'unsplash', 'wikimedia'] as const).map((t) => (
          <button
            key={t}
            className={`${styles.tabBtn} ${tab === t ? styles.tabBtnActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'upload' ? 'Upload' : t === 'unsplash' ? 'Unsplash' : 'Wikimedia'}
          </button>
        ))}
      </div>

      {tab === 'upload' && (
        <div className={styles.uploadArea} onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept="image/*" className={styles.hiddenInput} onChange={handleFileChange} />
          <span>Click to upload or drag an image</span>
        </div>
      )}

      {tab === 'unsplash' && (
        <div>
          <div className={styles.searchRow}>
            <input
              className={styles.searchInput}
              value={unsplashQuery}
              onChange={(e) => setUnsplashQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchUnsplash()}
              placeholder="Search Unsplash..."
            />
            <button className={styles.searchBtn} onClick={searchUnsplash} disabled={searching}>
              {searching ? '…' : 'Go'}
            </button>
          </div>
          {!import.meta.env.VITE_UNSPLASH_ACCESS_KEY && (
            <p className={styles.warn}>Set VITE_UNSPLASH_ACCESS_KEY in .env to enable.</p>
          )}
          <div className={styles.photoGrid}>
            {unsplashResults.map((p) => (
              <img
                key={p.id}
                src={p.thumb}
                alt={p.credit}
                className={styles.photoThumb}
                onClick={() => onImageSelect(p.full, p.credit)}
              />
            ))}
          </div>
        </div>
      )}

      {tab === 'wikimedia' && (
        <div>
          <div className={styles.searchRow}>
            <input
              className={styles.searchInput}
              value={wikiQuery}
              onChange={(e) => setWikiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchWikimedia()}
              placeholder="Search Wikimedia Commons..."
            />
            <button className={styles.searchBtn} onClick={searchWikimedia} disabled={searching}>
              {searching ? '…' : 'Go'}
            </button>
          </div>
          <div className={styles.photoGrid}>
            {wikiResults.map((p, i) => (
              <img
                key={i}
                src={p.thumb}
                alt={p.title}
                className={styles.photoThumb}
                onClick={() => onImageSelect(p.full, `Wikimedia Commons: ${p.title}`)}
              />
            ))}
          </div>
        </div>
      )}

      {state.imageUrl && (
        <button className={styles.clearBtn} onClick={() => onImageSelect(null, null)}>
          Remove image
        </button>
      )}

      {state.imageUrl && (
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <hr className={styles.dividerSub} />
          <h4 className={styles.sectionTitle} style={{ color: '#0028A5' }}>Step 3.3: Adjust Image</h4>
          
          <div className={styles.checkboxLabel}>
            <input
              type="checkbox"
              id="gradientEnabled"
              checked={state.gradientEnabled}
              onChange={(e) => onGradientEnabledChange(e.target.checked)}
            />
            <label htmlFor="gradientEnabled" style={{ fontWeight: 600 }}>Enable brand gradient overlay</label>
          </div>

          <label className={styles.sliderGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span>Zoom</span>
              <strong>{state.imageZoom.toFixed(2)}×</strong>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={state.imageZoom}
              onChange={(e) => onImageZoomChange(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>

          <label className={styles.sliderGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span>Horizontal position</span>
              <strong>{Math.round(state.imageOffsetX)}px</strong>
            </div>
            <input
              type="range"
              min="-1000"
              max="1000"
              step="1"
              value={state.imageOffsetX}
              onChange={(e) => onImageOffsetXChange(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>

          <label className={styles.sliderGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span>Vertical position</span>
              <strong>{Math.round(state.imageOffsetY)}px</strong>
            </div>
            <input
              type="range"
              min="-1000"
              max="1000"
              step="1"
              value={state.imageOffsetY}
              onChange={(e) => onImageOffsetYChange(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>

          {state.gradientEnabled && (
            <>
              <label className={styles.sliderGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span>Gradient start</span>
                  <strong>{Math.round(state.gradientStart * 100)}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={state.gradientStart}
                  onChange={(e) => onGradientStartChange(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </label>

              <div className={styles.field}>
                <span style={{ fontSize: '12px' }}>Gradient overlay color</span>
                <div className={styles.colorPickerWrapper} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <input
                    type="color"
                    value={state.gradientColor}
                    onChange={(e) => onGradientColorChange(e.target.value)}
                    className={styles.colorPicker}
                  />
                  <div className={styles.colorPresets} style={{ display: 'flex', gap: '4px' }}>
                    {[
                      getSwatchById(state.colorSwatchId).background,
                      getSwatchById(state.colorSwatchId).accent,
                      getSwatchById(state.colorSwatchId).textPrimary,
                      getSwatchById(state.colorSwatchId).textSecondary,
                    ].map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`${styles.colorPreset} ${state.gradientColor === c ? styles.colorPresetActive : ''}`}
                        style={{
                          backgroundColor: c,
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: state.gradientColor === c ? '2px solid #0028A5' : '1px solid #ccc',
                          cursor: 'pointer',
                        }}
                        onClick={() => onGradientColorChange(c)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          <hr className={styles.dividerSub} />

          {(() => {
            const hasPrintOrDigital = state.activeFormatIds.some((id) => {
              const fmt = getFormatById(id);
              return fmt.category === 'print' || fmt.category === 'digital';
            });

            const hasSocial = state.activeFormatIds.some((id) => {
              const fmt = getFormatById(id);
              return fmt.category === 'social';
            });

            return (
              <>
                {hasPrintOrDigital && (
                  <label className={styles.field} style={{ marginBottom: hasSocial ? '12px' : '0' }}>
                    <span style={{ fontSize: '12px' }}>Optional image credit (Print & Digital)</span>
                    <input
                      type="text"
                      className={styles.input}
                      value={state.imageCredit || ''}
                      onChange={(e) => onImageCreditChange(e.target.value || null)}
                      placeholder="e.g. Photo: UZH / Name"
                      style={{ marginTop: '4px' }}
                    />
                  </label>
                )}

                {hasSocial && (
                  <label className={styles.field}>
                    <span style={{ fontSize: '12px' }}>Optional image credit (Social)</span>
                    <input
                      type="text"
                      className={styles.input}
                      value={state.socialImageCredit || ''}
                      onChange={(e) => onSocialImageCreditChange(e.target.value || null)}
                      placeholder="e.g. Photo: UZH / Name"
                      style={{ marginTop: '4px' }}
                    />
                  </label>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
