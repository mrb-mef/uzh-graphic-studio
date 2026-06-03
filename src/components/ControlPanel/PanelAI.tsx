import { useState } from 'react';
import type { DesignState } from '../../types';
import { useAI } from '../../hooks/useAI';
import { hasAnthropicKey, setAnthropicKey } from '../../utils/aiKeys';
import styles from './panels.module.css';

interface Props {
  state: DesignState;
  setTitle: (v: string) => void;
  setBoxText: (v: string) => void;
}

export default function PanelAI({ state, setTitle, setBoxText }: Props) {
  const { assist, loading, error } = useAI();
  const [keyInput, setKeyInput] = useState('');
  const [hasKey, setHasKey] = useState(hasAnthropicKey);
  const [context, setContext] = useState('');

  const saveKey = () => {
    if (!keyInput.startsWith('sk-')) return;
    setAnthropicKey(keyInput);
    setKeyInput('');
    setHasKey(true);
  };

  const removeKey = () => {
    setAnthropicKey('');
    setHasKey(false);
  };

  const runAssist = async (zone: 'title' | 'boxText') => {
    const result = await assist({
      zone,
      currentValue: zone === 'title' ? state.title : state.boxText,
      context,
    });
    if (result) {
      zone === 'title' ? setTitle(result) : setBoxText(result);
    }
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>AI Assist (Claude)</h3>

      {!hasKey ? (
        <div>
          <p className={styles.hint}>Enter your Anthropic API key to enable AI text suggestions. Stored in session only — never saved.</p>
          <input
            className={styles.input}
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="sk-ant-..."
          />
          <button className={styles.primaryBtn} onClick={saveKey} disabled={!keyInput.startsWith('sk-')}>
            Enable AI
          </button>
        </div>
      ) : (
        <div>
          <textarea
            className={styles.textarea}
            rows={3}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Describe the event briefly (optional context for better suggestions)"
          />
          <div className={styles.buttonRow}>
            <button className={styles.primaryBtn} onClick={() => runAssist('title')} disabled={loading}>
              {loading ? '…' : 'Improve Title'}
            </button>
            <button className={styles.primaryBtn} onClick={() => runAssist('boxText')} disabled={loading}>
              {loading ? '…' : 'Improve Details'}
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.clearBtn} onClick={removeKey}>Remove key</button>
        </div>
      )}
    </div>
  );
}
