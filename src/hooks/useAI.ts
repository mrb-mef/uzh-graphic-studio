import { useState, useCallback } from 'react';
import { getAnthropicKey } from '../utils/aiKeys';
import type { AIAssistPayload } from '../types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assist = useCallback(async (payload: AIAssistPayload): Promise<string | null> => {
    const key = getAnthropicKey();
    if (!key) return null;

    setLoading(true);
    setError(null);

    const prompt = payload.zone === 'title'
      ? `Write a concise, compelling event title for a University of Zurich communication. Context: ${payload.context}. Current draft: "${payload.currentValue}". Return only the improved title, no explanation.`
      : `Write concise event details text for a University of Zurich flyer. Include: date/time/location if mentioned. Context: ${payload.context}. Current draft: "${payload.currentValue}". Return only the improved text, no explanation.`;

    try {
      const res = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 256,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as any)?.error?.message ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      const block = data.content?.[0];
      return block?.type === 'text' ? (block.text as string).trim() : null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI request failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { assist, loading, error };
}
