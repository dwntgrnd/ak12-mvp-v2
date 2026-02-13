import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { DistrictProfile } from '@/services/types/district';

interface DistrictProfileHeaderProps {
  district: DistrictProfile;
}

export function DistrictProfileHeader({ district }: DistrictProfileHeaderProps) {
  const hasSuperintendent =
    district.superintendentFirstName && district.superintendentLastName;
  const hasAddress = district.street && district.city && district.zip;

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/discovery" className="hover:text-foreground transition-colors">
          Discovery
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{district.name}</span>
      </nav>

      {/* District name */}
      <h1 className="text-2xl font-bold">{district.name}</h1>

      {/* Contact info */}
      <div className="mt-1.5 space-y-0.5 text-sm text-muted-foreground">
        {hasSuperintendent && (
          <p>Supt. {district.superintendentFirstName} {district.superintendentLastName}</p>
        )}
        {district.phone && (
          <p>
            <a href={`tel:${district.phone}`} className="hover:text-foreground transition-colors">
              {district.phone}
            </a>
          </p>
        )}
        {hasAddress && (
          <p>{district.street}, {district.city}, CA {district.zip}</p>
        )}
      </div>
    </div>
  );
}
