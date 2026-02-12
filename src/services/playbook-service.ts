// Playbook service implementation

import { prisma } from '@/lib/prisma';
import * as districtService from './district-service';
import type {
  PlaybookSummary,
  Playbook,
  PlaybookSection,
  PlaybookFilters,
  PlaybookStatusResponse
} from './types/playbook';
import type { FitAssessment } from './types/common';

// Section type definitions
const SECTION_DEFINITIONS = [
  { type: 'key_themes', label: 'Key Themes', source: 'synthesis' },
  { type: 'product_fit', label: 'Product Fit Analysis', source: 'synthesis' },
  { type: 'objections', label: 'Anticipated Objections', source: 'synthesis' },
  { type: 'stakeholders', label: 'Key Stakeholders', source: 'constrained' },
  { type: 'district_data', label: 'District Data Summary', source: 'verbatim' },
  { type: 'fit_assessment', label: 'Fit Assessment', source: 'hybrid' }
] as const;

/**
 * Mock AI content generator
 * Produces template-based content using real district and product data
 */
function generateSectionContent(
  sectionType: string,
  district: any,
  products: any[],
  fitAssessment: FitAssessment
): string {
  const productNames = products.map(p => p.name).join(', ');
  const proficiency = district.proficiency as Record<string, number>;
  const avgProficiency = ['Math', 'ELA', 'Science']
    .map(key => proficiency[key])
    .filter((val): val is number => typeof val === 'number')
    .reduce((sum, val, _, arr) => sum + val / arr.length, 0);

  switch (sectionType) {
    case 'key_themes':
      return `${district.name} serves ${district.enrollment.toLocaleString()} students in ${district.county} County and presents several key opportunities for ${productNames}.\n\nThe district's proficiency data shows an average of ${avgProficiency.toFixed(1)}% across core subjects, with Math at ${proficiency.Math || 'N/A'}%, ELA at ${proficiency.ELA || 'N/A'}%, and Science at ${proficiency.Science || 'N/A'}%. This performance profile suggests specific intervention needs that align with your product offerings.\n\nDistrict demographics indicate a diverse student population with varying support needs. The scale of ${district.enrollment.toLocaleString()} students provides substantial market opportunity, while the district's location in ${district.county} County positions it within a competitive educational landscape.\n\nKey talking points should emphasize how ${productNames} directly addresses the district's demonstrated needs, particularly in areas where proficiency scores indicate room for improvement. The combination of district size and performance metrics makes this a ${fitAssessment.fitCategory}-fit opportunity.`;

    case 'product_fit':
      return `Your products (${productNames}) demonstrate strong alignment with ${district.name}'s specific needs and challenges.\n\n${fitAssessment.fitRationale}\n\nThe district's enrollment of ${district.enrollment.toLocaleString()} students represents a significant implementation opportunity. With average proficiency at ${avgProficiency.toFixed(1)}%, there's clear evidence of needs that your solutions can address.\n\nProduct-district alignment is particularly strong because your offerings target the exact challenges this district faces. The scale and characteristics of ${district.name} make it an ideal candidate for your solutions. Consider emphasizing ROI based on student population size and the measurable impact your products can deliver in similar districts.`;

    case 'objections':
      return `When approaching ${district.name}, anticipate several common objections and prepare responses:\n\n**Budget Constraints**: Districts often cite limited funding. Counter by emphasizing ROI and existing budget allocations for similar initiatives. Reference the district's enrollment of ${district.enrollment.toLocaleString()} students to demonstrate per-student cost efficiency.\n\n**Existing Vendor Relationships**: The district may have incumbent providers. Highlight your competitive differentiators and offer pilot programs to demonstrate value. Focus on complementary positioning rather than full replacement.\n\n**Change Management Concerns**: Implementation challenges are common objections. Emphasize your implementation support, training programs, and success stories from similar-sized districts. Address the specific scale of ${district.enrollment.toLocaleString()} students with concrete rollout strategies.\n\n**Evidence Requirements**: Districts need proof of efficacy. Prepare case studies from comparable districts, particularly those with similar proficiency profiles (${avgProficiency.toFixed(1)}% average). Offer assessment periods with clear success metrics.`;

    case 'stakeholders':
      return `**Superintendent**: Primary decision-maker for district-wide initiatives. Approach with ROI focus, emphasizing impact on ${district.enrollment.toLocaleString()} students and alignment with district improvement goals.\n\n**Curriculum Director**: Key influencer on instructional materials. Present evidence of efficacy, particularly data showing improvement in districts with similar proficiency levels (average ${avgProficiency.toFixed(1)}%).\n\n**Technology Director**: Important if solutions involve digital components. Address integration, training, and support requirements. Emphasize ease of implementation.\n\n**Principal Coalition**: Building leaders influence adoption. Consider targeting schools with greatest need first (those below district average). Build champions who can advocate internally.\n\n**School Board**: Ultimate approval authority for significant expenditures. Prepare board-ready presentations with clear outcomes, timelines, and budget justification.\n\n**Start with Curriculum Director to build internal advocacy, then elevate to Superintendent with their support.**`;

    case 'district_data':
      return `**District**: ${district.name}\n**Location**: ${district.location}\n**County**: ${district.county}\n**Enrollment**: ${district.enrollment.toLocaleString()} students\n\n**Proficiency Rates**:\n- Math: ${proficiency.Math || 'N/A'}%\n- ELA: ${proficiency.ELA || 'N/A'}%\n- Science: ${proficiency.Science || 'N/A'}%\n- Average: ${avgProficiency.toFixed(1)}%\n\n**Demographics**: ${JSON.stringify(district.demographics, null, 2)}\n\n**Funding**: ${JSON.stringify(district.funding, null, 2)}\n\nThis data snapshot provides key talking points for your conversation. Reference specific metrics when discussing district needs and how ${productNames} can drive improvement.`;

    case 'fit_assessment':
      return `**Fit Category**: ${fitAssessment.fitCategory.toUpperCase()}\n\n**Assessment**:\n${fitAssessment.fitRationale}\n\n**Recommended Approach**:\n${{
        'strong': `This is a high-priority opportunity. Lead with the strong alignment between district needs (${avgProficiency.toFixed(1)}% average proficiency) and your solutions. Schedule a discovery meeting with the Curriculum Director within the next two weeks. Prepare a customized pitch deck highlighting success stories from similar districts.`,
        'moderate': `This represents a solid opportunity worth pursuing. While alignment exists, you'll need to make a compelling case for prioritization. Focus on differentiators and be prepared to demonstrate clear ROI. Consider a lower-touch approach initially, such as a webinar or case study presentation, before requesting an in-person meeting.`,
        'low': `Consider this a lower-priority opportunity. While ${district.name} may benefit from your solutions, resource constraints or market characteristics suggest focusing effort on stronger-fit districts first. Keep them in your pipeline for future outreach but allocate primary resources to higher-potential opportunities.`
      }[fitAssessment.fitCategory]}\n\n**Next Steps**: Review the stakeholder section for recommended contact sequence. Prepare your pitch emphasizing the ${fitAssessment.fitCategory}-fit rationale above.`;

    default:
      return `Content for ${sectionType} section.`;
  }
}

/**
 * Run the actual generation process for a playbook
 * Updates section statuses and content in-place
 */
async function runPlaybookGeneration(
  playbookId: string,
  districtId: string,
  productIds: string[]
): Promise<void> {
  try {
    // Get district data
    const district = await districtService.getDistrict(districtId);

    // Get products
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isDeleted: false
      }
    });

    // Get fit assessment
    const fitAssessment = await districtService.getDistrictFitAssessment(
      districtId,
      productIds
    );

    // Get all sections for this playbook
    const sections = await prisma.playbookSection.findMany({
      where: { playbookId },
      orderBy: { createdAt: 'asc' }
    });

    let completedCount = 0;
    let errorCount = 0;

    // Generate each section sequentially
    for (const section of sections) {
      try {
        // Update to generating
        await prisma.playbookSection.update({
          where: { id: section.id },
          data: { status: 'generating' }
        });

        // Generate content
        const content = generateSectionContent(
          section.sectionType,
          district,
          products,
          fitAssessment
        );

        // Update to complete
        await prisma.playbookSection.update({
          where: { id: section.id },
          data: {
            status: 'complete',
            content
          }
        });

        completedCount++;
      } catch (error: any) {
        // Mark section as error
        await prisma.playbookSection.update({
          where: { id: section.id },
          data: {
            status: 'error',
            errorMessage: error.message || 'Generation failed'
          }
        });

        errorCount++;
      }
    }

    // Update overall playbook status
    let overallStatus: string;
    if (errorCount === 0) {
      overallStatus = 'complete';
    } else if (completedCount > 0) {
      overallStatus = 'partial';
    } else {
      overallStatus = 'failed';
    }

    await prisma.playbook.update({
      where: { id: playbookId },
      data: { overallStatus }
    });
  } catch (error) {
    // Fatal error - mark playbook as failed
    await prisma.playbook.update({
      where: { id: playbookId },
      data: { overallStatus: 'failed' }
    });

    console.error('Playbook generation failed:', error);
  }
}

/**
 * Generate a new playbook
 * Returns immediately with playbookId, generation runs in background
 */
export async function generatePlaybook(
  userId: string,
  districtId: string,
  productIds: string[]
): Promise<{ playbookId: string }> {
  // Verify district exists
  const district = await districtService.getDistrict(districtId);

  // Verify products exist
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isDeleted: false
    }
  });

  if (products.length === 0) {
    const error: any = new Error('No valid products found');
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }

  // Get fit assessment for storage
  const fitAssessment = await districtService.getDistrictFitAssessment(
    districtId,
    productIds
  );

  // Create playbook record
  const playbook = await prisma.playbook.create({
    data: {
      userId,
      districtId,
      districtName: district.name,
      productIds,
      productNames: products.map(p => p.name),
      fitCategory: fitAssessment.fitCategory,
      fitRationale: fitAssessment.fitRationale,
      overallStatus: 'generating'
    }
  });

  // Create section records
  await prisma.playbookSection.createMany({
    data: SECTION_DEFINITIONS.map(def => ({
      playbookId: playbook.id,
      sectionType: def.type,
      sectionLabel: def.label,
      contentSource: def.source,
      status: 'pending'
    }))
  });

  // Fire-and-forget generation (don't await)
  runPlaybookGeneration(playbook.id, districtId, productIds).catch(err => {
    console.error('Background generation error:', err);
  });

  return { playbookId: playbook.id };
}

/**
 * Get playbook generation status
 */
export async function getPlaybookStatus(
  userId: string,
  playbookId: string
): Promise<PlaybookStatusResponse> {
  const playbook = await prisma.playbook.findUnique({
    where: { id: playbookId },
    include: {
      sections: {
        select: {
          id: true,
          sectionType: true,
          status: true
        }
      }
    }
  });

  if (!playbook || playbook.userId !== userId) {
    const error: any = new Error('Playbook not found');
    error.code = 'PLAYBOOK_NOT_FOUND';
    throw error;
  }

  return {
    playbookId: playbook.id,
    overallStatus: playbook.overallStatus as any,
    sections: playbook.sections.map(section => ({
      sectionId: section.id,
      sectionType: section.sectionType,
      status: section.status as any
    }))
  };
}

/**
 * Get full playbook with all sections
 */
export async function getPlaybook(
  userId: string,
  playbookId: string
): Promise<Playbook> {
  const playbook = await prisma.playbook.findUnique({
    where: { id: playbookId },
    include: {
      sections: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!playbook || playbook.userId !== userId) {
    const error: any = new Error('Playbook not found');
    error.code = 'PLAYBOOK_NOT_FOUND';
    throw error;
  }

  return {
    playbookId: playbook.id,
    districtId: playbook.districtId,
    districtName: playbook.districtName,
    productIds: playbook.productIds,
    productNames: playbook.productNames,
    fitAssessment: {
      fitCategory: playbook.fitCategory as any,
      fitRationale: playbook.fitRationale
    },
    generatedAt: playbook.generatedAt.toISOString(),
    sections: playbook.sections.map(section => ({
      sectionId: section.id,
      sectionType: section.sectionType,
      sectionLabel: section.sectionLabel,
      contentSource: section.contentSource as any,
      status: section.status as any,
      content: section.content || undefined,
      isEdited: section.isEdited,
      lastEditedAt: section.lastEditedAt?.toISOString(),
      errorMessage: section.errorMessage || undefined,
      retryable: section.retryable
    }))
  };
}

/**
 * Get a specific playbook section
 */
export async function getPlaybookSection(
  userId: string,
  playbookId: string,
  sectionId: string
): Promise<PlaybookSection> {
  // Verify playbook ownership
  const playbook = await prisma.playbook.findUnique({
    where: { id: playbookId }
  });

  if (!playbook || playbook.userId !== userId) {
    const error: any = new Error('Playbook not found');
    error.code = 'PLAYBOOK_NOT_FOUND';
    throw error;
  }

  // Get section
  const section = await prisma.playbookSection.findUnique({
    where: { id: sectionId }
  });

  if (!section || section.playbookId !== playbookId) {
    const error: any = new Error('Section not found');
    error.code = 'SECTION_NOT_FOUND';
    throw error;
  }

  return {
    sectionId: section.id,
    sectionType: section.sectionType,
    sectionLabel: section.sectionLabel,
    contentSource: section.contentSource as any,
    status: section.status as any,
    content: section.content || undefined,
    isEdited: section.isEdited,
    lastEditedAt: section.lastEditedAt?.toISOString(),
    errorMessage: section.errorMessage || undefined,
    retryable: section.retryable
  };
}

/**
 * Get playbooks with optional filters
 */
export async function getPlaybooks(
  userId: string,
  filters?: PlaybookFilters
): Promise<PlaybookSummary[]> {
  const where: any = { userId };

  // Apply fit category filter
  if (filters?.fitCategory) {
    where.fitCategory = filters.fitCategory;
  }

  // Determine sort field and order
  const sortBy = filters?.sortBy || 'generatedAt';
  const sortOrder = filters?.sortOrder || 'desc';

  const playbooks = await prisma.playbook.findMany({
    where,
    include: {
      sections: {
        select: {
          isEdited: true,
          status: true,
          sectionType: true
        }
      }
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });

  return playbooks.map(playbook => ({
    playbookId: playbook.id,
    districtId: playbook.districtId,
    districtName: playbook.districtName,
    productIds: playbook.productIds,
    productNames: playbook.productNames,
    fitAssessment: {
      fitCategory: playbook.fitCategory as any,
      fitRationale: playbook.fitRationale
    },
    generatedAt: playbook.generatedAt.toISOString(),
    hasEditedSections: playbook.sections.some(s => s.isEdited),
    sectionStatuses: playbook.sections.reduce((acc, section) => {
      acc[section.sectionType] = section.status as any;
      return acc;
    }, {} as Record<string, any>)
  }));
}

/**
 * Get existing playbooks for a district
 */
export async function getExistingPlaybooks(
  userId: string,
  districtId: string
): Promise<PlaybookSummary[]> {
  // Verify district exists
  await districtService.getDistrict(districtId);

  const playbooks = await prisma.playbook.findMany({
    where: {
      userId,
      districtId
    },
    include: {
      sections: {
        select: {
          isEdited: true,
          status: true,
          sectionType: true
        }
      }
    },
    orderBy: {
      generatedAt: 'desc'
    }
  });

  return playbooks.map(playbook => ({
    playbookId: playbook.id,
    districtId: playbook.districtId,
    districtName: playbook.districtName,
    productIds: playbook.productIds,
    productNames: playbook.productNames,
    fitAssessment: {
      fitCategory: playbook.fitCategory as any,
      fitRationale: playbook.fitRationale
    },
    generatedAt: playbook.generatedAt.toISOString(),
    hasEditedSections: playbook.sections.some(s => s.isEdited),
    sectionStatuses: playbook.sections.reduce((acc, section) => {
      acc[section.sectionType] = section.status as any;
      return acc;
    }, {} as Record<string, any>)
  }));
}

/**
 * Update a playbook section's content
 */
export async function updatePlaybookSection(
  userId: string,
  playbookId: string,
  sectionId: string,
  content: string
): Promise<PlaybookSection> {
  // Verify playbook ownership
  const playbook = await prisma.playbook.findUnique({
    where: { id: playbookId }
  });

  if (!playbook || playbook.userId !== userId) {
    const error: any = new Error('Playbook not found');
    error.code = 'PLAYBOOK_NOT_FOUND';
    throw error;
  }

  // Verify section exists
  const section = await prisma.playbookSection.findUnique({
    where: { id: sectionId }
  });

  if (!section || section.playbookId !== playbookId) {
    const error: any = new Error('Section not found');
    error.code = 'SECTION_NOT_FOUND';
    throw error;
  }

  // Update section
  const updated = await prisma.playbookSection.update({
    where: { id: sectionId },
    data: {
      content,
      isEdited: true,
      lastEditedAt: new Date()
    }
  });

  return {
    sectionId: updated.id,
    sectionType: updated.sectionType,
    sectionLabel: updated.sectionLabel,
    contentSource: updated.contentSource as any,
    status: updated.status as any,
    content: updated.content || undefined,
    isEdited: updated.isEdited,
    lastEditedAt: updated.lastEditedAt?.toISOString(),
    errorMessage: updated.errorMessage || undefined,
    retryable: updated.retryable
  };
}

/**
 * Regenerate a section
 * Returns immediately, generation runs in background
 */
export async function regenerateSection(
  userId: string,
  playbookId: string,
  sectionId: string
): Promise<{ status: 'generating' }> {
  // Verify playbook ownership
  const playbook = await prisma.playbook.findUnique({
    where: { id: playbookId }
  });

  if (!playbook || playbook.userId !== userId) {
    const error: any = new Error('Playbook not found');
    error.code = 'PLAYBOOK_NOT_FOUND';
    throw error;
  }

  // Verify section exists and is retryable
  const section = await prisma.playbookSection.findUnique({
    where: { id: sectionId }
  });

  if (!section || section.playbookId !== playbookId) {
    const error: any = new Error('Section not found');
    error.code = 'SECTION_NOT_FOUND';
    throw error;
  }

  if (!section.retryable) {
    const error: any = new Error('Section is not regenerable');
    error.code = 'NOT_REGENERABLE';
    throw error;
  }

  // Update section to generating
  await prisma.playbookSection.update({
    where: { id: sectionId },
    data: {
      status: 'generating',
      errorMessage: null
    }
  });

  // Fire-and-forget regeneration
  (async () => {
    try {
      // Get district and products from playbook
      const district = await districtService.getDistrict(playbook.districtId);
      const products = await prisma.product.findMany({
        where: {
          id: { in: playbook.productIds },
          isDeleted: false
        }
      });

      const fitAssessment = await districtService.getDistrictFitAssessment(
        playbook.districtId,
        playbook.productIds
      );

      // Generate new content
      const content = generateSectionContent(
        section.sectionType,
        district,
        products,
        fitAssessment
      );

      // Update section
      await prisma.playbookSection.update({
        where: { id: sectionId },
        data: {
          status: 'complete',
          content,
          errorMessage: null
        }
      });
    } catch (error: any) {
      // Update section with error
      await prisma.playbookSection.update({
        where: { id: sectionId },
        data: {
          status: 'error',
          errorMessage: error.message || 'Regeneration failed'
        }
      });
    }
  })().catch(err => {
    console.error('Background regeneration error:', err);
  });

  return { status: 'generating' };
}

/**
 * Delete a playbook
 */
export async function deletePlaybook(
  userId: string,
  playbookId: string
): Promise<void> {
  // Verify playbook ownership
  const playbook = await prisma.playbook.findUnique({
    where: { id: playbookId }
  });

  if (!playbook || playbook.userId !== userId) {
    const error: any = new Error('Playbook not found');
    error.code = 'PLAYBOOK_NOT_FOUND';
    throw error;
  }

  // Delete sections first (explicit)
  await prisma.playbookSection.deleteMany({
    where: { playbookId }
  });

  // Delete playbook
  await prisma.playbook.delete({
    where: { id: playbookId }
  });
}
