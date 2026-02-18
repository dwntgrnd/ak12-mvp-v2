'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarNavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  collapsed?: boolean;
}

export function SidebarNavItem({
  href,
  icon: Icon,
  label,
  isActive,
  collapsed = false,
}: SidebarNavItemProps) {
  const linkClasses = cn(
    'flex items-center text-sidebar-foreground transition-colors',
    'hover:bg-sidebar-hover',
    isActive && 'bg-sidebar-hover border-l-2 border-sidebar-active',
    collapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-4 py-2.5'
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href} className={linkClasses}>
            <Icon className={cn('h-5 w-5', !isActive && 'opacity-75')} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link href={href} className={linkClasses}>
      <Icon className={cn('h-5 w-5', !isActive && 'opacity-75')} />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
