import { useEffect } from 'react';
import styles from './ChangelogModal.module.css';

interface ChangelogVersion {
  version: string;
  date: string;
  isLatest?: boolean;
  changes: string[];
}

const CHANGELOG_DATA: ChangelogVersion[] = [
  {
    version: '1.3.0',
    date: '2026-06-03',
    isLatest: true,
    changes: [
      'Implemented independent image adjustments (zoom, offsets, and gradient overlay) for Print/Digital vs. Social category templates.',
      'Split the Adjust Image control panel section to show Print & Digital vs. Social sub-controls based on active formats.',
      'Made Print & Digital and Social image credit fields completely independent and optional.',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-06-03',
    changes: [
      'Configured Print layouts to export automatically to high-resolution PDFs, and Social/Digital formats to PNG and JPEG image assets.',
      'Separated content title (Headline) and font size multipliers for Print & Digital vs. Social layouts.',
      'Added dynamic color presets to the brand gradient overlay using the active swatch colors.',
      'Updated Social layouts to hide logo, faculty labels, and details boxes, ensuring full-bleed background coverage.',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-05-28',
    changes: [
      'Transitioned default A4 flyer layout to a brand-compliant Black & White default.',
      'Optimized layout styling and separator elements according to the UZH corporate design rules.',
      'Refined logo color logic and background swatch combinations.',
      'Enabled custom organizational unit text overrides.',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-05-27',
    changes: [
      'Initial release of the UZH Graphic Studio template generator.',
      'Support for multiple flyer and social media aspect ratios (A4, A5, Square, Story, Digital Screen).',
      'Real-time design preview canvas with dynamic grid sizing.',
      'Integration with Wikimedia Commons and Unsplash for copyright-compliant image searches.',
    ],
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangelogModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background body scrolling when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} aria-modal="true" role="dialog">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.titleArea}>
            <h2 className={styles.title}>Release Notes</h2>
            <span className={styles.subtitle}>UZH Graphic Studio Version History</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <div className={styles.content}>
          <div className={styles.timeline}>
            {CHANGELOG_DATA.map((item) => (
              <div key={item.version} className={styles.timelineItem}>
                <div className={styles.timelineHeader}>
                  <div className={styles.versionBadgeContainer}>
                    <span className={`${styles.versionBadge} ${item.isLatest ? styles.latest : ''}`}>
                      v{item.version}
                    </span>
                    {item.isLatest && <span className={styles.latestLabel}>Latest</span>}
                  </div>
                  <span className={styles.releaseDate}>{item.date}</span>
                </div>
                <ul className={styles.changeList}>
                  {item.changes.map((change, idx) => (
                    <li key={idx} className={styles.changeItem}>
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <footer className={styles.footer}>
          <button className={styles.primaryBtn} onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
