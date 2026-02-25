'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useDetachedWindow() {
  const windowRef = useRef<Window | null>(null);
  const [isDetached, setIsDetached] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const detach = useCallback(() => {
    if (windowRef.current && !windowRef.current.closed) {
      windowRef.current.focus();
      return;
    }

    const popup = window.open(
      '/dev/token-editor-detached',
      'ak12-token-editor',
      'width=380,height=700,menubar=no,toolbar=no,location=no,status=no'
    );

    if (popup) {
      windowRef.current = popup;
      setIsDetached(true);
    }
  }, []);

  const reattach = useCallback(() => {
    if (windowRef.current && !windowRef.current.closed) {
      windowRef.current.close();
    }
    windowRef.current = null;
    setIsDetached(false);
  }, []);

  // Poll to detect manual close of the detached window
  useEffect(() => {
    if (isDetached) {
      pollRef.current = setInterval(() => {
        if (windowRef.current?.closed) {
          windowRef.current = null;
          setIsDetached(false);
        }
      }, 500);
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [isDetached]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (windowRef.current && !windowRef.current.closed) {
        windowRef.current.close();
      }
    };
  }, []);

  return { isDetached, detach, reattach };
}
