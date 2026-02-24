'use client';

import { AppShellProvider, useAppShell } from '@/components/layout/app-shell-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TopNav } from '@/components/layout/top-nav';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { topbarHeight } = useAppShell();

  return (
    <div className="min-h-screen" style={{ paddingTop: topbarHeight }}>
      <TopNav />
      <main>
        <div className="max-w-layout mx-auto px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShellProvider>
      <TooltipProvider>
        <DashboardContent>{children}</DashboardContent>
      </TooltipProvider>
    </AppShellProvider>
  );
}
