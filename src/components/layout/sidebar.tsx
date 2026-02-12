'use client';

import { usePathname } from 'next/navigation';
import { Search, Bookmark, Package, FileText, Shield } from 'lucide-react';
import { SidebarNavItem } from './sidebar-nav-item';

const mockUser = {
  displayName: 'Sarah Chen',
  organizationName: 'EduVision Publishing',
  userRole: 'publisher-admin' as const,
};

const mainNavItems = [
  { href: '/discovery', icon: Search, label: 'Discovery' },
  { href: '/saved', icon: Bookmark, label: 'Saved Districts' },
  { href: '/solutions', icon: Package, label: 'Solutions Library' },
  { href: '/playbooks', icon: FileText, label: 'Playbooks' },
];

const adminNavItems = [{ href: '/admin', icon: Shield, label: 'Admin' }];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/discovery') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const showAdminNav =
    mockUser.userRole === 'publisher-admin' ||
    mockUser.userRole === 'super-admin';

  return (
    <aside className="w-64 h-screen sticky top-0 bg-sidebar flex flex-col">
      {/* Logo/Brand */}
      <div className="px-6 py-4 border-b border-white/10">
        <h1 className="text-xl font-heading font-semibold text-sidebar-foreground">
          AlchemyK12
        </h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.href)}
            />
          ))}
        </div>

        {/* Admin section */}
        {showAdminNav && (
          <>
            <div className="my-4 mx-4 border-t border-white/10" />
            <div className="space-y-1">
              {adminNavItems.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={isActive(item.href)}
                />
              ))}
            </div>
          </>
        )}
      </nav>

      {/* User Context */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="space-y-1">
          <p className="text-sm font-medium text-sidebar-foreground">
            {mockUser.displayName}
          </p>
          <p className="text-xs text-sidebar-foreground/60">
            {mockUser.organizationName}
          </p>
          <div className="mt-2">
            <span className="inline-block px-2 py-0.5 text-xs rounded bg-sidebar-hover text-sidebar-foreground/80 capitalize">
              {mockUser.userRole}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
