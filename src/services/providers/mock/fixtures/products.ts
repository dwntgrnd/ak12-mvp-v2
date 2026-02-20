import type { Product, ProductSummary } from '../../../types/product';

export const MOCK_PRODUCTS: Product[] = [
  {
    productId: 'prod-001',
    tenantId: 'tenant-demo-001',
    name: 'EnvisionMath',
    description: 'Comprehensive K-8 mathematics program emphasizing problem-based learning, visual models, and personalized pathways. Aligned to Common Core and state standards with built-in assessment and differentiation tools.',
    gradeRange: { gradeFrom: 2, gradeTo: 8 },
    subjectArea: 'Mathematics',
    keyFeatures: [
      'Problem-based learning approach',
      'Visual Learning Bridge in every lesson',
      'Adaptive practice powered by Knewton',
      'Built-in formative and summative assessments',
      'Spanish language support for EL students',
    ],
    targetChallenges: [
      'Post-pandemic math proficiency recovery',
      'Conceptual understanding gaps',
      'Differentiation for diverse learners',
      'Teacher capacity for math instruction',
    ],
    competitiveDifferentiators: [
      'Only K-8 program with visual learning model in every lesson',
      'Integrated adaptive practice — no separate license needed',
      'Proven results in large urban districts',
    ],
    approvedMessaging: [
      'EnvisionMath helps students see the math, not just do the math.',
      'The only program that puts visual learning at the center of every lesson.',
    ],
    assets: [],
    createdAt: '2025-09-15T10:00:00Z',
    updatedAt: '2026-01-20T14:30:00Z',
  },
  {
    productId: 'prod-002',
    tenantId: 'tenant-demo-001',
    name: 'myPerspectives',
    description: 'Student-centered ELA curriculum built on culturally responsive texts and social-emotional learning frameworks. Supports grades 6-12 with authentic texts, media, and project-based assessments.',
    gradeRange: { gradeFrom: 6, gradeTo: 13 },
    subjectArea: 'English Language Arts',
    keyFeatures: [
      'Culturally responsive text selections',
      'Social-emotional learning integration',
      'Student choice in reading and writing',
      'Digital and print flexibility',
      'Standards-aligned writing workshops',
    ],
    targetChallenges: [
      'Student engagement in ELA',
      'Diverse text representation',
      'Writing proficiency gaps',
      'Preparing students for college-level literacy',
    ],
    competitiveDifferentiators: [
      'Most diverse text anthology in secondary ELA',
      'Only program integrating SEL and ELA standards together',
      'Student voice and choice built into every unit',
    ],
    approvedMessaging: [
      'myPerspectives puts students at the center of their own literacy journey.',
      'Every student deserves to see themselves in what they read.',
    ],
    assets: [],
    createdAt: '2025-08-01T09:00:00Z',
    updatedAt: '2026-01-18T11:00:00Z',
  },
];

function truncateAtWord(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '\u2026';
}

export function getMockProductSummaries(): ProductSummary[] {
  return MOCK_PRODUCTS.map((p) => ({
    productId: p.productId,
    name: p.name,
    description: truncateAtWord(p.description, 150),
    gradeRange: p.gradeRange,
    subjectArea: p.subjectArea,
    assetCount: p.assets.length,
  }));
}
