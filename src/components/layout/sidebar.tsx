'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Bookmark, Package, FileText, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarNavItem } from './sidebar-nav-item';
import { useSidebar } from './sidebar-context';

const mainNavItems = [
  { href: '/discovery', icon: Search, label: 'Discovery' },
  { href: '/saved', icon: Bookmark, label: 'Saved Districts' },
  { href: '/solutions', icon: Package, label: 'Solutions Library' },
  { href: '/playbooks', icon: FileText, label: 'Playbooks' },
];

const adminNavItems = [{ href: '/admin', icon: Shield, label: 'Admin' }];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed } = useSidebar();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/users/me');
        const data = await response.json();
        setUserRole(data.role);
      } catch {
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, []);

  const isActive = (href: string) => {
    if (href === '/discovery') {
      return pathname === href || pathname.startsWith('/districts');
    }
    return pathname.startsWith(href);
  };

  const showAdminNav = userRole === 'publisher-admin' || userRole === 'super-admin';

  return (
    <aside
      className={cn(
        'bg-sidebar flex flex-col shrink-0',
        'h-[calc(100vh-var(--topbar-height))] sticky top-[var(--topbar-height)]',
        'transition-[width] duration-200 ease-in-out',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
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
              collapsed={sidebarCollapsed}
            />
          ))}
        </div>

        {/* Admin section */}
        {showAdminNav && (
          <>
            <div
              className={cn(
                'my-4 border-t border-white/10',
                sidebarCollapsed ? 'mx-2' : 'mx-4'
              )}
            />
            <div className="space-y-1">
              {adminNavItems.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={isActive(item.href)}
                  collapsed={sidebarCollapsed}
                />
              ))}
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}
