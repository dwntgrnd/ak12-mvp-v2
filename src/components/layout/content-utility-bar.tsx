'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { PanelLeft, X } from 'lucide-react';
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
import { useProductLens } from '@/hooks/use-product-lens';

function useBreadcrumbs(pathname: string, breadcrumbOverride: string | null) {
  if (pathname.startsWith('/districts/')) {
    return {
      parent: { label: 'Discovery', href: '/discovery' },
      current: breadcrumbOverride ?? 'District',
    };
  }

  if (pathname.startsWith('/solutions/') && pathname !== '/solutions') {
    return {
      parent: { label: 'Solutions Library', href: '/solutions' },
      current: breadcrumbOverride ?? 'Product',
    };
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
  const { toggleSidebar, pageActions, breadcrumbOverride } = useSidebar();
  const { parent, current } = useBreadcrumbs(pathname, breadcrumbOverride);
  const { activeProduct, isLensActive, clearProduct } = useProductLens();

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
                    <Link href={parent.href} className="text-foreground-secondary hover:text-foreground">
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

        {isLensActive && activeProduct && (
          <>
            <span className="text-foreground-tertiary">·</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              <span className="text-sm font-medium text-foreground">{activeProduct.name}</span>
              <button
                onClick={clearProduct}
                className="hover:bg-surface-emphasis-neutral rounded-full p-0.5"
                aria-label={`Active product lens: ${activeProduct.name}. Click to dismiss.`}
              >
                <X className="w-3.5 h-3.5 text-foreground-secondary" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right zone */}
      {pageActions && <div className="flex items-center gap-2">{pageActions}</div>}
    </div>
  );
}
