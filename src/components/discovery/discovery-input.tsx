'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDiscoveryService } from '@/services';
import type { IDiscoveryService, DirectoryEntry } from '@/services';
import { DiscoveryAutocompleteDropdown } from './discovery-autocomplete-dropdown';

const TYPEWRITER_CONFIG = {
  phrases: [
    'Search for a district by name...',
    "What's the math curriculum landscape in the Bay Area?",
    'Show me large districts with active adoption cycles',
    'Compare Oakland and Fresno on EL support',
    'Districts in my territory with declining math scores',
  ],
  charDelay: 45,
  charJitter: 15,
  punctuationPause: 150,
  phraseHoldDuration: 2400,
  deleteChunkSize: 4,
  deleteTickDelay: 30,
  interPhraseDelay: 400,
} as const;

const PUNCTUATION = new Set([',', '.', '?', '!']);

type TypewriterPhase = 'typing' | 'holding' | 'deleting' | 'pausing';

interface DiscoveryInputProps {
  onSubmit: (query: string) => void;
  onDirectNavigation: (districtId: string) => void;
  variant?: 'full' | 'compact';
  initialValue?: string;
  disabled?: boolean;
  onClear?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function DiscoveryInput({
  onSubmit,
  onDirectNavigation,
  variant = 'full',
  initialValue,
  disabled = false,
  onClear,
  placeholder,
  autoFocus,
}: DiscoveryInputProps) {
  const [value, setValue] = useState(initialValue ?? '');
  const [isFocused, setIsFocused] = useState(false);

  // Typewriter animation state
  const [twVisible, setTwVisible] = useState(true);
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<TypewriterPhase>('typing');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Autocomplete state
  const [matches, setMatches] = useState<DirectoryEntry[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Refs
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextPhraseRef = useRef(1);
  const serviceRef = useRef<IDiscoveryService | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  async function getService(): Promise<IDiscoveryService> {
    if (!serviceRef.current) {
      serviceRef.current = await getDiscoveryService();
    }
    return serviceRef.current;
  }

  // Typewriter overlay visible when: full variant AND no value AND not focused AND flag AND dropdown closed AND no static placeholder
  const showTypewriter = variant !== 'compact' && !placeholder && !value && !isFocused && twVisible && !dropdownOpen;

  // Animation engine — driven by state changes
  useEffect(() => {
    if (!showTypewriter) {
      clearTimer();
      return;
    }

    const phrase = TYPEWRITER_CONFIG.phrases[phraseIndex];

    if (phase === 'typing') {
      if (charIndex < phrase.length) {
        const char = phrase[charIndex];
        const isPunctuation = PUNCTUATION.has(char);
        const jitter = (Math.random() * 2 - 1) * TYPEWRITER_CONFIG.charJitter;
        const delay = Math.max(
          10,
          TYPEWRITER_CONFIG.charDelay + jitter + (isPunctuation ? TYPEWRITER_CONFIG.punctuationPause : 0),
        );
        timerRef.current = setTimeout(() => {
          setDisplayText(phrase.slice(0, charIndex + 1));
          setCharIndex((ci) => ci + 1);
        }, delay);
      } else {
        timerRef.current = setTimeout(() => {
          setPhase('holding');
        }, 50);
      }
    } else if (phase === 'holding') {
      timerRef.current = setTimeout(() => {
        setPhase('deleting');
      }, TYPEWRITER_CONFIG.phraseHoldDuration);
    } else if (phase === 'deleting') {
      if (displayText.length > 0) {
        timerRef.current = setTimeout(() => {
          setDisplayText((t) =>
            t.slice(0, Math.max(0, t.length - TYPEWRITER_CONFIG.deleteChunkSize)),
          );
        }, TYPEWRITER_CONFIG.deleteTickDelay);
      } else {
        timerRef.current = setTimeout(() => {
          setPhase('pausing');
        }, 50);
      }
    } else if (phase === 'pausing') {
      timerRef.current = setTimeout(() => {
        const next = (phraseIndex + 1) % TYPEWRITER_CONFIG.phrases.length;
        nextPhraseRef.current = (next + 1) % TYPEWRITER_CONFIG.phrases.length;
        setPhraseIndex(next);
        setCharIndex(0);
        setDisplayText('');
        setPhase('typing');
      }, TYPEWRITER_CONFIG.interPhraseDelay);
    }

    return clearTimer;
  }, [showTypewriter, phase, charIndex, displayText, phraseIndex, clearTimer]);

  // Debounced directory search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (!isFocused || value.length < 2) {
      if (value.length < 2) {
        setMatches([]);
        setDropdownOpen(false);
        setHighlightedIndex(-1);
        setIsSearchLoading(false);
      }
      return;
    }

    // Reset highlight on new input
    setHighlightedIndex(-1);

    debounceRef.current = setTimeout(async () => {
      setIsSearchLoading(true);
      setDropdownOpen(true);
      try {
        const service = await getService();
        const result = await service.searchDirectory({ query: value, limit: 8 });
        setMatches(result.matches);
      } catch {
        setMatches([]);
      } finally {
        setIsSearchLoading(false);
      }
    }, 150);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isFocused]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [clearTimer]);

  function handleFocus() {
    nextPhraseRef.current = (phraseIndex + 1) % TYPEWRITER_CONFIG.phrases.length;
    setIsFocused(true);
    clearTimer();
  }

  function handleBlur() {
    setIsFocused(false);
    setDropdownOpen(false);
    setHighlightedIndex(-1);
    if (!value) {
      // Hide overlay during transition delay to prevent mid-phrase flash
      setTwVisible(false);
      clearTimer();
      const next = nextPhraseRef.current;
      timerRef.current = setTimeout(() => {
        nextPhraseRef.current = (next + 1) % TYPEWRITER_CONFIG.phrases.length;
        setPhraseIndex(next);
        setCharIndex(0);
        setDisplayText('');
        setPhase('typing');
        setTwVisible(true);
      }, 300);
    }
  }

  function handleSelect(entry: DirectoryEntry) {
    setDropdownOpen(false);
    setHighlightedIndex(-1);
    onDirectNavigation(entry.districtId);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (dropdownOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isSearchLoading && matches.length > 0) {
          setHighlightedIndex((i) => (i >= matches.length - 1 ? 0 : i + 1));
        }
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isSearchLoading && matches.length > 0) {
          setHighlightedIndex((i) => (i <= 0 ? matches.length - 1 : i - 1));
        }
        return;
      }
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setHighlightedIndex(-1);
        return;
      }
    }

    if (e.key === 'Enter') {
      if (dropdownOpen && highlightedIndex >= 0 && matches[highlightedIndex]) {
        handleSelect(matches[highlightedIndex]);
      } else {
        const trimmed = value.trim();
        if (trimmed) {
          setDropdownOpen(false);
          onSubmit(trimmed);
        }
      }
    }
  }

  function handleClear() {
    setValue('');
    onClear?.();
  }

  // Cursor shows during typing, holding, and deleting — not during pausing
  const showCursor = showTypewriter && phase !== 'pausing';

  return (
    <div
      className={cn(
        'relative w-full',
        variant === 'full' ? 'max-w-170 mx-auto' : 'max-w-none',
        disabled && 'opacity-60',
      )}
    >
      {/* Ambient glow — full variant only, blooms on focus */}
      {variant === 'full' && (
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 -z-10 rounded-2xl blur-xl transition-opacity duration-500',
            'bg-primary/10',
            isFocused ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}

      {/* Search icon — transitions to brand cyan on focus */}
      <Search
        className={cn(
          'absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-colors duration-200',
          variant === 'full' ? 'w-4.5 h-4.5' : 'w-4 h-4',
          isFocused ? 'text-primary' : 'text-slate-400',
        )}
        aria-hidden="true"
      />

      {/* Input */}
      <input
        type="text"
        role="combobox"
        aria-expanded={dropdownOpen}
        aria-controls="discovery-autocomplete-listbox"
        aria-activedescendant={
          dropdownOpen && highlightedIndex >= 0
            ? `discovery-option-${highlightedIndex}`
            : undefined
        }
        aria-autocomplete="list"
        aria-label="Search districts or ask a question"
        autoFocus={autoFocus ?? variant === 'full'}
        autoComplete="off"
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full bg-white border text-sm text-foreground outline-none transition-all duration-200',
          variant === 'full'
            ? cn('h-14 rounded-xl pl-11', value.length > 0 ? 'pr-14' : 'pr-5')
            : cn('h-10 rounded-lg pl-10', value.length > 0 ? 'pr-9' : 'pr-4'),
          isFocused
            ? cn(
                'border-primary',
                variant === 'full'
                  ? 'shadow-[0_0_0_3px_rgba(3,196,212,0.15),0_4px_16px_rgba(0,0,0,0.06)]'
                  : 'shadow-[0_0_0_2px_rgba(3,196,212,0.2)]',
              )
            : 'border-border shadow-sm',
          disabled && 'cursor-not-allowed',
        )}
      />

      {/* Submit button — full variant, appears when value is present */}
      {variant === 'full' && value.length > 0 && !disabled && (
        <button
          type="button"
          aria-label="Search"
          onClick={() => {
            const trimmed = value.trim();
            if (trimmed) {
              setDropdownOpen(false);
              onSubmit(trimmed);
            }
          }}
          className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2 z-10',
            'flex items-center justify-center w-9 h-9 rounded-md',
            'bg-brand-orange text-white',
            'transition-all duration-150 hover:brightness-105 active:scale-95',
          )}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* Clear button — compact mode only, when value present and not disabled */}
      {variant === 'compact' && value.length > 0 && !disabled && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Typewriter overlay — pointer-events-none so clicks pass through to input */}
      {showTypewriter && (
        <div
          aria-hidden="true"
          className="absolute left-11 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden whitespace-nowrap max-w-[calc(100%-3.5rem)]"
        >
          <span className="text-sm text-slate-400 font-normal">{displayText}</span>
          {showCursor && (
            <span className="text-sm text-primary font-normal animate-blink">|</span>
          )}
        </div>
      )}

      {/* Autocomplete dropdown */}
      {dropdownOpen && (
        <DiscoveryAutocompleteDropdown
          matches={matches}
          isLoading={isSearchLoading}
          highlightedIndex={highlightedIndex}
          onSelect={handleSelect}
          onHighlight={setHighlightedIndex}
          query={value}
        />
      )}
    </div>
  );
}
