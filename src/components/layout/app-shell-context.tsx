'use client';

import React, { createContext, useContext, useState } from 'react';

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface AppShellContextValue {
  pageActions: React.ReactNode | null;
  setPageActions: (node: React.ReactNode | null) => void;
  breadcrumbs: BreadcrumbSegment[] | null;
  setBreadcrumbs: (segments: BreadcrumbSegment[] | null) => void;
  topbarHeight: string;
  setTopbarHeight: (height: string) => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children }: { children: React.ReactNode }) {
  const [pageActions, setPageActions] = useState<React.ReactNode | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbSegment[] | null>(null);
  const [topbarHeight, setTopbarHeight] = useState('3.875rem');

  return (
    <AppShellContext.Provider
      value={{
        pageActions,
        setPageActions,
        breadcrumbs,
        setBreadcrumbs,
        topbarHeight,
        setTopbarHeight,
      }}
    >
      {children}
    </AppShellContext.Provider>
  );
}

export function useAppShell() {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error('useAppShell must be used within AppShellProvider');
  return ctx;
}
