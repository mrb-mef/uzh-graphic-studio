import { useState, useCallback } from 'react';
import type { DesignState, FormatId, LogoVariant, FontWeight } from '../types';
import { DEFAULT_FORMAT_IDS } from '../data/formats';
import { FACULTIES } from '../data/templates';

const INITIAL_STATE: DesignState = {
  presetId: 'layout-1',
  title: 'Your Event Title',
  boxText: 'Date, time and location\n\nA short description of the event goes here.',
  orgUnit: FACULTIES[0],
  orgUnitCustom: '',
  useCustomOrgUnit: false,
  imageUrl: null,
  imageCredit: null,
  logoVariant: 'standard',
  colorSwatchId: 'white',
  fontWeight: 400,
  url: '',
  activeFormatIds: DEFAULT_FORMAT_IDS,
};

export function useDesignState() {
  const [state, setState] = useState<DesignState>(INITIAL_STATE);

  const update = useCallback(<K extends keyof DesignState>(
    key: K,
    value: DesignState[K],
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleFormat = useCallback((id: FormatId) => {
    setState((prev) => {
      const active = prev.activeFormatIds;
      const next = active.includes(id)
        ? active.filter((f) => f !== id)
        : [...active, id];
      if (next.length === 0) return prev;
      return { ...prev, activeFormatIds: next };
    });
  }, []);

  const setLogoVariant = useCallback((v: LogoVariant) => update('logoVariant', v), [update]);
  const setColorSwatch = useCallback((id: string) => update('colorSwatchId', id), [update]);
  const setFontWeight = useCallback((w: FontWeight) => update('fontWeight', w), [update]);
  const setPreset = useCallback((id: string) => update('presetId', id), [update]);
  const setTitle = useCallback((v: string) => update('title', v), [update]);
  const setBoxText = useCallback((v: string) => update('boxText', v), [update]);
  const setOrgUnit = useCallback((v: string) => update('orgUnit', v), [update]);
  const setOrgUnitCustom = useCallback((v: string) => update('orgUnitCustom', v), [update]);
  const setUseCustomOrgUnit = useCallback((v: boolean) => update('useCustomOrgUnit', v), [update]);
  const setImageUrl = useCallback((url: string | null, credit: string | null) => {
    setState((prev) => ({ ...prev, imageUrl: url, imageCredit: credit }));
  }, []);
  const setUrl = useCallback((v: string) => update('url', v), [update]);

  return {
    state,
    update,
    toggleFormat,
    setLogoVariant,
    setColorSwatch,
    setFontWeight,
    setPreset,
    setTitle,
    setBoxText,
    setOrgUnit,
    setOrgUnitCustom,
    setUseCustomOrgUnit,
    setImageUrl,
    setUrl,
  };
}
