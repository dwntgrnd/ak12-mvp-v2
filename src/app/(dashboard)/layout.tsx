import { AppShellProvider } from '@/components/layout/app-shell-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TopNav } from '@/components/layout/top-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShellProvider>
      <TooltipProvider>
        <div className="min-h-screen">
          <TopNav />
          <main style={{ paddingTop: 'var(--topbar-height)' }}>
            {children}
          </main>
        </div>
      </TooltipProvider>
    </AppShellProvider>
  );
}
