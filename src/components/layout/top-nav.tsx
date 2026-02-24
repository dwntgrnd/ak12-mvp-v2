'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
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
  const { pageActions, breadcrumbOverride } = useAppShell();
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Row 1 — Primary nav bar */}
      <div className="h-14 bg-topbar flex items-center justify-between px-6">
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-6">
          <Link href="/discovery" className="shrink-0">
            <span className="font-heading text-2xl font-bold text-sidebar-foreground">
              Alchemy<span className="text-brand-orange">K12</span>
            </span>
          </Link>

          {/* Search placeholder */}
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 w-[200px]">
            <Search className="h-4 w-4 text-sidebar-foreground/50" />
            <span className="text-sm text-sidebar-foreground/50">Search districts...</span>
          </div>
        </div>

        {/* Center: Nav items */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium transition-colors border-b-2',
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

      {/* Row 2 — Breadcrumb bar */}
      <div className="h-8 bg-topbar border-b border-white/10 flex items-center justify-between px-6">
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
                        className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
                      >
                        {parent.label}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-sidebar-foreground/40" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium text-sidebar-foreground">
                      {current}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium text-sidebar-foreground">
                    {current}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Product lens indicator */}
          {isLensActive && activeProduct && (
            <>
              <span className="text-sidebar-foreground/40">·</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <span className="text-sm font-medium text-sidebar-foreground">
                  {activeProduct.name}
                </span>
                <button
                  onClick={clearProduct}
                  className="hover:bg-white/10 rounded-full p-0.5"
                  aria-label={`Active product lens: ${activeProduct.name}. Click to dismiss.`}
                >
                  <X className="w-3.5 h-3.5 text-sidebar-foreground/70" />
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
    </header>
  );
}
