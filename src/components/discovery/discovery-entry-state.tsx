import { DiscoveryInput } from './discovery-input';

interface DiscoveryEntryStateProps {
  onDirectNavigation: (districtId: string) => void;
}

export function DiscoveryEntryState({
  onDirectNavigation,
}: DiscoveryEntryStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--topbar-height)-120px)] -mt-[10vh]">
      <div className="w-full max-w-2xl text-center">
        {/* Page title */}
        <h1
          className="text-2xl font-bold text-foreground tracking-[-0.01em]"
          style={{ lineHeight: 1.2 }}
        >
          Discover your best-fit districts
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-sm font-normal text-foreground-secondary">
          Build winning playbooks with district insights and product alignment
        </p>

        {/* Input */}
        <div className="mt-6">
          <DiscoveryInput
            variant="full"
            onDirectNavigation={onDirectNavigation}
          />
        </div>

        {/* Helper text */}
        <p className="mt-3 text-xs font-medium text-foreground-tertiary max-w-[480px] mx-auto">
          Search by district name to explore profiles, view intelligence data, and generate sales
          playbooks.
        </p>
      </div>
    </div>
  );
}
