'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TOKEN_REGISTRY, type TokenDefinition } from './token-registry';

const CHANNEL_NAME = 'ak12-token-editor';

export interface ScaleMetadata {
  base: number;
  ratio: number;
  ratioLabel: string;
}

interface TokenState {
  /** Map of cssVar → current overridden value */
  changes: Map<string, string>;
  /** Map of cssVar → original computed value */
  defaults: Map<string, string>;
}

export function useTokenEditor() {
  const [state, setState] = useState<TokenState>({
    changes: new Map(),
    defaults: new Map(),
  });
  const channelRef = useRef<BroadcastChannel | null>(null);
  const scaleMetadataRef = useRef<ScaleMetadata | null>(null);

  // Read all computed defaults on mount
  useEffect(() => {
    const defaults = new Map<string, string>();
    const root = document.documentElement;
    const computed = getComputedStyle(root);

    for (const token of TOKEN_REGISTRY) {
      const value = computed.getPropertyValue(token.cssVar).trim();
      defaults.set(token.cssVar, value);
    }

    setState((prev) => ({ ...prev, defaults }));
  }, []);

  // Set up BroadcastChannel listener
  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const { type, cssVar, value } = event.data;
      if (type === 'update') {
        document.documentElement.style.setProperty(cssVar, value);
        setState((prev) => {
          const changes = new Map(prev.changes);
          changes.set(cssVar, value);
          return { ...prev, changes };
        });
      } else if (type === 'reset') {
        document.documentElement.style.removeProperty(cssVar);
        setState((prev) => {
          const changes = new Map(prev.changes);
          changes.delete(cssVar);
          return { ...prev, changes };
        });
      } else if (type === 'reset-all') {
        for (const token of TOKEN_REGISTRY) {
          document.documentElement.style.removeProperty(token.cssVar);
        }
        setState((prev) => ({ ...prev, changes: new Map() }));
      }
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

  const broadcast = useCallback(
    (data: Record<string, string>) => {
      channelRef.current?.postMessage(data);
    },
    []
  );

  const updateToken = useCallback(
    (cssVar: string, value: string) => {
      document.documentElement.style.setProperty(cssVar, value);
      setState((prev) => {
        const changes = new Map(prev.changes);
        changes.set(cssVar, value);
        return { ...prev, changes };
      });
      broadcast({ type: 'update', cssVar, value });
    },
    [broadcast]
  );

  const resetToken = useCallback(
    (cssVar: string) => {
      document.documentElement.style.removeProperty(cssVar);
      setState((prev) => {
        const changes = new Map(prev.changes);
        changes.delete(cssVar);
        return { ...prev, changes };
      });
      broadcast({ type: 'reset', cssVar, value: '' });
    },
    [broadcast]
  );

  const resetAll = useCallback(() => {
    for (const token of TOKEN_REGISTRY) {
      document.documentElement.style.removeProperty(token.cssVar);
    }
    setState((prev) => ({ ...prev, changes: new Map() }));
    broadcast({ type: 'reset-all', cssVar: '', value: '' });
  }, [broadcast]);

  const getCurrentValue = useCallback(
    (cssVar: string): string => {
      return (
        state.changes.get(cssVar) ??
        state.defaults.get(cssVar) ??
        ''
      );
    },
    [state.changes, state.defaults]
  );

  const isModified = useCallback(
    (cssVar: string): boolean => {
      return state.changes.has(cssVar);
    },
    [state.changes]
  );

  const getChangeCount = useCallback((): number => {
    return state.changes.size;
  }, [state.changes]);

  const getGroupChangeCount = useCallback(
    (groupTokens: TokenDefinition[]): number => {
      return groupTokens.filter((t) => state.changes.has(t.cssVar)).length;
    },
    [state.changes]
  );

  const setScaleMetadata = useCallback((meta: ScaleMetadata) => {
    scaleMetadataRef.current = meta;
  }, []);

  const generateDiff = useCallback((): string => {
    if (state.changes.size === 0) return 'No changes.';

    const lines: string[] = [];

    // Markdown table
    lines.push('| Variable | Original | New |');
    lines.push('|----------|----------|-----|');
    for (const [cssVar, newVal] of state.changes) {
      const original = state.defaults.get(cssVar) ?? '(unknown)';
      lines.push(`| \`${cssVar}\` | \`${original}\` | \`${newVal}\` |`);
    }

    lines.push('');
    lines.push('```css');

    // Add modular scale comment if any font-size vars are in changes
    const hasFontChanges = Array.from(state.changes.keys()).some(
      (k) => k === '--font-base' || k.startsWith('--font-size-')
    );
    if (hasFontChanges && scaleMetadataRef.current) {
      const { base, ratio, ratioLabel } = scaleMetadataRef.current;
      lines.push(`/* Modular scale: base ${base}px, ratio ${ratio} (${ratioLabel}) */`);
    }

    lines.push(':root {');
    for (const [cssVar, newVal] of state.changes) {
      lines.push(`  ${cssVar}: ${newVal};`);
    }
    lines.push('}');
    lines.push('```');

    return lines.join('\n');
  }, [state.changes, state.defaults]);

  return {
    updateToken,
    resetToken,
    resetAll,
    getCurrentValue,
    isModified,
    getChangeCount,
    getGroupChangeCount,
    generateDiff,
    setScaleMetadata,
    changes: state.changes,
  };
}
