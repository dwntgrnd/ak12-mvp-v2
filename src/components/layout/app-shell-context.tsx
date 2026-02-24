'use client';

import React, { createContext, useContext, useState } from 'react';

interface AppShellContextValue {
  pageActions: React.ReactNode | null;
  setPageActions: (node: React.ReactNode | null) => void;
  breadcrumbOverride: string | null;
  setBreadcrumbOverride: (label: string | null) => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children }: { children: React.ReactNode }) {
  const [pageActions, setPageActions] = useState<React.ReactNode | null>(null);
  const [breadcrumbOverride, setBreadcrumbOverride] = useState<string | null>(null);

  return (
    <AppShellContext.Provider
      value={{
        pageActions,
        setPageActions,
        breadcrumbOverride,
        setBreadcrumbOverride,
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
