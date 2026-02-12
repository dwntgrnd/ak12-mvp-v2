'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarNavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

export function SidebarNavItem({
  href,
  icon: Icon,
  label,
  isActive,
}: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 text-sidebar-foreground transition-colors',
        'hover:bg-sidebar-hover',
        isActive && 'bg-sidebar-hover border-l-2 border-sidebar-active'
      )}
    >
      <Icon className={cn('h-5 w-5', !isActive && 'opacity-75')} />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
