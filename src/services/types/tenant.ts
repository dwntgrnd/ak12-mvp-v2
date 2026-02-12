// TenantService domain types

export interface TenantSummary {
  tenantId: string;
  organizationName: string;
  status: 'active' | 'inactive';
  userCount: number;
  productCount: number;
  createdAt: string;         // ISO 8601
}

export interface CreateTenantRequest {
  organizationName: string;
  adminUser: {
    email: string;
    displayName: string;
  };
}

export interface OrganizationStatus {
  hasProducts: boolean;
  productCount: number;
  userPlaybookCount: number;   // scoped to current user, not org-wide
}
