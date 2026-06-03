import { useState } from 'react';
import ChangelogModal from './ChangelogModal';
import styles from './Header.module.css';

export default function Header() {
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.appName}>UZH Graphic Studio</span>
        <button
          className={styles.versionBadge}
          onClick={() => setIsChangelogOpen(true)}
          title="View change log"
        >
          v1.3.0
        </button>
      </div>
      <span className={styles.tagline}>Brand-compliant visual assets for UZH</span>

      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
      />
    </header>
  );
}
