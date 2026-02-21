'use client';

import { useState, useEffect, useRef } from 'react';
import { DiscoveryInput } from './discovery-input';

interface DiscoveryLoadingStateProps {
  query: string;
}

const STATUS_MESSAGES = [
  'Analyzing your query...',
  'Retrieving district intelligence...',
  'Generating insights...',
] as const;

export function DiscoveryLoadingState({ query }: DiscoveryLoadingStateProps) {
  const [statusIndex, setStatusIndex] = useState(0);
  const [showLeadSkeleton, setShowLeadSkeleton] = useState(false);
  const [showSignalsSkeleton, setShowSignalsSkeleton] = useState(false);
  const [showSection1Skeleton, setShowSection1Skeleton] = useState(false);
  const [showSection2Skeleton, setShowSection2Skeleton] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const t1 = setTimeout(() => setShowLeadSkeleton(true), 300);
    const t2 = setTimeout(() => setStatusIndex(1), 800);
    const t3 = setTimeout(() => setShowSignalsSkeleton(true), 700);
    const t4 = setTimeout(() => setShowSection1Skeleton(true), 1100);
    const t5 = setTimeout(() => setStatusIndex(2), 1500);
    const t6 = setTimeout(() => setShowSection2Skeleton(true), 1800);

    timersRef.current = [t1, t2, t3, t4, t5, t6];

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="w-full">
      {/* Compact input — disabled, showing active query */}
      <DiscoveryInput
        variant="full"
        disabled
        initialValue={query}
        onSubmit={() => {}}
        onDirectNavigation={() => {}}
      />

      {/* Skeleton content area — matches results layout container */}
      <div className="max-w-content mx-auto mt-6">
        {/* Status text with aria-live for screen reader announcements */}
        <p
          aria-live="polite"
          className="text-xs font-medium text-slate-400 tracking-[0.025em] mb-4"
        >
          {STATUS_MESSAGES[statusIndex]}
        </p>

        {/* Lead insight skeleton — emphasis surface shape */}
        {showLeadSkeleton && (
          <div className="bg-[#E0F9FC] rounded-md h-16 animate-pulse mb-6" />
        )}

        {/* Key signals skeleton — 2×2 grid */}
        {showSignalsSkeleton && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div className="bg-slate-100 rounded-md h-12 animate-pulse" />
            <div className="bg-slate-100 rounded-md h-12 animate-pulse" />
            <div className="bg-slate-100 rounded-md h-12 animate-pulse" />
            <div className="bg-slate-100 rounded-md h-12 animate-pulse" />
          </div>
        )}

        {/* Section 1 skeleton */}
        {showSection1Skeleton && (
          <div className="bg-slate-50 rounded-md h-24 animate-pulse mb-3" />
        )}

        {/* Section 2 skeleton */}
        {showSection2Skeleton && (
          <div className="bg-slate-50 rounded-md h-24 animate-pulse" />
        )}
      </div>
    </div>
  );
}
