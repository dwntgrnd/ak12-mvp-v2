// Section content templates and district-specific content for mock playbook generation.
// Generic templates use placeholders: {{districtName}}, {{productNames}}, {{productList}}
// District-specific content uses pre-written prose with no interpolation needed.

import type { ContentSource } from '../../../types/common';
import type { PlaybookSectionType } from '../../../types/playbook';

// Canonical section ordering — all builders must use this order.
export const SECTION_ORDER: PlaybookSectionType[] = [
  'district_story',
  'key_themes',
  'product_alignment',
  'stakeholder_map',
  'objection_handling',
  'conversation_playbook',
];

// --- Generic Templates ---
// Fallback for districts without custom content. Same interpolation pattern as before.

export const GENERIC_SECTION_TEMPLATES: Record<PlaybookSectionType, {
  sectionLabel: string;
  contentSource: ContentSource;
  template: string;
}> = {
  district_story: {
    sectionLabel: 'District Story',
    contentSource: 'verbatim',
    template: `{{districtName}} is a public school district in California serving a diverse student population across multiple grade levels and school sites. Understanding the district's enrollment trajectory, academic performance trends, and demographic profile is essential context before any sales conversation.

The district's academic performance data — including ELA and math proficiency rates, English Learner population size, and chronic absenteeism trends — should be reviewed to identify specific areas where instructional materials can address documented gaps. Post-pandemic recovery remains a district-wide priority, with particular urgency in mathematics where proficiency rates across California have been slowest to rebound.

Key demographic indicators including Free and Reduced Price Meal eligibility, Special Education enrollment, and English Learner concentration shape both the instructional needs and the procurement criteria the district applies when evaluating new materials. A more detailed narrative would be available with richer district-level data integration, including LCAP priorities, recent board actions, and current curriculum adoption timelines.`,
  },
  key_themes: {
    sectionLabel: 'Key Themes',
    contentSource: 'synthesis',
    template: `Several strategic themes emerge from available data on {{districtName}} that are directly relevant to positioning {{productNames}} in an initial conversation.

Post-pandemic academic recovery continues to drive curriculum evaluation across California districts. Math proficiency gaps have proven especially persistent, with most districts still below pre-pandemic baselines. ELA proficiency recovery has been somewhat stronger, but writing skills and college readiness remain areas of concern. Districts actively evaluating new instructional materials are prioritizing programs with embedded assessment, differentiation support, and evidence of impact in similar settings.

Equity and inclusion are shaping procurement at every level. California's new mathematics framework emphasizes conceptual understanding and access for all learners, and districts are requiring that instructional materials demonstrate support for English Learners, students with disabilities, and culturally responsive content. Technology consolidation is another recurring theme — districts prefer platforms that integrate with existing ecosystems rather than adding standalone tools that increase teacher burden.`,
  },
  product_alignment: {
    sectionLabel: 'Product Alignment',
    contentSource: 'synthesis',
    template: `This section maps {{productNames}} to the identified needs and priorities of {{districtName}} based on available district data and current California education trends.

{{productList}}

**Recommended Lead:** Based on the district's profile, lead with the product that most directly addresses their most urgent documented need — typically mathematics if proficiency data shows significant gaps, or ELA if the district has signaled active interest in literacy or culturally responsive materials. Anchor the conversation around specific data points from the district's own performance trends rather than general product capabilities.

Budget timing and competitive landscape should be assessed before the meeting. Identify whether the district is in an active adoption window, mid-cycle, or approaching end-of-contract with current materials. If current materials are under a multi-year contract, position the conversation as evaluation and relationship-building rather than immediate adoption.`,
  },
  stakeholder_map: {
    sectionLabel: 'Stakeholder Map',
    contentSource: 'constrained',
    template: `Key stakeholders at {{districtName}} who are typically involved in curriculum adoption decisions. District-specific stakeholder intelligence — including named individuals, their known priorities, and recent public statements — would significantly enrich this section.

**Superintendent** — Sets district-wide strategic direction. Curriculum decisions at this level focus on alignment with the Local Control and Accountability Plan (LCAP), board priorities, and community expectations. The superintendent's public communications and board presentations often signal priority areas.

**Chief Academic Officer / Assistant Superintendent of Instruction** — The primary decision-maker for instructional materials adoption. Evaluates alignment with district frameworks, manages the adoption committee process, and typically has the strongest influence on which products advance to piloting.

**Subject Area Curriculum Directors** — Lead adoption committees for specific disciplines. These are the technical evaluators who assess standards alignment, pedagogical approach, teacher usability, and differentiation capabilities. Building a relationship here is critical for long-term positioning.

**Chief Business Officer / Procurement Lead** — Controls budget allocation and vendor contract processes. Evaluates total cost of ownership, compliance requirements, and contract terms. Understanding the district's fiscal calendar and procurement thresholds helps with timing.

**School Board** — Final approval authority for curriculum purchases above district thresholds. Board meetings are public and votes are on record. Attending a board meeting before your sales conversation demonstrates seriousness and provides insight into board priorities.

**Site Principals** — Influence adoption through pilot participation and teacher feedback. Principals who champion a product during the pilot phase can become powerful internal advocates.`,
  },
  objection_handling: {
    sectionLabel: 'Objection Handling',
    contentSource: 'synthesis',
    template: `Common objections anticipated for {{productNames}} at {{districtName}}, with suggested responses.

**"We're already using a program in this subject area."**
Acknowledge the existing investment. Position {{productNames}} as an evaluation opportunity during the next adoption cycle. Ask about satisfaction levels with current materials and areas where teachers have expressed unmet needs. Frame the conversation around what the district would want in its next adoption rather than displacing the current program.

**"Our budget is committed for this year."**
Validate the timing concern. Propose a no-cost pilot or evaluation that positions for the next budget cycle. Offer to present to the curriculum committee to build awareness ahead of procurement. Ask about LCAP funding, Title I allocations, or one-time state funding that might support a focused pilot.

**"Implementation and professional development are too disruptive."**
Highlight embedded PD resources and flexible implementation models. Reference successful implementations at similar-sized California districts. Propose summer or intersession timing for initial training. Emphasize that {{productNames}} is designed to reduce teacher burden, not add to it — with ready-to-use lessons, built-in scaffolding, and intuitive digital tools.

**"How does this support our English Learners and students with disabilities?"**
Detail specific EL and accessibility features in {{productNames}}. Offer a focused demo addressing these populations specifically. Connect with the district's EL coordinator or Special Education director for a targeted conversation. California districts are especially focused on integrated ELD support — come prepared with specific examples of how the program supports designated and integrated ELD instruction.`,
  },
  conversation_playbook: {
    sectionLabel: 'Conversation Playbook',
    contentSource: 'synthesis',
    template: `**Recommended Opening:** Open by referencing something specific to {{districtName}} — a recent board presentation, an LCAP priority, or a publicly available data point that shows you've done your homework. For example: "I've been following {{districtName}}'s work on [specific priority], and I wanted to share how some similar districts are approaching that challenge with {{productNames}}."

**Key Proof Points:** Lead with 2-3 evidence-backed talking points that connect {{productNames}} to the district's likely priorities. Anchor each point in a specific district data trend rather than generic product claims. For example, if math proficiency is below the state average, lead with evidence of impact in similar districts rather than feature lists. If the district has a large English Learner population, lead with EL-specific outcomes data.

**Discovery Questions:** Use these to deepen your understanding of the district's current situation and openness to new materials:
- "What's working well with your current [subject area] materials, and where are teachers telling you they need more support?"
- "Where is [subject area] in your adoption cycle? Are you actively evaluating, or is this more of a future planning conversation?"
- "How is the district approaching differentiation for English Learners and students with IEPs in [subject area]?"
- "What would a successful pilot or evaluation look like for your team?"

**Suggested Next Step:** Propose a concrete, low-commitment action: a focused demo for the curriculum team, a pilot classroom setup, or a presentation to the adoption committee. Match the ask to the district's readiness — if they're in active adoption, propose joining the evaluation process; if they're mid-cycle, propose a relationship-building touchpoint like a PD webinar or conference meeting.`,
  },
};

// --- Per-District Content Blocks ---
// Rich, district-specific content for demo districts. Keyed by districtId from seed playbooks.

export const DISTRICT_SPECIFIC_CONTENT: Record<string, Record<PlaybookSectionType, {
  sectionLabel: string;
  contentSource: ContentSource;
  content: string;
}>> = {

  // ============================================================
  // LOS ANGELES UNIFIED (dist-la-001) — Flagship demo, fit score 8
  // Products: EnvisionMath + myPerspectives
  // ============================================================
  'dist-la-001': {
    district_story: {
      sectionLabel: 'District Story',
      contentSource: 'verbatim',
      content: `Los Angeles Unified is the largest school district in California and the second-largest in the nation, serving approximately 530,000 students across a K-12 system in Los Angeles County. The district has experienced a sustained enrollment decline — from 548,338 students in 2021-22 to 529,902 in 2023-24, a loss of roughly 18,400 students over three years. This decline creates both budget pressure (as LCFF funding follows enrollment) and an urgency to demonstrate instructional quality that retains families in the system.

Academic performance tells a story of slow but measurable recovery. Math proficiency has climbed from 28.5% in 2021-22 to 32.8% in 2023-24 — encouraging momentum, but still meaning that roughly two-thirds of LAUSD students are not meeting grade-level math standards. ELA proficiency has been more stable, rising from 41.7% to 43.1% over the same period. The gap between ELA and math performance — over 10 percentage points — signals that math instruction is the more acute challenge and likely the more receptive entry point for a curriculum conversation.

The district's demographic profile shapes every procurement decision. LAUSD serves approximately 106,000 English Learners (2023-24), making it the largest EL-serving district in the state. Over 427,000 students — more than 80% of enrollment — qualify for Free or Reduced Price Meals. The Special Education population stands at approximately 83,500 students. Chronic absenteeism at 25.1% adds another layer of complexity: any instructional program must work for students who aren't in the classroom every day, demanding strong digital access, flexible pacing, and robust re-engagement tools.

Under Superintendent Alberto Carvalho, who took the helm in early 2022, LAUSD has pursued an aggressive modernization agenda. Carvalho has been publicly vocal about closing achievement gaps, expanding access to high-quality materials, and leveraging technology to personalize learning. The district's 2024-25 LCAP emphasizes math proficiency recovery, English Learner reclassification rates, and chronic absenteeism reduction — all areas where instructional materials play a direct role.`,
    },
    key_themes: {
      sectionLabel: 'Key Themes',
      contentSource: 'synthesis',
      content: `Three strategic themes dominate the instructional landscape at LAUSD and create clear openings for EnvisionMath and myPerspectives.

**Math proficiency recovery is the district's most urgent academic priority.** With only 32.8% of students meeting grade-level math standards, LAUSD faces a math crisis that is both pedagogical and political. Superintendent Carvalho has made math improvement a centerpiece of the district's accountability framework, and the LCAP explicitly targets gains in math proficiency across all subgroups. The district has been evaluating instructional approaches that emphasize conceptual understanding — aligning directly with California's new math framework and with EnvisionMath's problem-based, visual learning approach. This is not an abstract need; it is a documented, measured, and publicly tracked priority.

**Equity and access for a predominantly high-need student population.** With over 80% of students qualifying for FRPM, 106K English Learners, and 83.5K students receiving special education services, LAUSD's procurement process applies an equity lens to every materials decision. Any program that advances to evaluation must demonstrate robust support for designated and integrated ELD, differentiated pathways for students with IEPs, and culturally responsive content that reflects LAUSD's majority-Latino, multilingual community. myPerspectives' culturally diverse text anthology and built-in SEL integration speak directly to this requirement, while EnvisionMath's Spanish language support and adaptive practice address the math side.

**Enrollment decline demands demonstrated ROI from every curriculum investment.** The loss of 18,000+ students over three years translates to significant per-pupil funding loss under LCFF. This means the district is under pressure to show that every dollar spent on instructional materials produces measurable outcomes. Vendors who can present evidence of impact — improved proficiency rates, higher student engagement metrics, successful implementations in comparable urban districts — will have a significant advantage over those pitching features alone.`,
    },
    product_alignment: {
      sectionLabel: 'Product Alignment',
      contentSource: 'synthesis',
      content: `EnvisionMath and myPerspectives each address distinct, documented needs at LAUSD, and together they offer a comprehensive K-12 instructional package that aligns with the district's dual focus on math recovery and literacy equity.

**EnvisionMath (Mathematics, Grades 2-8):** LAUSD's math proficiency rate of 32.8% represents a massive instructional gap that affects over 350,000 students. EnvisionMath's problem-based learning approach and Visual Learning Bridge align with the conceptual emphasis in California's 2023 math framework — a framework LAUSD has publicly committed to implementing. The program's adaptive practice engine (powered by Knewton) addresses the differentiation challenge inherent in a district where student readiness spans multiple grade levels within a single classroom. Critically, EnvisionMath's Spanish language support serves a district where the majority of the 106K English Learners are Spanish-dominant, and the integrated formative assessment tools give teachers real-time data without requiring a separate assessment platform. EnvisionMath has documented results in large urban districts with similar demographics, which provides the evidence base LAUSD's evaluation committees expect.

**myPerspectives (English Language Arts, Grades 6-12):** With ELA proficiency at 43.1% and a growing emphasis on culturally responsive curriculum across LAUSD, myPerspectives addresses two priorities simultaneously. The program's text anthology — the most diverse in secondary ELA — reflects the lived experiences of LAUSD's majority-Latino, multiethnic student body. The integrated Social-Emotional Learning framework supports the district's broader wellness initiatives, and student voice and choice built into every unit directly addresses the engagement challenges that contribute to LAUSD's 25.1% chronic absenteeism rate. For a district focused on preparing students for college-level literacy, myPerspectives' writing workshop model and performance-based assessments offer a clear pathway from secondary ELA to post-secondary readiness.

**Recommended Lead:** Lead with EnvisionMath. Math proficiency is the more acute pain point (32.8% vs 43.1% in ELA), is a named LCAP priority, and is an area where Superintendent Carvalho has made public commitments. Once the math conversation establishes credibility and alignment, introduce myPerspectives as a complementary ELA solution that extends the same evidence-backed, equity-centered approach to literacy instruction. The combined package positions Savvas as a strategic instructional partner rather than a single-product vendor.

**Competitive considerations:** LAUSD's scale means multiple vendors are likely pursuing the same opportunity. Identify which math and ELA programs are currently in use across the district's regions — LAUSD sometimes adopts different materials across its local districts. Timing is critical: determine whether the district is in an active adoption cycle for math or ELA, or whether this is a relationship-building conversation that positions for a future cycle.`,
    },
    stakeholder_map: {
      sectionLabel: 'Stakeholder Map',
      contentSource: 'constrained',
      content: `LAUSD's size and organizational structure create a complex stakeholder landscape. The district operates with a central office and multiple local district superintendents, meaning curriculum decisions often involve both central and regional approval.

**Superintendent Alberto Carvalho** — Carvalho, who came to LAUSD from Miami-Dade County Public Schools in 2022, has established himself as an aggressive reformer focused on measurable outcomes. His public priorities include math proficiency recovery, closing achievement gaps for English Learners, and modernizing the district's instructional technology infrastructure. He is data-driven in his communications and responds to evidence of impact in comparable districts. He is unlikely to be in the room for an initial product conversation, but his stated priorities should frame every talking point — when your message aligns with what the superintendent is saying publicly, it gains credibility at every level below.

**Deputy Superintendent of Instruction** — Oversees curriculum strategy and instructional priorities for the district. This office coordinates the adoption committee process and sets the evaluation criteria that all instructional materials must meet. A meeting with this office — or a presentation to the instructional leadership team they convene — is the most impactful first touchpoint at the central office level.

**Division of Instruction, Mathematics and ELA Directors** — These directors lead the subject-specific adoption committees and are the primary technical evaluators. They assess standards alignment, pedagogical quality, differentiation capabilities, and evidence of effectiveness. Building a direct relationship with the math director is essential given the district's math proficiency focus. For myPerspectives, the ELA director will evaluate culturally responsive content quality and alignment with California's ELA/ELD Framework.

**Local District Superintendents** — LAUSD is divided into local districts, each with its own superintendent. These leaders have significant influence over pilot participation and can champion materials within their regions. Securing a pilot in one local district creates a foothold for broader adoption.

**Chief Business Officer / Budget Office** — Controls procurement processes and manages vendor contracts. Given enrollment-driven budget pressures, expect detailed questions about total cost of ownership, per-pupil pricing at LAUSD's scale, and multi-year contract structures. Coming prepared with a flexible pricing model for a 500K+ student district is essential.

**Board of Education** — Seven elected members with final approval authority for major curriculum purchases. Board meetings are public and recorded. Reviewing recent board meeting minutes for discussions about instructional materials, math performance, or EL programs can provide valuable talking points.`,
    },
    objection_handling: {
      sectionLabel: 'Objection Handling',
      contentSource: 'synthesis',
      content: `These objection responses are tailored to LAUSD's specific context — a district of enormous scale, significant political visibility, and intense focus on measurable outcomes.

**"A district our size can't switch math programs mid-stream. The disruption would be too great."**
Acknowledge the legitimate scale concern — rolling out new materials across 500K+ students is a genuine operational challenge. Reframe the conversation around a phased approach: propose a pilot in one or two local districts, with clear success metrics tied to the district's own LCAP targets (math proficiency, EL reclassification). Reference EnvisionMath's track record in other large urban districts where phased implementation produced measurable results without system-wide disruption. The goal of this conversation isn't full adoption tomorrow — it's demonstrating fit in a controlled environment.

**"We need to see evidence of impact with a student population like ours — majority-Latino, high EL, high poverty."**
This is a fair and important question, and you should welcome it. Come prepared with efficacy data from comparable districts — large, urban, high-EL, high-FRPM systems where EnvisionMath and/or myPerspectives have been implemented. Highlight Spanish language support in EnvisionMath and the culturally responsive text selections in myPerspectives specifically. Offer to arrange a conversation with a curriculum leader from a comparable district who has implemented these programs. Peer validation is the most powerful evidence for a district of this profile.

**"Superintendent Carvalho has a lot of initiatives in flight. Curriculum adoption isn't the top priority right now."**
Acknowledge the breadth of the superintendent's agenda. Then redirect: math proficiency recovery IS one of Carvalho's named priorities, documented in the LCAP and referenced in public board presentations. You're not asking the district to take on a new initiative — you're offering a tool that directly supports an initiative they've already committed to. Ask what the current timeline looks like for math materials evaluation, and position accordingly.

**"Our budget is constrained by declining enrollment. We can't take on new curriculum costs."**
Validate the budget reality — declining enrollment from 548K to 530K represents real LCFF revenue loss. Propose a no-cost pilot with a defined evaluation period, allowing the district to assess fit before committing budget. Highlight that EnvisionMath's integrated adaptive practice eliminates the need for separate assessment and intervention licenses, potentially reducing the district's total instructional materials spend. Ask about one-time state funding, Educator Effectiveness Block Grant, or Title I allocations that could support a focused pilot.

**"How does this fit with our instructional technology infrastructure?"**
LAUSD has invested significantly in 1:1 devices and digital infrastructure. Both EnvisionMath and myPerspectives are designed for hybrid digital/print environments and integrate with major LMS platforms. Offer a technical consultation with the district's IT team to demonstrate compatibility. Emphasize that these programs are designed to consolidate — not add — to the teacher's digital tool burden.`,
    },
    conversation_playbook: {
      sectionLabel: 'Conversation Playbook',
      contentSource: 'synthesis',
      content: `**Recommended Opening:** "I've been tracking LAUSD's progress on math proficiency — the improvement from 28.5% to 32.8% over the past two years shows real momentum, and I know that's been a priority for Superintendent Carvalho and the board. I'd love to share how some districts with a similar profile have been accelerating that trajectory with EnvisionMath, and also talk about what we're seeing on the ELA side with myPerspectives."

This opening works because it (1) demonstrates that you've done your homework with specific data, (2) leads with a genuine compliment about forward progress, (3) positions the conversation as acceleration of existing momentum rather than fixing a problem, and (4) naturally introduces both products.

**Key Proof Points:**
- **Math trajectory with a specific anchor:** "Districts comparable to LAUSD in size and demographics that have adopted EnvisionMath have seen math proficiency improvements of 4-6 points in the first two years. Given that you've already built 4.3 points of momentum from 28.5% to 32.8%, this could meaningfully accelerate the trajectory toward the LCAP targets."
- **EL support as a differentiator:** "With 106,000 English Learners, your EL support requirements are among the most demanding in the country. EnvisionMath is the only K-8 math program with full Spanish language support integrated at the lesson level — not as a supplement — and myPerspectives' text anthology was specifically built to reflect multilingual, multicultural student experiences."
- **Total cost of ownership:** "EnvisionMath includes adaptive practice and formative assessment built in, which districts your size typically purchase as separate platforms. For a 530K-student district, consolidating those tools into the core program can represent significant savings."

**Discovery Questions:**
- "Where are you in the math adoption cycle? Is the district actively evaluating new materials, or is this more of a planning horizon conversation?"
- "How is the current math program performing with your English Learner population specifically? Are teachers telling you they need more EL-integrated support at the lesson level?"
- "What's the process for getting a new program into evaluation here — does it start at the central office or through local district superintendents?"
- "Are there specific local districts or school sites that would be good candidates for a focused pilot?"

**Suggested Next Step:** Propose a focused demo for the Division of Instruction mathematics team — not a generic product walkthrough, but a session specifically designed around LAUSD's student population data, showing how EnvisionMath addresses the proficiency gap for their EL and FRPM demographics. Offer to include a peer reference call with a curriculum leader from another large California urban district. If the district is not in active adoption, propose a PD webinar for math coaches as a value-add touchpoint that builds the relationship without requiring procurement commitment.`,
    },
  },

  // ============================================================
  // SACRAMENTO CITY UNIFIED (dist-sac-001) — Best-case scenario, fit score 9
  // Products: EnvisionMath + myPerspectives
  // ============================================================
  'dist-sac-001': {
    district_story: {
      sectionLabel: 'District Story',
      contentSource: 'verbatim',
      content: `Sacramento City Unified is a mid-size urban district serving approximately 40,000 students across a K-12 system in Sacramento County, the state capital. As the largest district in the Sacramento metropolitan area's urban core, SCUSD plays an outsized role in regional education policy and is frequently looked to as an early adopter of state-level instructional initiatives.

The district's academic profile reflects both the challenges common to urban California districts and some distinctive characteristics that make this an especially promising prospect. Math proficiency has been trending upward but remains below the state average, with the most recent data showing approximately 26% of students meeting grade-level math standards. ELA proficiency sits near 38%, reflecting a similar pattern of post-pandemic recovery with significant room for growth. The district serves a substantial English Learner population — approximately 20% of enrollment — and over 70% of students qualify for Free or Reduced Price Meals, underscoring the need for materials that serve high-need populations effectively.

What makes Sacramento City Unified a standout opportunity is timing: the district is in an active adoption cycle for both mathematics and ELA instructional materials. The current board-approved materials are approaching the end of their contract period, and the district's curriculum council has signaled that it is actively seeking new programs for evaluation in the upcoming academic year. The district's LCAP priorities for 2024-25 center on academic achievement gains in math and literacy, English Learner reclassification, and expanded access to culturally responsive curriculum — a set of priorities that maps almost perfectly to the combined EnvisionMath and myPerspectives offering.

The superintendent has emphasized a commitment to evidence-based materials selection, with a transparent evaluation process that includes teacher input, pilot data, and community engagement. This process-driven approach, combined with the alignment between district priorities and product strengths, makes SCUSD one of the highest-potential opportunities in the California market.`,
    },
    key_themes: {
      sectionLabel: 'Key Themes',
      contentSource: 'synthesis',
      content: `Sacramento City Unified presents a rare alignment of timing, need, and process readiness. Three themes make this an exceptionally strong opportunity for both EnvisionMath and myPerspectives.

**Active adoption cycle creates a defined procurement window.** Unlike districts where the conversation is about future positioning, SCUSD is in an active evaluation and adoption process now. The district's current math and ELA materials are nearing contract expiration, and the curriculum council has initiated the formal evaluation process. This means there is a defined timeline, an established evaluation committee, and allocated budget for new materials. The sales conversation here is not about generating interest — it's about winning a competitive evaluation that is already underway.

**State capital district with outsized influence and visibility.** SCUSD's location in Sacramento gives it a unique relationship with the California Department of Education and state-level education policy. When SCUSD adopts new materials, it generates attention across the state. Curriculum leaders from surrounding districts — Elk Grove, San Juan, Twin Rivers — watch SCUSD's adoption decisions closely. A successful adoption here doesn't just win one district; it creates a reference point for the entire Sacramento region and beyond.

**Equity-driven procurement criteria favor comprehensive, inclusive programs.** With over 70% FRPM eligibility and 20% English Learners, SCUSD applies rigorous equity criteria to every materials evaluation. The district has been vocal about seeking programs that offer genuine cultural responsiveness — not superficial diversity — and that provide built-in differentiation for EL students and students with disabilities. myPerspectives' culturally diverse anthology and EnvisionMath's Spanish language support and adaptive learning pathways are precisely what this evaluation committee is looking for. Programs that can't demonstrate deep equity commitment at the product level won't survive the evaluation rubric.`,
    },
    product_alignment: {
      sectionLabel: 'Product Alignment',
      contentSource: 'synthesis',
      content: `EnvisionMath and myPerspectives are exceptionally well-positioned for SCUSD's active adoption cycle. The alignment between district priorities and product capabilities is among the strongest in the California pipeline.

**EnvisionMath (Mathematics, Grades 2-8):** SCUSD's math proficiency rate of approximately 26% represents a clear, documented need that the district is actively seeking to address through new materials. EnvisionMath's problem-based learning model and Visual Learning Bridge are specifically designed for the kind of conceptual understanding emphasis that California's new math framework mandates and that SCUSD's curriculum council has identified as a priority. The adaptive practice engine addresses the reality of multi-level classrooms in a high-need urban district, and the integrated assessment tools give teachers formative data without adding another platform. For the district's Spanish-dominant English Learners, EnvisionMath's native Spanish language support — integrated at the lesson level, not bolted on — is a significant differentiator against competitors that offer translation-only EL support.

**myPerspectives (English Language Arts, Grades 6-12):** With ELA proficiency near 38% and the district's stated priority of expanding culturally responsive curriculum, myPerspectives is uniquely positioned. The program's text anthology was built from the ground up to reflect diverse student experiences — this is not a legacy program with diversity additions; it's a curriculum designed around student voice and representation. The integrated SEL framework supports SCUSD's broader student wellness goals, and the student choice architecture directly addresses engagement challenges. For a district that has publicly committed to culturally responsive education, myPerspectives offers the most authentic expression of that commitment available in secondary ELA.

**Recommended Lead:** Lead with both products simultaneously. SCUSD is in an active adoption cycle for both math and ELA, and presenting a comprehensive K-12 instructional partnership positions Savvas as a strategic vendor — not a single-product supplier that the district would need to supplement with a second vendor. The combined offering reduces procurement complexity and positions for a larger contract.

**Competitive positioning:** This is an active evaluation with competitors. Identify which other publishers are presenting to the adoption committee. Come prepared with a head-to-head differentiation sheet for the most likely competitors (Amplify, HMH, McGraw-Hill). The evaluation rubric is likely to weight equity, EL support, and evidence of impact heavily — areas where this product portfolio has strong differentiation.`,
    },
    stakeholder_map: {
      sectionLabel: 'Stakeholder Map',
      contentSource: 'constrained',
      content: `SCUSD's adoption process is committee-driven with clear roles and a transparent evaluation structure. Understanding who sits where in this process is critical for navigating the evaluation effectively.

**Superintendent** — The superintendent has set the tone for this adoption cycle by emphasizing evidence-based decision-making, equity outcomes, and community engagement. While the superintendent is unlikely to be in the evaluation weeds, their publicly stated priorities should be reflected in every touchpoint. The superintendent's office reviews the final adoption committee recommendation before it goes to the board.

**Assistant Superintendent of Curriculum and Instruction, Dr. Maria Sandoval** — The key decision-maker who oversees the adoption process, sets evaluation criteria, and chairs the curriculum council. Dr. Sandoval's office will determine which vendors are invited to present, what the evaluation rubric looks like, and how pilot data is weighted. Securing a meeting with Dr. Sandoval — or at minimum, ensuring she sees the initial materials — is the single most important stakeholder action.

**Math Curriculum Director, James Chen** — Leads the mathematics adoption committee and manages the teacher evaluation teams. Chen has been vocal at district PD events about the need for conceptual math instruction aligned with the California framework. He values programs with strong formative assessment integration and embedded professional development. He is likely your primary technical evaluator for EnvisionMath.

**ELA Curriculum Director, Patricia Washington** — Leads the ELA adoption committee with a particular focus on culturally responsive text selection and writing instruction. Washington has a background in literacy coaching and is known for prioritizing programs that give students authentic reading and writing experiences. She will evaluate myPerspectives' text anthology rigorously — come prepared to walk through specific text selections and their cultural relevance.

**Director of English Learner Programs, Ana Torres** — A critical evaluator who assesses every proposed material through the EL lens. Torres reviews designated and integrated ELD support, primary language resources, and scaffolding for newcomer students. Her endorsement significantly influences the adoption committee's recommendation. Schedule a dedicated EL-focused demo for her team.

**Chief Business Officer** — Manages the district's budget and procurement processes. With LCFF funding tied to enrollment, the CBO will scrutinize total cost of ownership and multi-year pricing. Prepare a pricing model that reflects SCUSD's scale and includes digital licensing, PD, and implementation support in a transparent package.

**School Board (7 members)** — Final approval authority. SCUSD board meetings are public and typically include community comment periods during major adoption votes. Board members respond to community support and teacher endorsement — consider how pilot teachers can be positioned as voices during the approval process.`,
    },
    objection_handling: {
      sectionLabel: 'Objection Handling',
      contentSource: 'synthesis',
      content: `SCUSD is in active adoption, so the objections here are competitive and evaluative rather than fundamental. These are the concerns most likely to surface during the committee evaluation process.

**"We're evaluating multiple publishers. What makes your program different from [competitor]?"**
This is the core competitive question and the one to prepare for most thoroughly. For EnvisionMath: the differentiator is the Visual Learning Bridge (conceptual understanding in every lesson, not just select lessons), integrated adaptive practice (no separate license needed), and native Spanish language support (not translated, built-in). For myPerspectives: the differentiator is the most diverse text anthology in secondary ELA (purpose-built, not retrofitted), integrated SEL, and student choice architecture. Ask the evaluator which specific criteria they're weighting most heavily and tailor the differentiation response accordingly.

**"Our teachers need to be part of this decision. They've had negative experiences with top-down adoptions."**
This is exactly the right instinct, and you should validate it enthusiastically. Propose a structured teacher pilot — 4-6 weeks in representative classrooms across grade levels and demographics — with teacher input forms that feed directly into the evaluation committee's deliberation. Both EnvisionMath and myPerspectives are designed with teacher usability as a core principle, and a pilot is the best way to demonstrate that. Teacher buy-in during the pilot phase is the strongest predictor of a successful adoption vote.

**"We need to see evidence of impact with demographics similar to ours."**
Come prepared with implementation case studies from comparable districts — mid-size urban, high FRPM, significant EL population, California preferred. Include specific data points: proficiency gains, student engagement metrics, teacher satisfaction scores. Offer to connect the evaluation committee with curriculum leaders from reference districts for direct peer conversations. SCUSD's evaluation rubric likely requires evidence of effectiveness, so this isn't an objection to overcome — it's a requirement to meet.

**"The budget for this adoption is significant. How do we justify the investment to the board and community?"**
Help the district build the ROI narrative. Frame the investment in terms of per-student cost, compare to the cost of maintaining an expiring program that isn't producing desired outcomes, and highlight the consolidation benefit (integrated assessment, adaptive practice, PD — all included). Provide a board presentation template or talking points the administration can use. The easier you make it for the district to justify the adoption internally, the more likely it succeeds.`,
    },
    conversation_playbook: {
      sectionLabel: 'Conversation Playbook',
      contentSource: 'synthesis',
      content: `**Recommended Opening:** "I understand the district is in an active adoption cycle for math and ELA materials, and I'm excited to share how EnvisionMath and myPerspectives can meet the specific criteria your evaluation committee is applying. I've reviewed the district's LCAP priorities around math proficiency, EL reclassification, and culturally responsive curriculum — and I think you'll find the alignment is exceptionally strong."

This opening signals that you understand the evaluation context, have done your homework on district priorities, and are here to compete on merit — not deliver a generic pitch.

**Key Proof Points:**
- **Evaluation criteria alignment:** "We've mapped EnvisionMath and myPerspectives against the evaluation criteria that California districts in active adoption typically apply — standards alignment, EL support, cultural responsiveness, differentiation, digital integration, and evidence of effectiveness. I'd like to walk through how we score on each of those dimensions, especially the ones your committee is weighting most heavily."
- **Comprehensive K-12 solution:** "Adopting EnvisionMath for math and myPerspectives for ELA from a single publisher gives the district a consistent pedagogical approach, a single vendor relationship for support and PD, and streamlined procurement. Districts that have adopted both programs report that the consistency in instructional design reduces the learning curve for teachers."
- **EL-specific differentiation:** "With approximately 20% of your students being English Learners, EL support isn't a feature checkbox — it's a core requirement. EnvisionMath has full Spanish language support built into every lesson, and myPerspectives was designed from the ground up with multilingual, multicultural student experiences at its center."

**Discovery Questions:**
- "What are the top 3 criteria your evaluation committee is weighting most heavily? I want to make sure our presentation addresses them directly."
- "How is the teacher pilot structured? How many classrooms, which grade levels, and what feedback mechanism are you using?"
- "What's the timeline from evaluation to board vote? And is there an opportunity to present directly to the adoption committee?"
- "Are there specific gaps in your current materials that prompted this adoption cycle — areas where teachers have been most vocal about needing something different?"

**Suggested Next Step:** Request a formal presentation slot with the adoption committee. Come prepared with a presentation specifically structured around SCUSD's evaluation rubric (ask for the rubric in advance). Propose an accelerated pilot timeline that fits within the adoption cycle's decision window. Offer to provide a complete evaluation kit — sample materials, digital access, teacher guides, PD overview — so committee members can begin review immediately. This is a district that is ready to buy; the next step is making the evaluation process as easy as possible for them.`,
    },
  },

  // ============================================================
  // FRESNO UNIFIED (dist-fre-001) — Low fit, fit score 2
  // Products: EnvisionMath only
  // ============================================================
  'dist-fre-001': {
    district_story: {
      sectionLabel: 'District Story',
      contentSource: 'verbatim',
      content: `Fresno Unified is the third-largest district in California, serving approximately 71,500 students across a K-Adult system in the Central Valley. Under Superintendent Misty Her, the district has maintained relatively stable enrollment — from 72,455 in 2021-22 to 71,480 in 2023-24 — avoiding the sharp declines seen in some coastal districts. Fresno Unified is a high-need district by every measure: over 62,000 students (87% of enrollment) qualify for Free or Reduced Price Meals, approximately 14,340 are English Learners, and about 10,100 receive special education services.

Academic performance has been improving, though from a low base. Math proficiency has climbed from 20.8% in 2021-22 to 25.1% in 2023-24 — a meaningful 4.3-point gain, but still meaning that three-quarters of Fresno students are not meeting grade-level math standards. ELA proficiency has shown similar improvement, rising from 32.2% to 34.7%. Chronic absenteeism at 30.7% — nearly one-third of students — is a significant challenge that compounds every instructional intervention.

The critical context for any sales conversation: Fresno Unified completed a competitive adoption process for K-8 mathematics materials in 2024 and selected a competing program under a multi-year contract. The district invested significant resources in teacher training, materials distribution, and implementation support for the new math program, which is now in its first full year of use. The adoption committee, teachers, and administrators are invested in making the current program succeed. This is not a district that is open to evaluating alternative math materials in the near term.

This does not mean Fresno should be ignored — it means the conversation must be fundamentally different from a district in active adoption. The platform is surfacing this reality to save you time and help you approach Fresno strategically.`,
    },
    key_themes: {
      sectionLabel: 'Key Themes',
      contentSource: 'synthesis',
      content: `The strategic landscape at Fresno Unified is defined by a recent competitor adoption that reshapes the conversation entirely. Three themes guide how to approach this district.

**Recent math adoption eliminates near-term sales opportunity.** The most important intelligence about Fresno is what NOT to do: don't walk into this district pitching EnvisionMath as a replacement for a program they just adopted. The adoption committee spent months evaluating options, teachers have been through training, and administrators have staked their credibility on the new program's success. Pushing a replacement conversation will burn the relationship and close the door for the future cycle. The platform is surfacing this signal specifically because it's the kind of intelligence that separates strategic sales reps from ones who waste their time and damage relationships.

**The current adoption creates a future opportunity window.** Multi-year math contracts typically run 5-7 years. That means Fresno will re-enter the math adoption cycle around 2029-2031. The strategic play is to begin building relationships now so that EnvisionMath is top-of-mind when the current contract approaches expiration. If the competing program underperforms — and with math proficiency at 25.1%, the bar for improvement is clear — the district will be actively seeking alternatives when the window opens. Being an established, trusted presence in the district at that point is the goal.

**High-need demographics create ongoing touchpoints beyond core adoption.** Even without a core math adoption opportunity, Fresno's demographics create needs that can be addressed through non-competitive channels. Supplemental materials, intervention programs, PD partnerships, and conference presence in the Central Valley all build relationships and brand familiarity. The 30.7% chronic absenteeism rate, 14,340 English Learners, and 87% FRPM population mean the district is constantly seeking solutions for its most challenged populations — some of which may not be fully addressed by the newly adopted program.`,
    },
    product_alignment: {
      sectionLabel: 'Product Alignment',
      contentSource: 'synthesis',
      content: `The honest assessment: EnvisionMath's alignment with Fresno Unified's current procurement posture is low. The district is not in market for K-8 math materials, and the recently adopted competitor program occupies the space EnvisionMath would fill. This section provides a candid evaluation of the gap and a strategic framework for the long game.

**EnvisionMath (Mathematics, Grades 2-8):** The product capabilities are strong — EnvisionMath's problem-based learning, visual models, adaptive practice, and Spanish language support are well-suited to Fresno's demographics and academic needs. In a vacuum, the alignment would be excellent. But alignment isn't just about product-to-need fit; it's about timing and competitive position. Fresno has an active, recently signed contract with a competing math program. The district has invested in implementation, training, and rollout. EnvisionMath's value proposition — no matter how strong — cannot overcome the sunk cost, political commitment, and institutional inertia of a brand-new adoption.

**Where the gap is real:** This is not a case where a creative pitch or a compelling demo can change the equation. The district is contractually, financially, and politically committed to their current math program for the next several years. Any attempt to position EnvisionMath as a near-term alternative will be perceived as disrespectful of the district's decision-making process and will damage the relationship.

**Where opportunity exists — with patience:** The long-term alignment remains strong. Fresno's math proficiency at 25.1% means the current program will be measured against a clear baseline. If proficiency doesn't improve meaningfully over the next 2-3 years, dissatisfaction will build and the district will begin thinking about the next cycle early. Being a known, trusted, and helpful presence in the district before that moment arrives is the strategic goal. Additionally, supplemental and intervention programs that complement (rather than compete with) the core adoption may represent near-term opportunities worth exploring.

**Recommended approach:** Do not lead with EnvisionMath as a core adoption play. Instead, approach Fresno as a relationship-building opportunity with a multi-year time horizon. The recommended actions are outlined in the Conversation Playbook section below.`,
    },
    stakeholder_map: {
      sectionLabel: 'Stakeholder Map',
      contentSource: 'constrained',
      content: `Fresno Unified's stakeholder map should be approached with a long-game mindset. The goal is not to influence an adoption decision — there isn't one to influence right now. The goal is to build relationships that position EnvisionMath for the next cycle.

**Superintendent Misty Her** — Superintendent Her leads a district focused on steady improvement for a high-need student population. Her priorities include academic proficiency gains, chronic absenteeism reduction, and expanded support for English Learners and students in poverty. She is invested in the success of the current math adoption and will not welcome vendor pressure to reconsider. However, she is likely receptive to partners who support the district's broader goals without competing with existing commitments.

**Associate Superintendent of Curriculum and Instruction** — Oversees the math adoption committee that selected the current program. This person's credibility is tied to the current adoption's success. Approach with respect — acknowledge the decision, ask how the implementation is going, and offer to be a resource for the next cycle. This is a long-term relationship to nurture, not a near-term sale to close.

**Math Curriculum Coordinator, Kevin Yamamoto** — Manages the K-8 math implementation and coaches teachers on the new program. Yamamoto is deeply invested in making the current adoption work. He is not an audience for an EnvisionMath pitch right now. However, building a collegial relationship through professional development channels, math education conferences, and shared resources positions you as a collaborator rather than a competitor.

**Director of English Learner Services, Rosa Hernandez** — With 14,340 English Learners and 87% FRPM, EL services are central to Fresno's identity. Hernandez evaluates how every program serves EL students and may be an entry point for supplemental EL-focused math resources that complement the core adoption. If EnvisionMath has standalone EL math intervention tools, this is the stakeholder to approach.

**Chief Business Officer** — Manages the district's budget, including the existing multi-year math contract. Understanding the contract terms — length, renewal provisions, performance clauses — provides intelligence about the timeline for the next adoption window. This information may be available through public board meeting minutes or LCAP documents.

**Site Principals in High-Need Schools** — Central Valley principals leading schools with 90%+ FRPM and high EL concentrations are often the most candid about what's working and what isn't in the current adoption. Building relationships with a few key principals creates an early warning system for when dissatisfaction with the current program begins to surface.`,
    },
    objection_handling: {
      sectionLabel: 'Objection Handling',
      contentSource: 'synthesis',
      content: `The objection handling for Fresno is different — these are not objections to overcome but signals to respect. The goal is to demonstrate strategic maturity, not sales persistence.

**"We just adopted a new math program. We're not looking at alternatives."**
The only correct response: "I completely understand, and I'm not here to second-guess that decision. I know the adoption committee invested significant time in the evaluation process, and your team is focused on making the implementation successful. I'd love to stay in touch so that when the next cycle comes around — or if there's anything supplemental where we can be helpful in the meantime — we're a resource you already have a relationship with. How's the implementation going so far?" This response respects the decision, acknowledges the investment, pivots to relationship-building, and ends with a question that provides intelligence.

**"We're happy with our current program."**
"That's great to hear — a successful adoption is good for students, and that's what matters. I'd love to hear what's working well. Understanding what Fresno values in a math program helps us continue improving our own offerings. And if there's ever a need for supplemental resources or PD support in areas the core program doesn't cover, we'd be glad to help." This positions you as a listener and a resource, not a threat.

**"I don't have time for vendor meetings right now — we're in the middle of implementation."**
"Totally fair. Implementation year is intense, and the last thing you need is more meetings. Would it be all right if I checked in next fall — after you've had a full year with the program? I'd genuinely like to hear how it's going. In the meantime, if there's a math education PD event or conference where your team would find value, I'd love to send the details." This respects the time constraint, establishes a future touchpoint, and offers value without asking for anything.

**"We've committed budget to this program for the next five years."**
"That makes sense given the scale of the investment. I want to make sure we're on your radar for when the next cycle approaches. What does that timeline typically look like for Fresno — do you start evaluation a year or two before contract expiration? Understanding your process now helps us be prepared to support the evaluation when the time comes." This accepts the reality, gathers intelligence, and establishes a long-term presence.`,
    },
    conversation_playbook: {
      sectionLabel: 'Conversation Playbook',
      contentSource: 'synthesis',
      content: `**Recommended Opening:** Do not open with a product pitch. This is a relationship-building conversation, not a sales meeting. "I know Fresno recently went through a math adoption, and I'm not here to revisit that decision. I wanted to introduce myself and learn more about the district's priorities so that we can be a helpful resource — whether that's supplemental materials, PD support, or just staying connected for the future. I've been impressed by the proficiency gains the district has been making, and I'd love to hear what's driving that progress."

This opening immediately defuses the "I don't need another vendor pitch" reaction, demonstrates respect for the district's decision, and frames the conversation around learning rather than selling.

**Key Proof Points (use sparingly — this is a listening conversation):**
- **Credibility through humility:** "We know the platform shows a low fit score for Fresno right now, and that's honest — you've just adopted a math program and you're not in market. We think the fact that our platform tells you that, rather than encouraging a hard sell, is actually a demonstration of the kind of partner we are."
- **Long-game value:** "Our goal in a district like Fresno isn't a near-term sale. It's being the first call you make when the next adoption cycle comes around — and earning that by being a genuinely useful presence in the meantime."
- **Supplemental relevance:** "Even outside of core adoption, we have resources for English Learner math support, intervention pathways, and professional development that complement whatever core program a district is using. If any of those would be helpful, I'd love to explore that."

**Discovery Questions (these are the real purpose of this meeting):**
- "How is the first year of the new math program going? What's the teacher feedback been like?"
- "Are there specific student populations — English Learners, students with IEPs, students impacted by chronic absenteeism — where you're finding the current program needs supplementing?"
- "What does the district's adoption cycle look like — is it a fixed calendar, or does it depend on how the current materials are performing?"
- "Are there professional development areas in math instruction where the district is looking for outside support?"

**Suggested Next Step:** Do not propose a demo or pilot. Propose one of these low-commitment, value-add next steps: (1) An invitation to a regional math education event or PD webinar — positioning yourself as a professional resource, not a vendor. (2) A follow-up check-in in 6-12 months to see how the implementation is progressing. (3) A connection to a math education specialist who can support the district's professional development goals independent of any product. The metric for success here is not a sale — it's the foundation of a relationship that positions you for the next cycle in 4-5 years.`,
    },
  },
};
