'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ENROLLMENT_OPTIONS = [
  { value: '__all__', label: 'All Sizes' },
  { value: 'small', label: 'Small (under 5,000)' },
  { value: 'medium', label: 'Medium (5,000 – 25,000)' },
  { value: 'large', label: 'Large (25,000 – 100,000)' },
  { value: 'very-large', label: 'Very Large (over 100,000)' },
];

const FIT_LEVEL_OPTIONS = [
  { value: '__all__', label: 'All Fit Levels' },
  { value: 'strong', label: 'Strong Fit (7–10)' },
  { value: 'moderate', label: 'Moderate Fit (4–6)' },
  { value: 'low', label: 'Low Fit (0–3)' },
];

const SORT_OPTIONS_BASE = [
  { value: 'enrollment-desc', label: 'Enrollment: High → Low' },
  { value: 'name-asc', label: 'Name: A → Z' },
  { value: 'county-asc', label: 'County: A → Z' },
];

const SORT_OPTIONS_WITH_FIT = [
  { value: 'fit-desc', label: 'Fit Score: High → Low' },
  ...SORT_OPTIONS_BASE,
];

interface DiscoveryToolbarProps {
  products: Array<{ productId: string; name: string; subjectArea: string }>;
  productsLoading: boolean;
  selectedProductId: string | undefined;
  onProductChange: (productId: string | undefined) => void;

  searchQuery: string;
  onSearchChange: (query: string) => void;

  countyOptions: Array<{ value: string; label: string; count: number }>;
  selectedCounty: string | undefined;
  onCountyChange: (county: string | undefined) => void;

  selectedEnrollmentBand: string | undefined;
  onEnrollmentBandChange: (band: string | undefined) => void;

  selectedFitLevel: string | undefined;
  onFitLevelChange: (level: string | undefined) => void;

  sortOption: string;
  onSortChange: (sort: string) => void;
}

export function DiscoveryToolbar({
  products,
  productsLoading,
  selectedProductId,
  onProductChange,
  searchQuery,
  onSearchChange,
  countyOptions,
  selectedCounty,
  onCountyChange,
  selectedEnrollmentBand,
  onEnrollmentBandChange,
  selectedFitLevel,
  onFitLevelChange,
  sortOption,
  onSortChange,
}: DiscoveryToolbarProps) {
  const sortOptions = selectedProductId ? SORT_OPTIONS_WITH_FIT : SORT_OPTIONS_BASE;
  const productDisabled = products.length === 0 && !productsLoading;

  const productSelector = (
    <Select
      value={selectedProductId ?? '__all__'}
      onValueChange={(value) => onProductChange(value === '__all__' ? undefined : value)}
      disabled={productsLoading || productDisabled}
    >
      <SelectTrigger className="w-full md:w-52" aria-label="Select a product">
        <SelectValue placeholder="Select a product" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__">All Products</SelectItem>
        {products.map((p) => (
          <SelectItem key={p.productId} value={p.productId}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div
      role="search"
      aria-label="District filters"
      className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-3"
    >
      {/* Search */}
      <div className="relative w-full md:w-60">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search districts by name or city..."
          aria-label="Search districts by name or city"
          className="pl-8 pr-8"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Product selector */}
      {productDisabled ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full md:w-52">{productSelector}</div>
            </TooltipTrigger>
            <TooltipContent>
              Add products in Solutions Library to see fit scores
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="w-full md:w-52">{productSelector}</div>
      )}

      {/* County filter */}
      <Select
        value={selectedCounty ?? '__all__'}
        onValueChange={(value) => onCountyChange(value === '__all__' ? undefined : value)}
      >
        <SelectTrigger className="w-full md:w-44" aria-label="Filter by county">
          <SelectValue placeholder="All Counties" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Counties</SelectItem>
          {countyOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Enrollment filter */}
      <Select
        value={selectedEnrollmentBand ?? '__all__'}
        onValueChange={(value) =>
          onEnrollmentBandChange(value === '__all__' ? undefined : value)
        }
      >
        <SelectTrigger className="w-full md:w-48" aria-label="Filter by enrollment size">
          <SelectValue placeholder="All Sizes" />
        </SelectTrigger>
        <SelectContent>
          {ENROLLMENT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Fit filter (conditional) */}
      {selectedProductId && (
        <Select
          value={selectedFitLevel ?? '__all__'}
          onValueChange={(value) =>
            onFitLevelChange(value === '__all__' ? undefined : value)
          }
        >
          <SelectTrigger className="w-full md:w-44" aria-label="Filter by fit level">
            <SelectValue placeholder="All Fit Levels" />
          </SelectTrigger>
          <SelectContent>
            {FIT_LEVEL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Sort */}
      <Select value={sortOption} onValueChange={onSortChange}>
        <SelectTrigger className="w-full md:w-48" aria-label="Sort districts">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
