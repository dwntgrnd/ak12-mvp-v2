import type { ReactNode } from 'react';

interface UnifiedDistrictLayoutProps {
  identityZone: ReactNode;
  modeBarZone: ReactNode;
  children: ReactNode;
}

export function UnifiedDistrictLayout({
  identityZone,
  modeBarZone,
  children,
}: UnifiedDistrictLayoutProps) {
  return (
    <div>
      {identityZone}
      <div className="mt-4">{modeBarZone}</div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
