'use client';

import { useState, useEffect, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DistrictCard } from '@/components/discovery/district-card';
import { DiscoveryToolbar } from '@/components/discovery/discovery-toolbar';
import { GeneratePlaybookSheet } from '@/components/playbook/generate-playbook-sheet';

// Local types — page types its own API response shape independently
interface DistrictListItem {
  districtId: string;
  name: string;
  state: string;
  location: string;
  enrollment: number;
  county: string;
}

interface ProductOption {
  productId: string;
  name: string;
  subjectArea: string;
}

interface FitData {
  fitScore: number;
  fitRationale: string;
}

export default function DiscoveryPage() {
  // Data
  const [districts, setDistricts] = useState<DistrictListItem[]>([]);
  const [districtsLoading, setDistrictsLoading] = useState(true);
  const [districtsError, setDistrictsError] = useState(false);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Product context + fit scores
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>();
  const [fitScores, setFitScores] = useState<Map<string, FitData>>(new Map());
  const [fitLoading, setFitLoading] = useState<Set<string>>(new Set());

  // Filters + sort
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCounty, setSelectedCounty] = useState<string | undefined>();
  const [selectedEnrollmentBand, setSelectedEnrollmentBand] = useState<string | undefined>();
  const [selectedFitLevel, setSelectedFitLevel] = useState<string | undefined>();
  const [sortOption, setSortOption] = useState('enrollment-desc');

  // Saved districts (optimistic, client-side only for MVP)
  const [savedDistrictIds, setSavedDistrictIds] = useState<Set<string>>(new Set());

  // GeneratePlaybookSheet
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetInitialDistrict, setSheetInitialDistrict] = useState<
    { districtId: string; districtName: string; location: string; enrollment: number } | undefined
  >();
  const [sheetInitialProductIds, setSheetInitialProductIds] = useState<string[]>([]);

  // --- Data fetching (on mount) ---
  useEffect(() => {
    fetch('/api/districts')
      .then((res) => res.json())
      .then((data) => {
        setDistricts(data.items || []);
        setDistrictsLoading(false);
      })
      .catch(() => {
        setDistrictsError(true);
        setDistrictsLoading(false);
      });

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(
          (data.items || []).map((p: Record<string, unknown>) => ({
            productId: p.productId as string,
            name: p.name as string,
            subjectArea: p.subjectArea as string,
          })),
        );
        setProductsLoading(false);
      })
      .catch(() => {
        setProductsLoading(false);
      });
  }, []);

  // --- Search debounce ---
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- Product selection handler ---
  function handleProductChange(productId: string | undefined) {
    setSelectedProductId(productId);
    setSelectedFitLevel(undefined);

    if (productId) {
      setSortOption('fit-desc');
      setFitScores(new Map());
      setFitLoading(new Set(districts.map((d) => d.districtId)));

      // Fire parallel requests — do NOT batch or serialize
      districts.forEach((district) => {
        fetch(
          `/api/districts/fit-assessment?districtId=${district.districtId}&productIds=${productId}`,
        )
          .then((res) => res.json())
          .then((assessment: FitData) => {
            setFitScores((prev) => new Map(prev).set(district.districtId, assessment));
            setFitLoading((prev) => {
              const next = new Set(prev);
              next.delete(district.districtId);
              return next;
            });
          })
          .catch(() => {
            setFitLoading((prev) => {
              const next = new Set(prev);
              next.delete(district.districtId);
              return next;
            });
          });
      });
    } else {
      setFitScores(new Map());
      setFitLoading(new Set());
      if (sortOption === 'fit-desc') setSortOption('enrollment-desc');
    }
  }

  // --- Client-side filtering ---
  const filteredDistricts = useMemo(() => {
    let result = [...districts];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (d) => d.name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q),
      );
    }
    if (selectedCounty) {
      result = result.filter((d) => d.county === selectedCounty);
    }
    if (selectedEnrollmentBand) {
      result = result.filter((d) => {
        switch (selectedEnrollmentBand) {
          case 'small':
            return d.enrollment < 5000;
          case 'medium':
            return d.enrollment >= 5000 && d.enrollment < 25000;
          case 'large':
            return d.enrollment >= 25000 && d.enrollment < 100000;
          case 'very-large':
            return d.enrollment >= 100000;
          default:
            return true;
        }
      });
    }
    if (selectedFitLevel && selectedProductId) {
      result = result.filter((d) => {
        const fit = fitScores.get(d.districtId);
        if (!fit) return false;
        switch (selectedFitLevel) {
          case 'strong':
            return fit.fitScore >= 7;
          case 'moderate':
            return fit.fitScore >= 4 && fit.fitScore < 7;
          case 'low':
            return fit.fitScore < 4;
          default:
            return true;
        }
      });
    }
    return result;
  }, [districts, debouncedSearch, selectedCounty, selectedEnrollmentBand, selectedFitLevel, selectedProductId, fitScores]);

  // --- Client-side sorting ---
  const sortedDistricts = useMemo(() => {
    const sorted = [...filteredDistricts];
    switch (sortOption) {
      case 'fit-desc':
        sorted.sort((a, b) => {
          const fitA = fitScores.get(a.districtId)?.fitScore ?? -1;
          const fitB = fitScores.get(b.districtId)?.fitScore ?? -1;
          if (fitB !== fitA) return fitB - fitA;
          return b.enrollment - a.enrollment;
        });
        break;
      case 'enrollment-desc':
        sorted.sort((a, b) => b.enrollment - a.enrollment);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'county-asc':
        sorted.sort((a, b) => a.county.localeCompare(b.county));
        break;
    }
    return sorted;
  }, [filteredDistricts, sortOption, fitScores]);

  // --- County options (derived from loaded data) ---
  const countyOptions = useMemo(() => {
    const counts = new Map<string, number>();
    districts.forEach((d) => counts.set(d.county, (counts.get(d.county) || 0) + 1));
    return Array.from(counts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([county, count]) => ({ value: county, label: `${county} (${count})`, count }));
  }, [districts]);

  // --- Result count text ---
  function getResultCountText(): string {
    const filtered = sortedDistricts.length;
    const total = districts.length;
    const productName = products.find((p) => p.productId === selectedProductId)?.name;
    if (filtered === total && !productName) return `${total} districts`;
    if (filtered === total && productName) return `${total} districts \u00b7 ${productName} fit`;
    if (filtered !== total && !productName) return `${filtered} of ${total} districts`;
    return `${filtered} of ${total} districts \u00b7 ${productName} fit`;
  }

  // --- Generate playbook handler ---
  function handleGeneratePlaybook(
    district: { districtId: string; name: string; location: string; enrollment: number },
    productId: string,
  ) {
    setSheetInitialDistrict({
      districtId: district.districtId,
      districtName: district.name,
      location: district.location,
      enrollment: district.enrollment,
    });
    setSheetInitialProductIds([productId]);
    setSheetOpen(true);
  }

  // --- Save / remove handlers ---
  function handleSave(districtId: string) {
    setSavedDistrictIds((prev) => new Set(prev).add(districtId));
  }

  function handleRemoveSaved(districtId: string) {
    setSavedDistrictIds((prev) => {
      const next = new Set(prev);
      next.delete(districtId);
      return next;
    });
  }

  // --- Retry handler ---
  function handleRetry() {
    setDistrictsError(false);
    setDistrictsLoading(true);
    fetch('/api/districts')
      .then((res) => res.json())
      .then((data) => {
        setDistricts(data.items || []);
        setDistrictsLoading(false);
      })
      .catch(() => {
        setDistrictsError(true);
        setDistrictsLoading(false);
      });
  }

  const selectedProductName = products.find((p) => p.productId === selectedProductId)?.name;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Discovery &amp; Targeting</h1>

      <DiscoveryToolbar
        products={products}
        productsLoading={productsLoading}
        selectedProductId={selectedProductId}
        onProductChange={handleProductChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        countyOptions={countyOptions}
        selectedCounty={selectedCounty}
        onCountyChange={setSelectedCounty}
        selectedEnrollmentBand={selectedEnrollmentBand}
        onEnrollmentBandChange={setSelectedEnrollmentBand}
        selectedFitLevel={selectedFitLevel}
        onFitLevelChange={setSelectedFitLevel}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      {/* Result count */}
      {!districtsLoading && !districtsError && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {getResultCountText()}
        </p>
      )}

      {/* Loading state */}
      {districtsLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      )}

      {/* Error state */}
      {districtsError && (
        <Alert variant="destructive">
          <AlertTitle>Couldn&apos;t load districts</AlertTitle>
          <AlertDescription className="flex items-center gap-3">
            Something went wrong loading district data.
            <Button variant="outline" size="sm" onClick={handleRetry}>
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Empty filter state */}
      {!districtsLoading && !districtsError && sortedDistricts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No districts match your current filters</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try broadening your search or adjusting filters.
          </p>
        </div>
      )}

      {/* District card list */}
      {!districtsLoading && !districtsError && sortedDistricts.length > 0 && (
        <div className="flex flex-col gap-3" role="list">
          {sortedDistricts.map((district) => (
            <DistrictCard
              key={district.districtId}
              district={district}
              fitAssessment={fitScores.get(district.districtId)}
              fitLoading={fitLoading.has(district.districtId)}
              selectedProductId={selectedProductId}
              selectedProductName={selectedProductName}
              isSaved={savedDistrictIds.has(district.districtId)}
              onSave={handleSave}
              onRemoveSaved={handleRemoveSaved}
              onGeneratePlaybook={handleGeneratePlaybook}
            />
          ))}
        </div>
      )}

      <GeneratePlaybookSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        initialDistrict={sheetInitialDistrict}
        initialProductIds={sheetInitialProductIds}
      />
    </div>
  );
}
