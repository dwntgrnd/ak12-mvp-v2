import { SidebarProvider } from '@/components/layout/sidebar-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Topbar } from '@/components/layout/topbar';
import { Sidebar } from '@/components/layout/sidebar';
import { ContentUtilityBar } from '@/components/layout/content-utility-bar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <div className="min-h-screen">
          <Topbar />
          <div className="flex" style={{ paddingTop: 'var(--topbar-height)' }}>
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-[calc(100vh-var(--topbar-height))]">
              <ContentUtilityBar />
              <main className="flex-1 overflow-auto">
                <div className="max-w-[1400px] mx-auto px-6 py-6">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
