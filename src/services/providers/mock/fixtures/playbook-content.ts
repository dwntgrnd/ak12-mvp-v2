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
    contentSource: 'constrained',
    template: `{{districtName}} is a California public school district serving a diverse student population across multiple grade levels and school sites. The district's enrollment trajectory, academic performance trends, and demographic profile frame the context for this conversation.

Post-pandemic academic recovery shapes the district's instructional priorities. Math proficiency rates across California have been slowest to rebound, and {{districtName}} is likely navigating the same pattern — making mathematics the probable area of greatest urgency and the strongest entry point for a curriculum conversation. ELA proficiency recovery has generally been stronger statewide, but writing skills and college readiness remain persistent concerns.

The district's demographic profile — Free and Reduced Price Meal eligibility, English Learner concentration, and Special Education enrollment — directly shapes both instructional needs and procurement criteria. Districts with high-need populations prioritize materials that demonstrate built-in support for EL students, students with disabilities, and culturally responsive content. LCAP priorities, recent board actions, and current adoption timelines will sharpen this picture; review publicly available documents before the first meeting.`,
  },
  key_themes: {
    sectionLabel: 'Key Themes',
    contentSource: 'constrained',
    template: `Three California-wide trends connect directly to how {{productNames}} should be positioned at {{districtName}}.

**Post-pandemic math recovery is the dominant instructional priority.** Most California districts remain below pre-pandemic math baselines, and math proficiency gaps have proven more persistent than ELA. Districts evaluating new materials are prioritizing programs with embedded assessment, differentiation support, and documented evidence of impact in similar settings. If {{districtName}} follows this pattern, math is the likely entry point — and {{productNames}} should be anchored in specific proficiency data from the district's own trends.

**Equity criteria are shaping every procurement decision.** California's new mathematics framework emphasizes conceptual understanding and access for all learners. Districts are requiring that instructional materials demonstrate robust support for English Learners, students with disabilities, and culturally responsive content. {{districtName}}'s demographic profile will determine which equity dimensions carry the most weight — lead with the ones most relevant to their student population.

**Technology consolidation favors integrated platforms.** Districts prefer programs that work within existing ecosystems rather than adding standalone tools that increase teacher burden. Position {{productNames}} as a consolidation play — fewer platforms, less cognitive load for teachers, built-in assessment and practice.`,
  },
  product_alignment: {
    sectionLabel: 'Product Alignment',
    contentSource: 'synthesis',
    template: `{{productNames}} maps to {{districtName}}'s likely needs based on available district data and current California education trends.

{{productList}}

**Recommended Lead:** Lead with the product that addresses the district's most urgent documented need — typically mathematics if proficiency data shows significant gaps, or ELA if the district has signaled active interest in literacy or culturally responsive materials. Anchor every talking point in specific data from the district's own performance trends, not general product capabilities. The pattern that works: "Your data shows X → districts with similar profiles have seen Y → here's how {{productNames}} connects those dots."

Determine the district's procurement posture before the meeting: active adoption window, mid-cycle, or approaching end-of-contract. This changes the entire conversation — active adoption means compete on evaluation criteria; mid-cycle means build relationships and position for the next window.`,
  },
  stakeholder_map: {
    sectionLabel: 'Stakeholder Map',
    contentSource: 'constrained',
    template: `{{superintendentLine}} leads {{districtName}}. {{superintendentContact}}

**We don't yet have detailed stakeholder intelligence for {{districtName}}.** The contacts below will need to be identified through pre-meeting research. This section provides a framework for who to find and how to approach them once identified.

**Pre-Meeting Research Checklist:**
- Review {{districtName}}'s website for organizational directory and cabinet listings
- Pull the most recent LCAP document — it names priorities and often identifies responsible administrators
- Watch or read minutes from the last 2-3 board meetings — note who presents on curriculum, who asks about student outcomes, and which board members are most engaged on instructional materials
- Check for an active adoption timeline or RFP — the procurement office or board agendas will surface this
- Identify the EL program director by name — this role carries outsized influence in California districts and is often the gatekeeper for product evaluation

**Stakeholder Engagement Framework:**
Once you've identified the individuals at {{districtName}}, use this approach hierarchy:

- **Superintendent:** Do not request a direct meeting early. Study their public priorities and mirror that language in every touchpoint with their team. Your credibility with the superintendent is built indirectly — through alignment with their stated goals, not through a pitch.
- **Chief Academic Officer / Asst. Superintendent of Instruction:** Your highest-value first meeting. Ask for the evaluation rubric or adoption criteria before presenting. Tailor everything to their stated weights.
- **Curriculum Directors (Math/ELA):** Prepare for deep product walkthroughs. Ask what gaps exist in current materials — their frustrations are your positioning.
- **EL Program Director:** Schedule a dedicated EL-focused session, separate from general presentations. Show designated and integrated ELD support at the lesson level. A generic demo won't earn this stakeholder's endorsement.
- **Chief Business Officer:** Lead with total cost of ownership and per-pupil pricing. Ask about fiscal calendar and procurement thresholds before proposing timing.
- **School Board:** Do not present directly. Arm the administration with board-ready talking points. Attend a meeting first to identify champions and skeptics.
- **Site Principals:** Identify instructional leaders. A principal who champions {{productNames}} during a pilot becomes your strongest internal advocate.`,
  },
  objection_handling: {
    sectionLabel: 'Objection Handling',
    contentSource: 'synthesis',
    template: `Anticipated objections for {{productNames}} at {{districtName}}, with response frameworks.

**"We're already using a program in this subject area."**
Acknowledge the investment, then pivot: "I'm not asking you to replace what's working. I'd like to understand what your team would want in the next adoption cycle — and make sure {{productNames}} is on your radar when that window opens." Ask about satisfaction levels and unmet teacher needs. The goal is intelligence and positioning, not displacement.

**"Our budget is committed for this year."**
Validate, then reframe the timeline: "That makes sense. A no-cost pilot this year positions you to evaluate with real classroom data before the next budget cycle." Ask about LCAP funding, Title I allocations, or one-time state grants that could support a focused evaluation without general fund commitment.

**"Implementation and professional development are too disruptive."**
Reframe from disruption to consolidation: "{{productNames}} is built to reduce the tool count, not add to it — embedded assessment, built-in scaffolding, and ready-to-use lessons mean less platform-switching for teachers." Reference successful implementations at similar-sized California districts and propose summer or intersession timing for initial training.

**"How does this support our English Learners and students with disabilities?"**
This is an opportunity, not an objection. Lead with specifics: designated and integrated ELD support built into {{productNames}} at the lesson level, accessibility features, and scaffolding for diverse learners. Offer a focused demo for the EL coordinator and Special Education director — a targeted session carries more weight than a checkbox on a feature list.`,
  },
  conversation_playbook: {
    sectionLabel: 'Conversation Playbook',
    contentSource: 'constrained',
    template: `**Recommended Opening:** "I've been following {{districtName}}'s work on [LCAP priority or recent board action], and I wanted to share how districts with a similar profile are approaching [specific challenge] with {{productNames}}." Substitute a real data point or public priority — the specificity signals preparation and earns the first five minutes of genuine attention.

**Key Proof Points:** Anchor each point in district-specific data, not product features.
- **If math proficiency is below state average:** Lead with efficacy data from comparable districts — proficiency gains, timeline, demographic match. "Districts with similar math gaps have seen X-point improvement in Y years" lands harder than a feature list.
- **If the EL population is significant:** Lead with EL-specific outcomes and built-in support in {{productNames}} — designated and integrated ELD at the lesson level, not as a supplement.
- **If budget pressure is visible:** Lead with total cost of ownership — how {{productNames}} consolidates assessment, practice, and core instruction into a single platform, reducing the number of licenses the district maintains.

**Discovery Questions:**
- "What's working well with your current [subject area] materials, and where are teachers telling you they need more support?"
- "Where is [subject area] in your adoption cycle? Are you actively evaluating, or is this more of a future planning conversation?"
- "How is the district approaching differentiation for English Learners and students with IEPs in [subject area]?"
- "What would a successful pilot or evaluation look like for your team?"

**Suggested Next Step:** Match the ask to the district's readiness:
- **Active adoption:** Request a presentation slot with the evaluation committee. Offer a complete evaluation kit — samples, digital access, teacher guides — so review can begin immediately.
- **Mid-cycle:** Propose a PD webinar or conference meeting that builds the relationship without requiring procurement commitment.
- **Early exploration:** Offer a focused demo for the curriculum team built around the district's own student data, not a generic product walkthrough.`,
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
  // LOS ANGELES UNIFIED — Flagship demo, fit score 8
  // Products: EnvisionMath + myPerspectives
  // ============================================================
  'b8cd9b23-4f2f-470d-b1e5-126e7ff2a928': {
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
      content: `LAUSD's size and organizational structure create a complex stakeholder landscape. The district operates with a central office and multiple local district superintendents, meaning curriculum decisions involve both central and regional approval. Approach guidance for each stakeholder follows.

**Superintendent Alberto Carvalho** — *Lead with:* Data-driven evidence of impact in comparable large urban districts. Carvalho responds to measurable outcomes, not feature pitches. *Receptivity:* High for math — it's his named LCAP priority. Moderate for ELA unless tied to equity metrics he's tracking. *Pushback risk:* Will challenge any claim not backed by specific numbers. *Tactical note:* You won't meet him early. Instead, ensure every touchpoint with his team echoes his public priorities on math recovery, EL achievement gaps, and tech modernization — this is how credibility cascades downward at LAUSD.

**Deputy Superintendent of Instruction** — *Lead with:* Alignment between your products and the district's evaluation criteria. This office sets the rubric. *Receptivity:* High — this is your highest-value first meeting at the central office level. *Pushback risk:* Will probe whether you understand LAUSD's scale and complexity; generic pitches fail here. *Tactical note:* Request a presentation to the instructional leadership team this office convenes. Come prepared to address how implementation works across LAUSD's multiple local districts, not just in a single-site pilot.

**Division of Instruction, Mathematics and ELA Directors** — *Lead with:* Deep product walkthroughs, not executive summaries. These are technical evaluators. *Receptivity:* The math director is your primary target given the district's proficiency focus — lead with EnvisionMath's alignment to the California math framework. The ELA director will evaluate myPerspectives' culturally responsive content rigorously. *Pushback risk:* Expect granular questions on standards alignment, differentiation mechanics, and EL scaffolding at the lesson level. *Tactical note:* Build these relationships early. They influence multiple adoption cycles and carry credibility with the adoption committees they chair.

**Local District Superintendents** — *Lead with:* A tailored pilot proposal for their specific region's demographics. *Receptivity:* Varies by local district — target those with the lowest math proficiency or highest EL concentration, where urgency is greatest. *Pushback risk:* May defer to central office on curriculum decisions. *Tactical note:* Securing a pilot in one local district creates a foothold for broader adoption. A successful local district becomes your internal reference case.

**Chief Business Officer / Budget Office** — *Lead with:* A flexible pricing model built for 500K+ students — per-pupil pricing, multi-year structures, and total cost of ownership that accounts for consolidation savings. *Receptivity:* Moderate — enrollment-driven budget pressure makes every dollar scrutinized. *Pushback risk:* Will ask about licensing costs for digital components, PD, and ongoing support separately. *Tactical note:* Come with a transparent pricing breakdown before being asked. Proactive pricing transparency builds trust faster than waiting for the RFP.

**Board of Education** — Seven elected members with final approval authority. *Lead with:* Nothing directly — arm the administration with board-ready talking points instead. *Receptivity:* Board members respond to community support, teacher endorsement, and equity narratives. *Pushback risk:* Political dynamics — some members may have vendor relationships or community pressure on specific programs. *Tactical note:* Review recent board meeting recordings for which members ask about math performance, EL programs, or instructional materials. These are your likely champions or obstacles.`,
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
  // SACRAMENTO CITY UNIFIED — Best-case scenario, fit score 9
  // Products: EnvisionMath + myPerspectives
  // ============================================================
  '7f4e8dd1-9f32-4d87-92f3-3009800b88b0': {
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
      content: `SCUSD's adoption process is committee-driven with clear roles and a transparent evaluation structure. This is an active competitive evaluation — approach guidance focuses on winning the process.

**Superintendent** — *Lead with:* Alignment to the superintendent's stated emphasis on evidence-based selection and equity outcomes. *Receptivity:* Supportive of the process but not in the evaluation weeds. *Pushback risk:* Low — the superintendent's role is to review the final committee recommendation. *Tactical note:* Mirror the superintendent's public language on evidence-based materials and community engagement in every touchpoint. This framing cascades through the organization.

**Assistant Superintendent of Curriculum and Instruction, Dr. Maria Sandoval** — *Lead with:* A direct request for the evaluation rubric, then structure your presentation around it. Dr. Sandoval sets the criteria and chairs the curriculum council. *Receptivity:* High — she is actively managing an adoption and wants strong candidates. *Pushback risk:* Will dismiss vendors who present generically rather than addressing SCUSD's specific rubric. *Tactical note:* This is the single most important stakeholder meeting. Securing time with Dr. Sandoval — or at minimum ensuring she sees your initial materials — determines whether you advance. Ask what the evaluation committee is weighting most heavily and tailor everything accordingly.

**Math Curriculum Director, James Chen** — *Lead with:* Conceptual math instruction aligned with the California framework — this is Chen's publicly stated priority. Demonstrate strong formative assessment integration and embedded PD. *Receptivity:* High for programs that align with conceptual understanding emphasis. *Pushback risk:* Will probe deeply on how EnvisionMath handles multi-level differentiation and whether the adaptive engine produces actionable teacher data. *Tactical note:* Chen is your primary technical evaluator for EnvisionMath. Prepare a demo that walks through a specific lesson's conceptual progression, not a feature tour. He values pedagogical substance over polish.

**ELA Curriculum Director, Patricia Washington** — *Lead with:* Specific text selections from myPerspectives that demonstrate cultural relevance and authentic student voice. Washington prioritizes programs that give students genuine reading and writing experiences. *Receptivity:* High for culturally responsive content; skeptical of programs with retrofitted diversity. *Pushback risk:* Will evaluate the text anthology rigorously — come prepared to walk through specific selections and explain the curation rationale. *Tactical note:* Washington's literacy coaching background means she reads program materials as a teacher would. Show how myPerspectives works in a classroom, not how it looks in a brochure.

**Director of English Learner Programs, Ana Torres** — *Lead with:* Designated and integrated ELD support at the lesson level — Torres evaluates every material through the EL lens. *Receptivity:* High for programs with native-language support built in (not bolted on). *Pushback risk:* Will challenge surface-level EL features. Expect detailed questions about newcomer scaffolding, primary language resources, and how the program supports reclassification. *Tactical note:* Schedule a dedicated EL-focused demo for Torres and her team — separate from the general committee presentation. Her endorsement significantly influences the adoption committee's recommendation, and a generic demo won't earn it.

**Chief Business Officer** — *Lead with:* Transparent total cost of ownership that includes digital licensing, PD, and implementation support in a single package. *Receptivity:* Moderate — LCFF enrollment pressures mean every line item gets scrutinized. *Pushback risk:* Will push on multi-year pricing and ask about hidden costs. *Tactical note:* Prepare a pricing model at SCUSD's scale before being asked. The CBO's sign-off is required before the board vote — making the financial case simple and transparent accelerates the timeline.

**School Board (7 members)** — Final approval authority with public community comment periods during major adoption votes. *Lead with:* Nothing directly — arm the administration with board-ready materials. *Receptivity:* Board members respond to teacher endorsement and community support. *Pushback risk:* Political dynamics during community comment periods. *Tactical note:* Position pilot teachers as voices during the board approval process. Teachers who can speak authentically about classroom impact are the most persuasive testimony a board hears.`,
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
  // FRESNO UNIFIED — Low fit, fit score 2
  // Products: EnvisionMath only
  // ============================================================
  '75c04266-c622-4294-aa22-046245c95e51': {
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
      content: `Fresno Unified's stakeholder map is oriented toward relationship-building, not adoption influence — there is no adoption decision to influence right now. The goal is to listen, learn, and position for the next cycle.

**Superintendent Misty Her** — *Approach:* Listen and learn. Superintendent Her is invested in the current math adoption's success and will not welcome vendor pressure to reconsider. Show interest in the district's broader priorities — chronic absenteeism, EL support, proficiency gains — and offer resources that support those goals without competing with existing commitments. *Receptivity:* Warm to partners who respect the current trajectory; cold to anything that feels like a pitch. *Timing:* Meet later, not first. Build credibility through other touchpoints before requesting superintendent-level time.

**Associate Superintendent of Curriculum and Instruction** — *Approach:* Acknowledge the current adoption, ask how implementation is going, and offer to be a resource for the next cycle. This person's credibility is tied to the current program's success — respect that. *Receptivity:* Open to collegial conversation; closed to competitive positioning. *Timing:* A good early touchpoint if framed as learning about Fresno's process and priorities, not as a sales conversation. Ask what the district looks for in a materials partner — the answer informs how you position for the next cycle.

**Math Curriculum Coordinator, Kevin Yamamoto** — *Approach:* Build a collegial relationship through professional development channels, math education conferences, and shared resources. Yamamoto is deep in implementation coaching and is not an audience for a product pitch. *Receptivity:* Open to peer-level conversation about math instruction; closed to vendor outreach disguised as collaboration. *Timing:* Connect at conferences or PD events where the interaction is natural. Over time, Yamamoto becomes a key informant about how the current program is performing and what gaps emerge.

**Director of English Learner Services, Rosa Hernandez** — *Approach:* This is the most promising near-term entry point. With 14,340 EL students and 87% FRPM, EL services are central to Fresno's identity. Ask what supplemental EL math resources the district needs that the core adoption doesn't fully address. *Receptivity:* High for resources that complement (not compete with) the current program. *Timing:* Approachable now if the conversation is about EL-specific supplemental support, not core math replacement.

**Chief Business Officer** — *Approach:* Gather intelligence, not sell. Understanding the current multi-year contract terms — length, renewal provisions, performance clauses — reveals the timeline for the next adoption window. *Receptivity:* Neutral to informational conversations; resistant to anything that looks like it's undermining a current contract. *Timing:* Review public board meeting minutes and LCAP documents first — much of this information is available without a meeting.

**Site Principals in High-Need Schools** — *Approach:* Build relationships with principals leading schools with 90%+ FRPM and high EL concentrations. These leaders are the most candid about what's working and what isn't in the current adoption. *Receptivity:* High for genuine interest in their students' needs; low for vendor contact that feels transactional. *Timing:* These are long-cycle relationships. A principal who trusts you becomes an early warning system when dissatisfaction with the current program begins to surface — and an advocate when the next adoption cycle opens.`,
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
