'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { SavedDistrict, ExcludedDistrict } from '@/services/types/district';
import { ExcludeModal } from '@/components/district/exclude-modal';

const CATEGORY_LABELS: Record<string, string> = {
  already_customer: 'Already a customer',
  not_a_fit: 'Not a fit',
  budget_timing: 'Budget/timing issue',
  other: 'Other',
};

export default function SavedDistrictsPage() {
  const [activeTab, setActiveTab] = useState<'saved' | 'excluded'>('saved');
  const [savedDistricts, setSavedDistricts] = useState<SavedDistrict[]>([]);
  const [excludedDistricts, setExcludedDistricts] = useState<ExcludedDistrict[]>([]);
  const [loading, setLoading] = useState(false);
  const [excludingDistrictId, setExcludingDistrictId] = useState<string | null>(null);

  // Fetch saved districts
  const fetchSavedDistricts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/districts/saved');
      if (!response.ok) throw new Error('Failed to fetch saved districts');
      const data = await response.json();
      setSavedDistricts(data.items || []);
    } catch (error) {
      console.error('Error fetching saved districts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch excluded districts
  const fetchExcludedDistricts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/districts/excluded');
      if (!response.ok) throw new Error('Failed to fetch excluded districts');
      const data = await response.json();
      setExcludedDistricts(data.items || []);
    } catch (error) {
      console.error('Error fetching excluded districts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'saved') {
      fetchSavedDistricts();
    } else {
      fetchExcludedDistricts();
    }
  }, [activeTab]);

  // Remove from saved list
  const handleRemove = async (districtId: string) => {
    try {
      const response = await fetch(`/api/districts/${districtId}/save`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove district');

      // Remove from local state
      setSavedDistricts((prev) =>
        prev.filter((d) => d.districtId !== districtId)
      );
    } catch (error) {
      console.error('Error removing district:', error);
    }
  };

  // Restore excluded district
  const handleRestore = async (districtId: string) => {
    try {
      const response = await fetch(`/api/districts/${districtId}/restore`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to restore district');

      // Remove from local state
      setExcludedDistricts((prev) =>
        prev.filter((d) => d.districtId !== districtId)
      );
    } catch (error) {
      console.error('Error restoring district:', error);
    }
  };

  // Handle exclusion from saved tab
  const handleExcluded = (districtId: string) => {
    // Remove from saved list (backend auto-removes from saved_districts)
    setSavedDistricts((prev) =>
      prev.filter((d) => d.districtId !== districtId)
    );
    setExcludingDistrictId(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading">Saved Districts</h1>
        <p className="text-muted-foreground mt-1">
          Manage your territory — saved and excluded districts.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'saved'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Saved
          </button>
          <button
            onClick={() => setActiveTab('excluded')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'excluded'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Excluded
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading...
        </div>
      ) : activeTab === 'saved' ? (
        // Saved tab
        savedDistricts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No saved districts yet. Browse the Discovery page to find and save
              districts.
            </p>
            <Link
              href="/discovery"
              className="text-primary hover:underline font-medium"
            >
              Go to Discovery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedDistricts.map((district) => (
              <div
                key={district.districtId}
                className="border rounded-lg p-4 bg-card"
              >
                <Link
                  href={`/districts/${district.districtId}`}
                  className="block hover:text-primary transition-colors"
                >
                  <h3 className="font-semibold text-lg mb-1">
                    {district.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {district.location}
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-medium">
                      {district.enrollment.toLocaleString()}
                    </span>{' '}
                    <span className="text-muted-foreground">students</span>
                  </p>
                </Link>
                <div className="flex items-center justify-between pt-3 mt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    Saved on {new Date(district.savedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setExcludingDistrictId(district.districtId)}
                      className="text-xs px-3 py-1 border rounded hover:bg-muted transition-colors"
                    >
                      Exclude
                    </button>
                    <button
                      onClick={() => handleRemove(district.districtId)}
                      className="text-xs px-3 py-1 border border-destructive text-destructive rounded hover:bg-destructive/10 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // Excluded tab
        excludedDistricts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No excluded districts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {excludedDistricts.map((district) => (
              <div
                key={district.districtId}
                className="border rounded-lg p-4 bg-card"
              >
                <Link
                  href={`/districts/${district.districtId}`}
                  className="block hover:text-primary transition-colors"
                >
                  <h3 className="font-semibold text-lg mb-1">
                    {district.districtName}
                  </h3>
                </Link>
                <div className="mt-3 space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Reason</p>
                    <p className="text-sm font-medium">
                      {CATEGORY_LABELS[district.reason.category] ||
                        district.reason.category}
                    </p>
                    {district.reason.note && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {district.reason.note}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                      Excluded on{' '}
                      {new Date(district.excludedAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleRestore(district.districtId)}
                      className="text-xs px-3 py-1 border rounded hover:bg-muted transition-colors"
                    >
                      Restore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Exclude modal */}
      {excludingDistrictId && (
        <ExcludeModal
          districtId={excludingDistrictId}
          onClose={() => setExcludingDistrictId(null)}
          onExcluded={() => handleExcluded(excludingDistrictId)}
        />
      )}
    </div>
  );
}
