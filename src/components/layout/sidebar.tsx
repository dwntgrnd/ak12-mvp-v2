'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Bookmark, Package, FileText, Shield, User } from 'lucide-react';
import { SidebarNavItem } from './sidebar-nav-item';

const mainNavItems = [
  { href: '/discovery', icon: Search, label: 'Discovery' },
  { href: '/saved', icon: Bookmark, label: 'Saved Districts' },
  { href: '/solutions', icon: Package, label: 'Solutions Library' },
  { href: '/playbooks', icon: FileText, label: 'Playbooks' },
];

const adminNavItems = [{ href: '/admin', icon: Shield, label: 'Admin' }];

export function Sidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/users/me');
        const data = await response.json();
        setUserRole(data.role);
      } catch (error) {
        // If fetch fails, keep role as null (safe default)
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, []);

  const isActive = (href: string) => {
    if (href === '/discovery') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const showAdminNav = userRole === 'publisher-admin' || userRole === 'super-admin';

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
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-hover flex items-center justify-center">
            <User className="w-4 h-4 text-sidebar-foreground/60" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              Demo User
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              AlchemyK12
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
