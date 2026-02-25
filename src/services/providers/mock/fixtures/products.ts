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
  {
    productId: 'prod-003',
    tenantId: 'tenant-demo-001',
    name: 'MathPath Adaptive',
    description: 'Adaptive math diagnostic and practice platform for grades 2–8 that identifies skill gaps through curriculum-aligned assessments and delivers personalized learning paths. Designed as a supplemental tool to work alongside any core math curriculum, with robust teacher reporting for intervention documentation and MTSS compliance.',
    gradeRange: { gradeFrom: 2, gradeTo: 8 },
    subjectArea: 'Mathematics',
    keyFeatures: [
      'Diagnostic assessment that pinpoints skill gaps to the sub-standard level',
      'Adaptive practice paths that adjust in real time based on student performance',
      'Teacher dashboard with actionable reports for grouping and reteaching',
      'Curriculum-agnostic design — works alongside any core math program',
      'Progress monitoring tools aligned to MTSS intervention documentation requirements',
    ],
    targetChallenges: [
      'Students performing two or more grade levels below in math',
      'Lack of actionable diagnostic data to guide intervention decisions',
      'Intervention documentation and MTSS compliance burden on teachers',
      'Delivering differentiated practice at scale without added prep time',
    ],
    competitiveDifferentiators: [
      'Diagnostic precision down to individual sub-standards, not just strand-level estimates',
      'Teacher-facing reports designed for action — grouping, reteaching, and progress monitoring in one view',
      'Integrates with any core curriculum rather than requiring a platform switch',
    ],
    approvedMessaging: [
      'MathPath Adaptive finds the gaps other assessments miss — and closes them.',
      'Give every math intervention a data-driven starting point.',
    ],
    assets: [],
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2026-01-22T09:00:00Z',
  },
  {
    productId: 'prod-004',
    tenantId: 'tenant-demo-001',
    name: 'ReadyReaders',
    description: 'Evidence-based K–5 literacy program built on the science of reading, featuring systematic phonics instruction, decodable readers at every level, and embedded vocabulary and fluency routines. Includes strong English learner scaffolding with visual supports and formative assessment checkpoints to ensure no student falls behind.',
    gradeRange: { gradeFrom: 0, gradeTo: 5 },
    subjectArea: 'English Language Arts',
    keyFeatures: [
      'Systematic, explicit phonics instruction following a structured literacy scope and sequence',
      'Decodable readers matched to each phonics unit for authentic practice',
      'Embedded English learner supports with visual vocabulary cards and oral language routines',
      'Formative assessment checkpoints every two weeks with automatic grouping recommendations',
      'Aligned to science of reading research and state structured literacy mandates',
    ],
    targetChallenges: [
      'Below-grade-level reading proficiency by the end of third grade',
      'Inconsistent foundational skills instruction across classrooms and schools',
      'English learner literacy gaps widening without targeted scaffolding',
      'Teachers needing structured literacy training and ready-to-use materials',
    ],
    competitiveDifferentiators: [
      'Full K–5 coherence — one program from phonemic awareness through fluent comprehension',
      'Deepest English learner scaffolding in the category with visual, oral, and written supports at every lesson',
      'Built on peer-reviewed science of reading research with transparent evidence citations',
    ],
    approvedMessaging: [
      'ReadyReaders gives every child the foundational skills to become a confident reader.',
      'Science of reading isn\'t a buzzword — it\'s every lesson in ReadyReaders.',
    ],
    assets: [],
    createdAt: '2025-07-15T08:00:00Z',
    updatedAt: '2026-01-15T16:00:00Z',
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
