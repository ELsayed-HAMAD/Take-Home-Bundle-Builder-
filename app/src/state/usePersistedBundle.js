const STORAGE_KEY = 'bundle-builder:saved-system';

// Thin wrapper around localStorage - isolated here so the reducer itself
// doesn't need to know persistence exists.
export function saveBundle(state) {
  try {
    const payload = {
      savedAt: new Date().toISOString(),
      state,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error('Could not save your system:', err);
    return false;
  }
}

export function loadSavedBundle() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    return payload?.state ?? null;
  } catch (err) {
    console.error('Could not load your saved system:', err);
    return null;
  }
}

export function hasSavedBundle() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function clearSavedBundle() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Could not clear saved system:', err);
  }
}

// The hook components actually use: exposes save()/restoredOnLoad so the
// "Save my system for later" link and the initial page load can both hook
// into the same persisted state without touching localStorage directly.
import { useCallback, useState } from 'react';
import { useBundleState, useBundleDispatch } from './BundleContext';

export function usePersistedBundle() {
  const state = useBundleState();
  const dispatch = useBundleDispatch();
  const [justSaved, setJustSaved] = useState(false);

  const save = useCallback(() => {
    const ok = saveBundle(state);
    if (ok) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
    return ok;
  }, [state]);

  const restore = useCallback(() => {
    const saved = loadSavedBundle();
    if (saved) {
      dispatch({ type: 'HYDRATE', state: saved });
      return true;
    }
    return false;
  }, [dispatch]);

  return { save, restore, justSaved, hasSaved: hasSavedBundle() };
}
