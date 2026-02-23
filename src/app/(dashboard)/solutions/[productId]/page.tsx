'use client';

import { use, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Check, Crosshair, Shield, MessageSquareQuote, RefreshCw, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlaybookCard } from '@/components/playbook/playbook-card';
import { useSidebar } from '@/components/layout/sidebar-context';
import { formatGradeRange } from '@/lib/utils/format';
import type { Product } from '@/services/types/product';
import type { PlaybookSummary } from '@/services/types/playbook';
import type { PaginatedResponse } from '@/services/types/common';
import type { SectionStatus } from '@/services/types/common';

function getSubjectBadgeClasses(subject: string): string {
  const lower = subject.toLowerCase();
  if (lower.includes('math'))
    return 'bg-brand-blue/10 text-brand-blue border-brand-blue/30';
  if (lower.includes('english') || lower.includes('ela') || lower.includes('language arts'))
    return 'bg-brand-green/10 text-brand-green border-brand-green/30';
  return 'bg-surface-emphasis-neutral text-foreground-secondary border-border';
}

function deriveOverallStatus(
  sectionStatuses: Record<string, SectionStatus>
): 'generating' | 'complete' | 'partial' | 'failed' {
  const statuses = Object.values(sectionStatuses);
  if (statuses.length === 0) return 'complete';
  if (statuses.every((s) => s === 'complete')) return 'complete';
  if (statuses.some((s) => s === 'generating' || s === 'pending')) return 'generating';
  if (statuses.some((s) => s === 'error')) return 'failed';
  return 'partial';
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = use(params);
  const { setBreadcrumbOverride } = useSidebar();

  const [product, setProduct] = useState<Product | null>(null);
  const [playbooks, setPlaybooks] = useState<PlaybookSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const [productRes, playbooksRes] = await Promise.all([
        fetch(`/api/products/${productId}`),
        fetch('/api/playbooks'),
      ]);

      if (productRes.status === 404) {
        setNotFound(true);
        return;
      }
      if (!productRes.ok) throw new Error('Failed to fetch product');
      if (!playbooksRes.ok) throw new Error('Failed to fetch playbooks');

      const productData: Product = await productRes.json();
      const playbooksData: PaginatedResponse<PlaybookSummary> = await playbooksRes.json();

      setProduct(productData);
      setPlaybooks(
        playbooksData.items.filter((pb) => pb.productIds.includes(productId))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (product) {
      setBreadcrumbOverride(product.name);
    }
    return () => setBreadcrumbOverride(null);
  }, [product, setBreadcrumbOverride]);

  if (loading) return <LoadingSkeleton />;

  if (notFound) {
    return (
      <div className="max-w-content flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">
          Product not found
        </h1>
        <p className="text-sm text-foreground-secondary mt-2 max-w-md">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button variant="outline" className="mt-6" asChild>
          <Link href="/solutions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Solutions Library
          </Link>
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-content flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">
          Something went wrong
        </h1>
        <p className="text-sm text-foreground-secondary mt-2 max-w-md">
          {error}
        </p>
        <Button variant="outline" className="mt-6" onClick={fetchData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (!product) return null;

  const gradeText = formatGradeRange(
    product.gradeRange.gradeFrom,
    product.gradeRange.gradeTo
  );

  const hasKeyFeatures = product.keyFeatures && product.keyFeatures.length > 0;
  const hasTargetChallenges = product.targetChallenges && product.targetChallenges.length > 0;
  const hasDifferentiators = product.competitiveDifferentiators && product.competitiveDifferentiators.length > 0;
  const hasMessaging = product.approvedMessaging && product.approvedMessaging.length > 0;
  const hasAnySections = hasKeyFeatures || hasTargetChallenges || hasDifferentiators || hasMessaging;

  return (
    <div className="max-w-content">
      {/* Zone 1 — Identity */}
      <div className="pb-6 border-b border-border-default">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`text-xs font-medium ${getSubjectBadgeClasses(product.subjectArea)}`}
          >
            {product.subjectArea}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs font-medium bg-surface-emphasis-neutral text-foreground-secondary border-border-default"
          >
            Grades {gradeText}
          </Badge>
        </div>

        <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground mt-3">
          {product.name}
        </h1>

        <p className="text-sm text-foreground-secondary leading-relaxed mt-2">
          {product.description}
        </p>
      </div>

      {/* Zone 2 — Content Sections */}
      {hasAnySections && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hasKeyFeatures && (
            <ContentSection
              icon={<Check className="h-4 w-4 text-success shrink-0 mt-0.5" />}
              title="Key Features"
            >
              <div className="space-y-2.5">
                {product.keyFeatures!.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </ContentSection>
          )}

          {hasTargetChallenges && (
            <ContentSection
              icon={<Crosshair className="h-4 w-4 text-warning shrink-0 mt-0.5" />}
              title="Target Challenges"
            >
              <div className="space-y-2.5">
                {product.targetChallenges!.map((challenge, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Crosshair className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{challenge}</span>
                  </div>
                ))}
              </div>
            </ContentSection>
          )}

          {hasDifferentiators && (
            <ContentSection
              icon={<Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />}
              title="Competitive Differentiators"
            >
              <div className="space-y-3">
                {product.competitiveDifferentiators!.map((diff, i) => (
                  <div
                    key={i}
                    className="bg-surface-inset rounded-md px-3 py-2"
                  >
                    <p className="text-sm font-medium text-foreground">{diff}</p>
                  </div>
                ))}
              </div>
            </ContentSection>
          )}

          {hasMessaging && (
            <ContentSection
              icon={<MessageSquareQuote className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />}
              title="Approved Messaging"
            >
              <div className="space-y-4">
                {product.approvedMessaging!.map((msg, i) => (
                  <div
                    key={i}
                    className="bg-surface-emphasis rounded-md px-3 py-2.5"
                  >
                    <p className="text-sm italic text-foreground">{msg}</p>
                  </div>
                ))}
              </div>
            </ContentSection>
          )}
        </div>
      )}

      {/* Zone 3 — Related Playbooks */}
      <div className="mt-8 pt-6 border-t border-border-default">
        <h2 className="text-lg font-semibold text-foreground tracking-[-0.01em] mb-4">
          Related Playbooks
        </h2>

        {playbooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playbooks.map((pb) => (
              <PlaybookCard
                key={pb.playbookId}
                playbook={{
                  playbookId: pb.playbookId,
                  districtName: pb.districtName,
                  fitAssessment: pb.fitAssessment,
                  productNames: pb.productNames,
                  generatedAt: pb.generatedAt,
                  overallStatus: deriveOverallStatus(pb.sectionStatuses),
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground-secondary">
            No playbooks have been generated with this product yet.
          </p>
        )}
      </div>
    </div>
  );
}

function ContentSection({
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border-default bg-card p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground-tertiary mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-content">
      {/* Identity skeleton */}
      <div className="pb-6 border-b border-border-default">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="h-7 w-64 mt-3" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-3/4 mt-1" />
      </div>

      {/* Content sections skeleton */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border-default bg-card p-5">
            <Skeleton className="h-4 w-32 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        ))}
      </div>

      {/* Playbooks skeleton */}
      <div className="mt-8 pt-6 border-t border-border-default">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border-default bg-card p-5">
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-5 w-20 mb-3" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
