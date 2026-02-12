'use client';

import { FIT_CATEGORIES } from '@/services/types/controlled-vocabulary';

interface PlaybookFiltersProps {
  filters: {
    fitCategory?: string;
  };
  onFiltersChange: (filters: { fitCategory?: string }) => void;
}

export function PlaybookFilters({ filters, onFiltersChange }: PlaybookFiltersProps) {
  const handleFilterClick = (category: string | undefined) => {
    if (category === undefined) {
      // "All" clicked - clear filter
      onFiltersChange({});
    } else {
      onFiltersChange({ fitCategory: category });
    }
  };

  const isActive = (category: string | undefined) => {
    if (category === undefined) {
      return !filters.fitCategory;
    }
    return filters.fitCategory === category;
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleFilterClick(undefined)}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive(undefined)
            ? 'bg-primary text-primary-foreground'
            : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        All
      </button>

      {FIT_CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => handleFilterClick(category)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
            isActive(category)
              ? 'bg-primary text-primary-foreground'
              : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
