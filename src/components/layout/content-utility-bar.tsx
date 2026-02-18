'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useSidebar } from './sidebar-context';

function useBreadcrumbs(pathname: string) {
  if (pathname.startsWith('/districts/')) {
    return { parent: { label: 'Discovery', href: '/discovery' }, current: 'District' };
  }

  const routeMap: Record<string, string> = {
    '/discovery': 'Discovery',
    '/saved': 'Saved Districts',
    '/solutions': 'Solutions Library',
    '/playbooks': 'Playbooks',
    '/admin': 'Admin',
  };

  const segment = Object.keys(routeMap).find((key) => pathname.startsWith(key));
  return { parent: null, current: segment ? routeMap[segment] : '' };
}

export function ContentUtilityBar() {
  const pathname = usePathname();
  const { toggleSidebar, pageActions } = useSidebar();
  const { parent, current } = useBreadcrumbs(pathname);

  return (
    <div className="h-10 bg-background border-b border-border flex items-center justify-between px-4 shrink-0">
      {/* Left zone */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>

        <Breadcrumb>
          <BreadcrumbList className="text-sm">
            {parent ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={parent.href} className="text-muted-foreground hover:text-foreground">
                      {parent.label}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium text-foreground">
                    {current}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-foreground">
                  {current}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right zone */}
      {pageActions && <div className="flex items-center gap-2">{pageActions}</div>}
    </div>
  );
}
