'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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

const navItems = [
  { href: '/discovery', label: 'Discovery' },
  { href: '/saved', label: 'Saved Districts' },
  { href: '/playbooks', label: 'Playbooks' },
  { href: '/solutions', label: 'Solutions' },
];

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

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { pageActions, breadcrumbOverride, setTopbarHeight } = useAppShell();
  const { parent, current } = useBreadcrumbs(pathname, breadcrumbOverride);
  const { activeProduct, isLensActive, clearProduct } = useProductLens();
  const [userRole, setUserRole] = useState<string | null>(null);

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
  const showBreadcrumbs = pathname !== '/discovery';
  const showCompactSearch = pathname.startsWith('/districts/');

  useEffect(() => {
    setTopbarHeight('3.5rem');
  }, [setTopbarHeight]);

  return (
    <>
    {/* Row 1 — Primary nav bar (fixed) */}
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="h-14 bg-topbar grid grid-cols-[1fr_auto_1fr] items-center px-6">
        {/* Left: Logo */}
        <div className="justify-self-start">
          <Link href="/discovery" className="shrink-0">
            <span className="font-heading text-2xl font-bold text-sidebar-foreground">
              Alchemy<span className="text-brand-orange">K12</span>
            </span>
          </Link>
        </div>

        {/* Center: Nav items */}
        <nav className="flex items-stretch gap-8 h-full">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center px-1 pt-1 text-lg font-semibold transition-colors border-b-4',
                  active
                    ? 'border-[hsl(var(--brand-blue))] text-sidebar-foreground'
                    : 'border-transparent text-sidebar-foreground/70 hover:text-sidebar-foreground'
                )}
              >
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
                {parent ? (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link
                          href={parent.href}
                          className="text-foreground-secondary hover:text-foreground"
                        >
                          {parent.label}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-foreground-tertiary" />
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
            onSubmit={(query) => router.push(`/discovery?q=${encodeURIComponent(query)}`)}
            onDirectNavigation={(districtId) => router.push(`/districts/${districtId}`)}
          />
        </div>
      </div>
    )}
    </>
  );
}
