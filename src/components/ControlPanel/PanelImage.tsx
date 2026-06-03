import React, { useState, useRef } from 'react';
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
  onImageSelect: (url: string | null, credit: string | null) => void;
}

export default function PanelImage({ onImageSelect }: Props) {
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
      <h3 className={styles.sectionTitle}>Image</h3>

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

      <button className={styles.clearBtn} onClick={() => onImageSelect(null, null)}>
        Remove image
      </button>
    </div>
  );
}
