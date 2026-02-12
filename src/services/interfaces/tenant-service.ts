// TenantService interface

import type { TenantSummary, CreateTenantRequest, OrganizationStatus } from '../types/tenant';

export interface ITenantService {
  // Authorization: super-admin only
  // Errors: DUPLICATE_ORGANIZATION, INVALID_ADMIN_EMAIL
  createTenant(request: CreateTenantRequest): Promise<TenantSummary>;

  // Authorization: super-admin only
  getTenants(): Promise<TenantSummary[]>;

  // Authorization: super-admin only
  // Errors: TENANT_NOT_FOUND
  getTenantStatus(tenantId: string): Promise<TenantSummary>;

  // Authorization: any authenticated user (scoped to own tenant)
  getOrganizationStatus(): Promise<OrganizationStatus>;
}
