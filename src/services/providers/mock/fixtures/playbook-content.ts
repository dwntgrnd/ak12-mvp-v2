// Section content templates for mock playbook generation.
// Placeholders: {{districtName}}, {{productNames}}, {{productList}}
// Each key matches a sectionType from the service contract.

export const PLAYBOOK_SECTION_TEMPLATES: Record<string, {
  sectionLabel: string;
  contentSource: 'verbatim' | 'constrained' | 'synthesis' | 'hybrid';
  template: string;
}> = {
  district_data: {
    sectionLabel: 'District Overview',
    contentSource: 'verbatim',
    template: `{{districtName}} is a public school district in California. This section provides an overview of the district's key characteristics, demographics, enrollment, and financial profile.

The district serves a diverse student population across multiple schools. Key demographic and performance data should be reviewed to understand the instructional landscape and identify areas where {{productNames}} can address existing needs.

Budget and spending patterns indicate the district's capacity for curriculum investment. Review per-pupil spending, Title I funding status, and recent procurement activity to assess timing and budget alignment.`,
  },
  key_themes: {
    sectionLabel: 'Key Themes',
    contentSource: 'synthesis',
    template: `Based on available data for {{districtName}}, several strategic themes emerge that are relevant to positioning {{productNames}}.

Academic recovery and proficiency improvement remain priorities across California districts. Post-pandemic learning gaps, particularly in mathematics and English Language Arts, are driving curriculum evaluation and adoption cycles.

Equity and inclusion initiatives are shaping procurement criteria. Districts are increasingly requiring that instructional materials demonstrate cultural responsiveness, accessibility, and support for English Learners and students with disabilities.

Technology integration standards are evolving. Districts are consolidating vendors and preferring platforms that reduce teacher burden rather than adding new point solutions.`,
  },
  product_fit: {
    sectionLabel: 'Product Fit',
    contentSource: 'synthesis',
    template: `This analysis maps {{productNames}} to the identified needs and priorities of {{districtName}}.

{{productList}}

The alignment between these products and the district's stated priorities suggests a strong basis for an initial conversation. Focus on demonstrating how the products address specific, documented needs rather than presenting generic capabilities.`,
  },
  fit_assessment: {
    sectionLabel: 'Fit Assessment',
    contentSource: 'synthesis',
    template: `Overall fit assessment for {{productNames}} at {{districtName}}.

Strengths: Product capabilities align with documented district priorities. Grade range coverage matches the district's instructional profile. Subject area focus addresses active areas of curriculum review.

Considerations: District scale may require phased implementation planning. Competitive landscape should be assessed — identify current materials in use and their contract status. Budget cycle timing affects optimal outreach windows.

Recommended approach: Lead with the strongest product-need alignment and propose a focused pilot or evaluation period rather than full adoption in the initial conversation.`,
  },
  objections: {
    sectionLabel: 'Objection Handling',
    contentSource: 'synthesis',
    template: `Common objections anticipated for {{productNames}} at {{districtName}}, with suggested responses.

"We're already using a program in this subject area."
Acknowledge the existing investment. Position {{productNames}} as an evaluation opportunity during the next adoption cycle. Ask about satisfaction levels with current materials and areas where teachers have expressed needs.

"Our budget is committed for this year."
Validate the timing concern. Propose a no-cost pilot or evaluation that positions for the next budget cycle. Offer to present to the curriculum committee to build awareness ahead of procurement.

"Implementation and professional development are too disruptive."
Highlight embedded PD resources and flexible implementation models. Reference successful implementations at similar-sized districts. Propose summer or intersession timing for initial training.

"How does this support our English Learners / students with disabilities?"
Detail specific EL and accessibility features in {{productNames}}. Offer a focused demo addressing these populations specifically. Connect with the district's EL coordinator or special education director for a targeted conversation.`,
  },
  stakeholders: {
    sectionLabel: 'Stakeholders',
    contentSource: 'constrained',
    template: `Key stakeholders at {{districtName}} who are likely involved in curriculum adoption decisions.

Superintendent — Sets district-wide strategic priorities. Curriculum decisions at this level focus on alignment with the district's strategic plan and board goals.

Chief Academic Officer / Assistant Superintendent of Instruction — Oversees curriculum and instruction. Primary decision-maker for instructional materials adoption. Evaluates alignment with district frameworks.

Subject Area Curriculum Directors — Lead adoption committees for specific disciplines. Technical evaluators who assess standards alignment, pedagogy, and teacher usability.

Chief Business Officer / Procurement Lead — Controls budget allocation and vendor contract processes. Evaluates total cost of ownership and compliance requirements.

School Board — Final approval authority for large curriculum purchases. Public meeting votes required for contracts above district thresholds.

Site Principals — Influence adoption through pilot participation and feedback. Key allies for building bottom-up support.`,
  },
};
