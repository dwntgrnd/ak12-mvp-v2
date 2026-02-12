import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getDistrict } from '@/services/district-service';
import { DemographicsSection } from '@/components/district/demographics-section';
import { ProficiencySection } from '@/components/district/proficiency-section';
import { FundingSection } from '@/components/district/funding-section';
import { FitAssessmentPanel } from '@/components/district/fit-assessment-panel';
import { DataField } from '@/components/district/data-field';
import { SaveButton } from '@/components/district/save-button';
import { ExcludeButton } from '@/components/district/exclude-button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ districtId: string }>;
}) {
  try {
    const { districtId } = await params;
    const district = await getDistrict(districtId);
    return {
      title: district.name,
    };
  } catch (error) {
    return {
      title: 'District Profile',
    };
  }
}

export default async function DistrictProfilePage({
  params,
}: {
  params: Promise<{ districtId: string }>;
}) {
  const { districtId } = await params;

  let district;
  try {
    district = await getDistrict(districtId);
  } catch (error) {
    notFound();
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back navigation */}
      <Link
        href="/discovery"
        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Discovery
      </Link>

      {/* Header section */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-bold font-heading">
            {district.name}
          </h1>
          <div className="flex items-center gap-2">
            <SaveButton districtId={districtId} />
            <ExcludeButton districtId={districtId} />
          </div>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <span>
            {district.location}, {district.county}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
            {district.enrollment.toLocaleString()} students
          </span>
        </div>
      </div>

      {/* Data sections */}
      <div className="space-y-8">
        {/* Demographics */}
        <div className="border rounded-lg p-6 bg-card">
          <DemographicsSection demographics={district.demographics} />
        </div>

        {/* Proficiency */}
        <div className="border rounded-lg p-6 bg-card">
          <ProficiencySection proficiency={district.proficiency} />
        </div>

        {/* Funding */}
        <div className="border rounded-lg p-6 bg-card">
          <FundingSection funding={district.funding} />
        </div>

        {/* Additional Data (if any) */}
        {district.additionalData &&
          Object.keys(district.additionalData).length > 0 && (
            <div className="border rounded-lg p-6 bg-card">
              <h2 className="text-lg font-semibold font-heading mb-4">
                Additional Data
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(district.additionalData).map(([key, value]) => (
                  <DataField
                    key={key}
                    label={key}
                    value={
                      typeof value === 'string' || typeof value === 'number'
                        ? value
                        : JSON.stringify(value)
                    }
                    format="text"
                  />
                ))}
              </div>
            </div>
          )}

        {/* Fit Assessment Panel */}
        <FitAssessmentPanel districtId={districtId} />
      </div>
    </div>
  );
}
