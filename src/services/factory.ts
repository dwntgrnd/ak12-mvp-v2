import type { IPlaybookService } from './interfaces/playbook-service';
import type { IProductService } from './interfaces/product-service';
import type { IConfigService } from './interfaces/config-service';
import type { IDistrictService } from './interfaces/district-service';

// Provider type — determines which implementation is used
type ProviderType = 'mock' | 'local' | 'api';

function getProviderType(): ProviderType {
  const provider = process.env.NEXT_PUBLIC_SERVICE_PROVIDER || 'mock';
  return provider as ProviderType;
}

// Lazy imports to avoid loading all providers
export async function getPlaybookService(): Promise<IPlaybookService> {
  const provider = getProviderType();
  switch (provider) {
    case 'mock': {
      const { mockPlaybookService } = await import('./providers/mock');
      return mockPlaybookService;
    }
    // case 'local': { ... }  // Phase 3B+ — Prisma-based
    // case 'api': { ... }    // Future — partner API
    default:
      throw new Error(`Unknown provider type: ${provider}`);
  }
}

export async function getProductService(): Promise<IProductService> {
  const provider = getProviderType();
  switch (provider) {
    case 'mock': {
      const { mockProductService } = await import('./providers/mock');
      return mockProductService;
    }
    default:
      throw new Error(`Unknown provider type: ${provider}`);
  }
}

export async function getConfigService(): Promise<IConfigService> {
  const provider = getProviderType();
  switch (provider) {
    case 'mock': {
      const { mockConfigService } = await import('./providers/mock');
      return mockConfigService;
    }
    default:
      throw new Error(`Unknown provider type: ${provider}`);
  }
}

// DistrictService will use 'local' provider (Prisma) in Phase 3B+
// For now, include a mock stub if needed
export async function getDistrictService(): Promise<IDistrictService> {
  const provider = getProviderType();
  switch (provider) {
    case 'mock': {
      const { mockDistrictService } = await import('./providers/mock');
      return mockDistrictService;
    }
    default:
      throw new Error(`Unknown provider type: ${provider}`);
  }
}
