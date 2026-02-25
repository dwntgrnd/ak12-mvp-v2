'use client';

import { useCallback, useEffect, useState } from 'react';

export type DockPosition = 'left' | 'right' | 'bottom' | 'detached';

const DOCK_KEY = 'ak12-token-editor-dock';
const OPEN_KEY = 'ak12-token-editor-open';

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useDockPosition() {
  const [dock, setDockState] = useState<DockPosition>('right');
  const [isOpen, setIsOpenState] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    setDockState(readStorage<DockPosition>(DOCK_KEY, 'right'));
    setIsOpenState(readStorage<boolean>(OPEN_KEY, false));
  }, []);

  const setDock = useCallback((pos: DockPosition) => {
    setDockState(pos);
    localStorage.setItem(DOCK_KEY, JSON.stringify(pos));
  }, []);

  const setIsOpen = useCallback((open: boolean) => {
    setIsOpenState(open);
    localStorage.setItem(OPEN_KEY, JSON.stringify(open));
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  return { dock, setDock, isOpen, setIsOpen, toggle };
}
