'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { X, Search, Bookmark, BookOpen, Package } from 'lucide-react';
import { DiscoveryInput } from '@/components/discovery/discovery-input';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAppShell } from './app-shell-context';
import { useProductLens } from '@/hooks/use-product-lens';
import { useSavedDistricts } from '@/hooks/use-saved-districts';
import { usePlaybookCount } from '@/hooks/use-playbook-count';
import { useLibraryReadiness } from '@/hooks/use-library-readiness';

const navItems = [
  { href: '/discovery', label: 'Discovery', icon: Search },
  { href: '/saved', label: 'Saved Districts', icon: Bookmark },
  { href: '/playbooks', label: 'Playbooks', icon: BookOpen },
  { href: '/solutions', label: 'Solutions', icon: Package },
];

function usePathnameBreadcrumbs(pathname: string) {
  if (pathname.startsWith('/districts/')) {
    return {
      parent: { label: 'Discovery', href: '/discovery' },
      current: 'District',
    };
  }

  if (pathname.startsWith('/solutions/') && pathname !== '/solutions') {
    return {
      parent: { label: 'Solutions Library', href: '/solutions' },
      current: 'Product',
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

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { pageActions, breadcrumbs, setTopbarHeight } = useAppShell();
  const pathnameFallback = usePathnameBreadcrumbs(pathname);
  const { activeProduct, isLensActive, clearProduct } = useProductLens();
  const { savedDistricts } = useSavedDistricts();
  const { hasPlaybooks } = usePlaybookCount();
  const { hasProducts } = useLibraryReadiness();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Map nav hrefs to whether they have content (for gold fill indicator)
  const navContentMap: Record<string, boolean> = {
    '/saved': savedDistricts.length > 0,
    '/playbooks': hasPlaybooks,
    '/solutions': hasProducts,
  };

  useEffect(() => {
    fetch('/api/users/me')
      .then((res) => res.json())
      .then((data) => setUserRole(data.role))
      .catch(() => setUserRole(null));
  }, []);

  const isActive = (href: string) => {
    if (href === '/discovery') {
      return pathname === href || pathname.startsWith('/districts');
    }
    return pathname.startsWith(href);
  };

  const showAdmin = userRole === 'publisher-admin' || userRole === 'super-admin';
  const showBreadcrumbs = false;
  const showCompactSearch = pathname === '/saved' || pathname === '/districts' || pathname === '/playbooks' || pathname.startsWith('/solutions');

  useEffect(() => {
    setTopbarHeight('3.875rem');
  }, [setTopbarHeight]);

  return (
    <>
    {/* Row 1 — Primary nav bar (fixed) */}
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="h-[62px] bg-topbar grid grid-cols-[1fr_auto_1fr] items-center px-6">
        {/* Left: Logo */}
        <div className="justify-self-start">
          <Link href="/discovery" className="shrink-0">
            <span className="font-heading text-[26.4px] font-bold text-sidebar-foreground">
              Alchemy<span className="text-brand-orange">K12</span>
            </span>
          </Link>
        </div>

        {/* Center: Nav items */}
        <nav className="flex items-stretch gap-8 h-full">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            const hasContent = navContentMap[item.href] ?? false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-1 pt-1 text-base font-semibold transition-colors border-b-4',
                  active
                    ? 'border-[hsl(var(--brand-blue))] text-sidebar-foreground'
                    : 'border-transparent text-sidebar-foreground/70 hover:text-sidebar-foreground'
                )}
              >
                <Icon
                  className="h-4 w-4 transition-colors"
                  fill={hasContent ? 'hsl(45 100% 51% / 0.25)' : 'none'}
                  stroke={hasContent ? 'hsl(45 100% 51%)' : 'currentColor'}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Avatar dropdown */}
        <div className="justify-self-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="w-8 h-8 rounded-full bg-[hsl(var(--warning))] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-topbar"
                aria-label="User menu"
              >
                <span className="text-xs font-semibold text-white">DU</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {showAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem disabled>Settings</DropdownMenuItem>
              <DropdownMenuItem disabled>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>

    {/* Row 2 — Breadcrumb bar (not fixed, scrolls with content) */}
    {showBreadcrumbs && (
      <div className="border-b border-border-default h-8 flex items-center">
        <div className="max-w-layout mx-auto w-full px-6 flex items-center justify-between">
          {/* Left: Breadcrumbs */}
          <div className="flex items-center gap-3">
            <Breadcrumb>
              <BreadcrumbList className="text-sm">
                {breadcrumbs ? (
                  // Structured breadcrumbs from page via setBreadcrumbs()
                  breadcrumbs.map((segment, i) => {
                    const isLast = i === breadcrumbs.length - 1;
                    return (
                      <React.Fragment key={i}>
                        {i > 0 && <BreadcrumbSeparator className="text-foreground-tertiary" />}
                        <BreadcrumbItem>
                          {segment.href && !isLast ? (
                            <BreadcrumbLink asChild>
                              <Link
                                href={segment.href}
                                className="text-foreground-secondary hover:text-foreground"
                              >
                                {segment.label}
                              </Link>
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage className="font-medium text-foreground">
                              {segment.label}
                            </BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    );
                  })
                ) : pathnameFallback.parent ? (
                  // Fallback: pathname-based breadcrumbs with parent
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link
                          href={pathnameFallback.parent.href}
                          className="text-foreground-secondary hover:text-foreground"
                        >
                          {pathnameFallback.parent.label}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-foreground-tertiary" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="font-medium text-foreground">
                        {pathnameFallback.current}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                ) : (
                  // Fallback: pathname-based single segment
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium text-foreground">
                      {pathnameFallback.current}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>

            {/* Product lens indicator */}
            {isLensActive && activeProduct && (
              <>
                <span className="text-foreground-tertiary">·</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm font-medium text-foreground">
                    {activeProduct.name}
                  </span>
                  <button
                    onClick={clearProduct}
                    className="hover:bg-surface-inset rounded-full p-0.5"
                    aria-label={`Active product lens: ${activeProduct.name}. Click to dismiss.`}
                  >
                    <X className="w-3.5 h-3.5 text-foreground-secondary" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Center: Page actions */}
          {pageActions && <div className="flex items-center gap-2">{pageActions}</div>}

          {/* Right: empty for now */}
          <div />
        </div>
      </div>
    )}

    {/* Row 3 — Compact search (not fixed, scrolls with content) */}
    {showCompactSearch && (
      <div className="border-b border-border-default bg-surface-page py-6 px-6">
        <div className="max-w-xl mx-auto">
          <DiscoveryInput
            variant="compact"
            placeholder="Search for a district..."
            onDirectNavigation={(districtId) => router.push(`/districts/${districtId}`)}
          />
        </div>
      </div>
    )}
    </>
  );
}
