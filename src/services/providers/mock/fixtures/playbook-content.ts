// Section content templates and district-specific content for mock playbook generation.
// Generic templates use placeholders: {{districtName}}, {{productNames}}, {{productList}}
// District-specific content uses pre-written prose with no interpolation needed.

import type { ContentSource } from '../../../types/common';
import type { PlaybookSectionType } from '../../../types/playbook';

// Canonical section ordering — all builders must use this order.
export const SECTION_ORDER: PlaybookSectionType[] = [
  'key_themes',
  'stakeholder_talking_points',
  'product_fit_data',
  'handling_objections',
  'competition',
  'news',
];

// --- Generic Templates ---
// Fallback for districts without custom content. Same interpolation pattern as before.

export const GENERIC_SECTION_TEMPLATES: Record<PlaybookSectionType, {
  sectionLabel: string;
  contentSource: ContentSource;
  template: string;
}> = {
  key_themes: {
    sectionLabel: 'Key Themes',
    contentSource: 'constrained',
    template: `Three themes connect directly to how {{productNames}} should be positioned at {{districtName}}.

**Post-pandemic academic recovery remains the dominant instructional priority.** Most California districts remain below pre-pandemic baselines, particularly in mathematics. Districts evaluating new materials prioritize programs with embedded assessment, differentiation support, and documented evidence of impact. If {{districtName}} follows this pattern, anchor {{productNames}} in specific proficiency data from the district's own trends — not generic product capabilities.

**Equity criteria shape every procurement decision.** California's instructional frameworks emphasize conceptual understanding and access for all learners. Districts require that materials demonstrate robust support for English Learners, students with disabilities, and culturally responsive content. {{districtName}}'s demographic profile determines which equity dimensions carry the most weight — lead with the ones most relevant to their student population.

**Technology consolidation favors integrated platforms.** Districts prefer programs that work within existing ecosystems rather than adding standalone tools. Position {{productNames}} as reducing platform count and teacher cognitive load — fewer tools, built-in assessment and practice, less fragmentation.`,
  },

  stakeholder_talking_points: {
    sectionLabel: 'Stakeholder Talking Points',
    contentSource: 'constrained',
    template: `{{superintendentLine}} leads {{districtName}}. {{superintendentContact}}

**Detailed stakeholder intelligence for {{districtName}} is not yet available.** The framework below provides role-based talking points to use once you have identified key contacts through pre-meeting research.

**Pre-Meeting Research:**
Review {{districtName}}'s website for organizational directory and cabinet listings. Pull the most recent LCAP document — it names priorities and often identifies responsible administrators. Watch or read minutes from the last 2-3 board meetings.

**By Role:**

- **Superintendent:** Mirror their public priorities. Your credibility is built indirectly — through alignment with stated goals, not through a pitch. Do not request a direct meeting early.
- **Chief Academic Officer / Asst. Superintendent of Instruction:** Your highest-value first meeting. Ask for evaluation criteria before presenting. Tailor everything to their stated weights.
- **Curriculum Directors (Math/ELA):** Prepare for deep product walkthroughs. Ask what gaps exist in current materials — their frustrations are your positioning for {{productNames}}.
- **EL Program Director:** Schedule a dedicated EL-focused session, separate from general presentations. Show designated and integrated ELD support at the lesson level.
- **Chief Business Officer:** Lead with total cost of ownership and per-pupil pricing. Ask about fiscal calendar and procurement thresholds.
- **School Board:** Do not present directly. Arm the administration with board-ready talking points. Attend a meeting first to identify champions and skeptics.
- **Site Principals:** Identify instructional leaders who can champion {{productNames}} during a pilot.`,
  },

  product_fit_data: {
    sectionLabel: 'Product Fit / Data',
    contentSource: 'synthesis',
    template: `{{productNames}} maps to {{districtName}}'s likely needs based on available district data and current California education trends.

{{productList}}

**Evidence Anchor:** Lead with the product that addresses the district's most urgent documented need — typically mathematics if proficiency data shows significant gaps, or ELA if the district has signaled active interest in literacy. Anchor every talking point in specific data from the district's own performance trends, not general product capabilities.

The pattern that works: "Your data shows X → districts with similar profiles have seen Y → here's how {{productNames}} connects those dots."

**Procurement Posture:** Determine the district's position before the meeting: active adoption window, mid-cycle, or approaching end-of-contract. This changes the entire conversation. Active adoption means compete on evaluation criteria; mid-cycle means build relationships and position for the next window.`,
  },

  handling_objections: {
    sectionLabel: 'Handling Objections',
    contentSource: 'synthesis',
    template: `Anticipated objections for {{productNames}} at {{districtName}}, with response frameworks.

**"We're already using a program in this subject area."**
Acknowledge the investment, then pivot: "I'm not asking you to replace what's working. I'd like to understand what your team would want in the next adoption cycle — and make sure {{productNames}} is on your radar when that window opens." Ask about satisfaction levels and unmet teacher needs.

**"Our budget is committed for this year."**
Validate, then reframe the timeline: "That makes sense. A no-cost pilot this year positions you to evaluate with real classroom data before the next budget cycle." Ask about LCAP funding, Title I allocations, or one-time state grants that could support a focused evaluation.

**"Implementation and professional development are too disruptive."**
Reframe from disruption to consolidation: "{{productNames}} is built to reduce the tool count, not add to it — embedded assessment, built-in scaffolding, and ready-to-use lessons mean less platform-switching for teachers." Reference successful implementations at similar-sized California districts.

**"How does this support our English Learners and students with disabilities?"**
This is an opportunity, not an objection. Lead with specifics: designated and integrated ELD support built into {{productNames}} at the lesson level, accessibility features, and scaffolding for diverse learners. Offer a focused demo for the EL coordinator and Special Education director.`,
  },

  competition: {
    sectionLabel: 'Competition',
    contentSource: 'synthesis',
    template: `**Competitive intelligence for {{districtName}} is limited.** The landscape below is based on general California market patterns. Update with district-specific intelligence from LCAP documents, board minutes, and stakeholder conversations.

**Common Competitors in California K-12:**
- **Mathematics:** McGraw-Hill (Reveal Math, Into Math), Amplify (Desmos), Curriculum Associates (i-Ready), Great Minds (Eureka Math)
- **ELA:** Amplify (CKLA, Amplify ELA), HMH (Into Reading, Into Literature), McGraw-Hill (Wonders, StudySync)

**Differentiation Framework for {{productNames}}:**
- Against programs lacking integrated adaptive practice: emphasize built-in differentiation without requiring a separate platform
- Against programs with limited EL support: emphasize native language integration at the lesson level, not bolted-on translation
- Against programs with strong brand recognition but aging content: emphasize alignment with California's current frameworks and standards refresh

**Intelligence to Gather:**
Before the meeting, determine which programs {{districtName}} currently uses, when contracts expire, and where teacher satisfaction is lowest. LCAP documents often reference vendor names in funded actions. Board meeting minutes surface adoption discussions. This intelligence transforms a generic competitive pitch into a targeted displacement strategy.`,
  },

  news: {
    sectionLabel: 'News',
    contentSource: 'constrained',
    template: `Product-relevant news and recent developments for {{districtName}} will appear here when data sources are connected.

This section will surface recent coverage, board decisions, and community developments that are relevant to {{productNames}} positioning at {{districtName}}.`,
  },
};

// --- District-Specific Content ---
// Keyed by districtId. Overrides generic templates per section. Not all sections need overrides.

export const DISTRICT_SPECIFIC_CONTENT: Record<string, Partial<Record<PlaybookSectionType, {
  sectionLabel: string;
  contentSource: ContentSource;
  content: string;
}>>> = {

  // ============================================================
  // LOS ANGELES UNIFIED — Flagship demo, fit score 8
  // Products: EnvisionMath + myPerspectives
  // ============================================================
  'b8cd9b23-4f2f-470d-b1e5-126e7ff2a928': {
    key_themes: {
      sectionLabel: 'Key Themes',
      contentSource: 'synthesis',
      content: `Three strategic themes dominate the instructional landscape at LAUSD and create clear openings for EnvisionMath and myPerspectives.

**Math proficiency recovery is the district's most urgent academic priority.** With only 32.8% of students meeting grade-level math standards, LAUSD faces a math crisis that is both pedagogical and political. Superintendent Carvalho has made math improvement a centerpiece of the district's accountability framework, and the LCAP explicitly targets gains in math proficiency across all subgroups. The district has been evaluating instructional approaches that emphasize conceptual understanding — aligning directly with California's new math framework and with EnvisionMath's problem-based, visual learning approach. This is not an abstract need; it is a documented, measured, and publicly tracked priority.

**Equity and access for a predominantly high-need student population.** With over 80% of students qualifying for FRPM, 106K English Learners, and 83.5K students receiving special education services, LAUSD's procurement process applies an equity lens to every materials decision. Any program that advances to evaluation must demonstrate robust support for designated and integrated ELD, differentiated pathways for students with IEPs, and culturally responsive content that reflects LAUSD's majority-Latino, multilingual community. myPerspectives' culturally diverse text anthology and built-in SEL integration speak directly to this requirement, while EnvisionMath's Spanish language support and adaptive practice address the math side.

**Enrollment decline demands demonstrated ROI from every curriculum investment.** The loss of 18,000+ students over three years translates to significant per-pupil funding loss under LCFF. This means the district is under pressure to show that every dollar spent on instructional materials produces measurable outcomes. Vendors who can present evidence of impact — improved proficiency rates, higher student engagement metrics, successful implementations in comparable urban districts — will have a significant advantage over those pitching features alone.`,
    },
    stakeholder_talking_points: {
      sectionLabel: 'Stakeholder Talking Points',
      contentSource: 'constrained',
      content: `LAUSD's size and organizational structure create a complex stakeholder landscape. The district operates with a central office and multiple local district superintendents, meaning curriculum decisions involve both central and regional approval. Approach guidance for each stakeholder follows.

**Superintendent Alberto Carvalho** — *Lead with:* Data-driven evidence of impact in comparable large urban districts. Carvalho responds to measurable outcomes, not feature pitches. *Receptivity:* High for math — it's his named LCAP priority. Moderate for ELA unless tied to equity metrics he's tracking. *Pushback risk:* Will challenge any claim not backed by specific numbers. *Tactical note:* You won't meet him early. Instead, ensure every touchpoint with his team echoes his public priorities on math recovery, EL achievement gaps, and tech modernization — this is how credibility cascades downward at LAUSD.

**Deputy Superintendent of Instruction** — *Lead with:* Alignment between your products and the district's evaluation criteria. This office sets the rubric. *Receptivity:* High — this is your highest-value first meeting at the central office level. *Pushback risk:* Will probe whether you understand LAUSD's scale and complexity; generic pitches fail here. *Tactical note:* Request a presentation to the instructional leadership team this office convenes. Come prepared to address how implementation works across LAUSD's multiple local districts, not just in a single-site pilot.

**Division of Instruction, Mathematics and ELA Directors** — *Lead with:* Deep product walkthroughs, not executive summaries. These are technical evaluators. *Receptivity:* The math director is your primary target given the district's proficiency focus — lead with EnvisionMath's alignment to the California math framework. The ELA director will evaluate myPerspectives' culturally responsive content rigorously. *Pushback risk:* Expect granular questions on standards alignment, differentiation mechanics, and EL scaffolding at the lesson level. *Tactical note:* Build these relationships early. They influence multiple adoption cycles and carry credibility with the adoption committees they chair.

**Local District Superintendents** — *Lead with:* A tailored pilot proposal for their specific region's demographics. *Receptivity:* Varies by local district — target those with the lowest math proficiency or highest EL concentration, where urgency is greatest. *Pushback risk:* May defer to central office on curriculum decisions. *Tactical note:* Securing a pilot in one local district creates a foothold for broader adoption. A successful local district becomes your internal reference case.

**Chief Business Officer / Budget Office** — *Lead with:* A flexible pricing model built for 500K+ students — per-pupil pricing, multi-year structures, and total cost of ownership that accounts for consolidation savings. *Receptivity:* Moderate — enrollment-driven budget pressure makes every dollar scrutinized. *Pushback risk:* Will ask about licensing costs for digital components, PD, and ongoing support separately. *Tactical note:* Come with a transparent pricing breakdown before being asked. Proactive pricing transparency builds trust faster than waiting for the RFP.

**Board of Education** — Seven elected members with final approval authority. *Lead with:* Nothing directly — arm the administration with board-ready talking points instead. *Receptivity:* Board members respond to community support, teacher endorsement, and equity narratives. *Pushback risk:* Political dynamics — some members may have vendor relationships or community pressure on specific programs. *Tactical note:* Review recent board meeting recordings for which members ask about math performance, EL programs, or instructional materials. These are your likely champions or obstacles.`,
    },
    product_fit_data: {
      sectionLabel: 'Product Fit / Data',
      contentSource: 'synthesis',
      content: `EnvisionMath and myPerspectives each address distinct, documented needs at LAUSD, and together they offer a comprehensive K-12 instructional package that aligns with the district's dual focus on math recovery and literacy equity.

**EnvisionMath (Mathematics, Grades 2-8):** LAUSD's math proficiency rate of 32.8% represents a massive instructional gap that affects over 350,000 students. EnvisionMath's problem-based learning approach and Visual Learning Bridge align with the conceptual emphasis in California's 2023 math framework — a framework LAUSD has publicly committed to implementing. The program's adaptive practice engine (powered by Knewton) addresses the differentiation challenge inherent in a district where student readiness spans multiple grade levels within a single classroom. Critically, EnvisionMath's Spanish language support serves a district where the majority of the 106K English Learners are Spanish-dominant, and the integrated formative assessment tools give teachers real-time data without requiring a separate assessment platform. EnvisionMath has documented results in large urban districts with similar demographics, which provides the evidence base LAUSD's evaluation committees expect.

**myPerspectives (English Language Arts, Grades 6-12):** With ELA proficiency at 43.1% and a growing emphasis on culturally responsive curriculum across LAUSD, myPerspectives addresses two priorities simultaneously. The program's text anthology — the most diverse in secondary ELA — reflects the lived experiences of LAUSD's majority-Latino, multiethnic student body. The integrated Social-Emotional Learning framework supports the district's broader wellness initiatives, and student voice and choice built into every unit directly addresses the engagement challenges that contribute to LAUSD's 25.1% chronic absenteeism rate. For a district focused on preparing students for college-level literacy, myPerspectives' writing workshop model and performance-based assessments offer a clear pathway from secondary ELA to post-secondary readiness.

**Recommended Lead:** Lead with EnvisionMath. Math proficiency is the more acute pain point (32.8% vs 43.1% in ELA), is a named LCAP priority, and is an area where Superintendent Carvalho has made public commitments. Once the math conversation establishes credibility and alignment, introduce myPerspectives as a complementary ELA solution that extends the same evidence-backed, equity-centered approach to literacy instruction. The combined package positions Savvas as a strategic instructional partner rather than a single-product vendor.

**Competitive considerations:** LAUSD's scale means multiple vendors are likely pursuing the same opportunity. Identify which math and ELA programs are currently in use across the district's regions — LAUSD sometimes adopts different materials across its local districts. Timing is critical: determine whether the district is in an active adoption cycle for math or ELA, or whether this is a relationship-building conversation that positions for a future cycle.`,
    },
    handling_objections: {
      sectionLabel: 'Handling Objections',
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
    competition: {
      sectionLabel: 'Competition',
      contentSource: 'synthesis',
      content: `LAUSD's scale makes it a target for every major publisher. Multiple vendors are actively pursuing math and ELA adoption opportunities across the district's regional structure.

**Known Competitive Landscape:**
LAUSD's size means the district sometimes maintains different adopted programs across its local districts, creating a fragmented competitive picture. The district has historically worked with major publishers including HMH, McGraw-Hill, and Amplify across different subject areas and grade bands.

**Mathematics Competition:**
- **McGraw-Hill (Reveal Math / Into Math):** Strong presence in California urban districts. Likely incumbent or active competitor. Differentiate EnvisionMath on: Visual Learning Bridge for conceptual understanding (every lesson, not select lessons), integrated adaptive practice without separate license, and native Spanish language support built into lessons rather than translated supplements.
- **Curriculum Associates (i-Ready):** Widely used as a diagnostic/intervention platform. Position EnvisionMath as a consolidation play — core instruction + adaptive practice + formative assessment in one platform vs. separate core + i-Ready licenses.
- **Great Minds (Eureka Math):** Strong conceptual math reputation but limited digital/adaptive capabilities. Differentiate on technology integration, adaptive practice, and teacher usability.

**ELA Competition:**
- **Amplify (CKLA, Amplify ELA):** Growing presence in California. Strong in knowledge-building literacy. Differentiate myPerspectives on: culturally diverse text anthology (purpose-built, not retrofitted), integrated SEL, and student voice/choice architecture.
- **HMH (Into Reading / Into Literature):** Legacy presence in LAUSD. Differentiate myPerspectives on: contemporary, diverse text selections and the writing workshop model.

**Strategic Advantage:**
The combined EnvisionMath + myPerspectives offering positions Savvas as a comprehensive K-12 partner rather than a single-product vendor. At LAUSD's scale, procurement simplification has real value — one vendor relationship, one PD partnership, one implementation support team across math and ELA.

**Intelligence to Gather:**
Identify which programs are currently adopted in each of LAUSD's local districts. Determine contract expiration timelines by region. Ask curriculum directors about satisfaction with current materials — their frustrations reveal your competitive opening.`,
    },
    news: {
      sectionLabel: 'News',
      contentSource: 'constrained',
      content: `Product-relevant news and recent developments for Los Angeles Unified will appear here when data sources are connected.

This section will surface recent board decisions, community developments, and coverage relevant to EnvisionMath and myPerspectives positioning at LAUSD.`,
    },
  },

  // ============================================================
  // SACRAMENTO CITY UNIFIED — Best-case scenario, fit score 9
  // Products: EnvisionMath + myPerspectives
  // ============================================================
  '7f4e8dd1-9f32-4d87-92f3-3009800b88b0': {
    key_themes: {
      sectionLabel: 'Key Themes',
      contentSource: 'synthesis',
      content: `Sacramento City Unified presents a rare alignment of timing, need, and process readiness. Three themes make this an exceptionally strong opportunity for both EnvisionMath and myPerspectives.

**Active adoption cycle creates a defined procurement window.** Unlike districts where the conversation is about future positioning, SCUSD is in an active evaluation and adoption process now. The district's current math and ELA materials are nearing contract expiration, and the curriculum council has initiated the formal evaluation process. This means there is a defined timeline, an established evaluation committee, and allocated budget for new materials. The sales conversation here is not about generating interest — it's about winning a competitive evaluation that is already underway.

**State capital district with outsized influence and visibility.** SCUSD's location in Sacramento gives it a unique relationship with the California Department of Education and state-level education policy. When SCUSD adopts new materials, it generates attention across the state. Curriculum leaders from surrounding districts — Elk Grove, San Juan, Twin Rivers — watch SCUSD's adoption decisions closely. A successful adoption here doesn't just win one district; it creates a reference point for the entire Sacramento region and beyond.

**Equity-driven procurement criteria favor comprehensive, inclusive programs.** With over 70% FRPM eligibility and 20% English Learners, SCUSD applies rigorous equity criteria to every materials evaluation. The district has been vocal about seeking programs that offer genuine cultural responsiveness — not superficial diversity — and that provide built-in differentiation for EL students and students with disabilities. myPerspectives' culturally diverse anthology and EnvisionMath's Spanish language support and adaptive learning pathways are precisely what this evaluation committee is looking for. Programs that can't demonstrate deep equity commitment at the product level won't survive the evaluation rubric.`,
    },
    stakeholder_talking_points: {
      sectionLabel: 'Stakeholder Talking Points',
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
    product_fit_data: {
      sectionLabel: 'Product Fit / Data',
      contentSource: 'synthesis',
      content: `EnvisionMath and myPerspectives are exceptionally well-positioned for SCUSD's active adoption cycle. The alignment between district priorities and product capabilities is among the strongest in the California pipeline.

**EnvisionMath (Mathematics, Grades 2-8):** SCUSD's math proficiency rate of approximately 26% represents a clear, documented need that the district is actively seeking to address through new materials. EnvisionMath's problem-based learning model and Visual Learning Bridge are specifically designed for the kind of conceptual understanding emphasis that California's new math framework mandates and that SCUSD's curriculum council has identified as a priority. The adaptive practice engine addresses the reality of multi-level classrooms in a high-need urban district, and the integrated assessment tools give teachers formative data without adding another platform. For the district's Spanish-dominant English Learners, EnvisionMath's native Spanish language support — integrated at the lesson level, not bolted on — is a significant differentiator against competitors that offer translation-only EL support.

**myPerspectives (English Language Arts, Grades 6-12):** With ELA proficiency near 38% and the district's stated priority of expanding culturally responsive curriculum, myPerspectives is uniquely positioned. The program's text anthology was built from the ground up to reflect diverse student experiences — this is not a legacy program with diversity additions; it's a curriculum designed around student voice and representation. The integrated SEL framework supports SCUSD's broader student wellness goals, and the student choice architecture directly addresses engagement challenges. For a district that has publicly committed to culturally responsive education, myPerspectives offers the most authentic expression of that commitment available in secondary ELA.

**Recommended Lead:** Lead with both products simultaneously. SCUSD is in an active adoption cycle for both math and ELA, and presenting a comprehensive K-12 instructional partnership positions Savvas as a strategic vendor — not a single-product supplier that the district would need to supplement with a second vendor. The combined offering reduces procurement complexity and positions for a larger contract.

**Competitive positioning:** This is an active evaluation with competitors. Identify which other publishers are presenting to the adoption committee. Come prepared with a head-to-head differentiation sheet for the most likely competitors (Amplify, HMH, McGraw-Hill). The evaluation rubric is likely to weight equity, EL support, and evidence of impact heavily — areas where this product portfolio has strong differentiation.`,
    },
    handling_objections: {
      sectionLabel: 'Handling Objections',
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
    competition: {
      sectionLabel: 'Competition',
      contentSource: 'synthesis',
      content: `Sacramento City Unified is in an active adoption cycle, meaning this is a live competitive evaluation. Identifying and differentiating against specific competitors is critical.

**Active Evaluation Context:**
SCUSD's curriculum council has initiated formal evaluation for both math and ELA materials. Multiple publishers are presenting to the adoption committee. The evaluation rubric likely weights equity, EL support, evidence of impact, and California framework alignment heavily.

**Likely Competitors — Mathematics:**
- **McGraw-Hill (Reveal Math):** Strong California presence. Differentiate EnvisionMath on: Visual Learning Bridge in every lesson (conceptual understanding is core, not supplemental), integrated adaptive practice engine, and native Spanish language support at the lesson level.
- **Amplify (Desmos Math):** Growing reputation for engagement. Differentiate on: comprehensive K-8 scope (Desmos strength is secondary), print+digital flexibility, and deeper formative assessment integration.
- **Great Minds (Eureka Math/Squared):** Respected for rigor. Differentiate on: adaptive technology, digital-first design, and teacher usability — Eureka's implementation burden is a known concern.

**Likely Competitors — ELA:**
- **Amplify (CKLA / Amplify ELA):** Knowledge-building literacy approach. Differentiate myPerspectives on: the most diverse text anthology in secondary ELA (purpose-built), integrated SEL, and student choice architecture.
- **HMH (Into Reading / Into Literature):** Legacy publisher with strong California history. Differentiate on: contemporary content, culturally responsive design, and performance-based assessments vs. traditional comprehension focus.

**Winning the Evaluation:**
- Request the evaluation rubric from Dr. Sandoval's office before presenting. Structure the entire presentation around their criteria, not your feature set.
- Prepare head-to-head differentiation sheets for the 2-3 most likely competitors. The committee will be comparing side by side.
- Secure teacher pilot slots in representative classrooms — teacher feedback during pilot is likely the highest-weighted input in the committee's decision.
- Leverage the combined K-12 offering as a strategic differentiator: one vendor relationship simplifies procurement for a district adopting both math and ELA simultaneously.`,
    },
    news: {
      sectionLabel: 'News',
      contentSource: 'constrained',
      content: `Product-relevant news and recent developments for Sacramento City Unified will appear here when data sources are connected.

This section will surface recent board decisions, adoption timeline updates, and coverage relevant to EnvisionMath and myPerspectives positioning at SCUSD.`,
    },
  },

  // ============================================================
  // FRESNO UNIFIED — Low fit, fit score 2
  // Products: EnvisionMath only
  // ============================================================
  '75c04266-c622-4294-aa22-046245c95e51': {
    key_themes: {
      sectionLabel: 'Key Themes',
      contentSource: 'synthesis',
      content: `The strategic landscape at Fresno Unified is defined by a recent competitor adoption that reshapes the conversation entirely. Three themes guide how to approach this district.

**Recent math adoption eliminates near-term sales opportunity.** The most important intelligence about Fresno is what NOT to do: don't walk into this district pitching EnvisionMath as a replacement for a program they just adopted. The adoption committee spent months evaluating options, teachers have been through training, and administrators have staked their credibility on the new program's success. Pushing a replacement conversation will burn the relationship and close the door for the future cycle. The platform is surfacing this signal specifically because it's the kind of intelligence that separates strategic sales reps from ones who waste their time and damage relationships.

**The current adoption creates a future opportunity window.** Multi-year math contracts typically run 5-7 years. That means Fresno will re-enter the math adoption cycle around 2029-2031. The strategic play is to begin building relationships now so that EnvisionMath is top-of-mind when the current contract approaches expiration. If the competing program underperforms — and with math proficiency at 25.1%, the bar for improvement is clear — the district will be actively seeking alternatives when the window opens. Being an established, trusted presence in the district at that point is the goal.

**High-need demographics create ongoing touchpoints beyond core adoption.** Even without a core math adoption opportunity, Fresno's demographics create needs that can be addressed through non-competitive channels. Supplemental materials, intervention programs, PD partnerships, and conference presence in the Central Valley all build relationships and brand familiarity. The 30.7% chronic absenteeism rate, 14,340 English Learners, and 87% FRPM population mean the district is constantly seeking solutions for its most challenged populations — some of which may not be fully addressed by the newly adopted program.`,
    },
    stakeholder_talking_points: {
      sectionLabel: 'Stakeholder Talking Points',
      contentSource: 'constrained',
      content: `Fresno Unified's stakeholder map is oriented toward relationship-building, not adoption influence — there is no adoption decision to influence right now. The goal is to listen, learn, and position for the next cycle.

**Superintendent Misty Her** — *Approach:* Listen and learn. Superintendent Her is invested in the current math adoption's success and will not welcome vendor pressure to reconsider. Show interest in the district's broader priorities — chronic absenteeism, EL support, proficiency gains — and offer resources that support those goals without competing with existing commitments. *Receptivity:* Warm to partners who respect the current trajectory; cold to anything that feels like a pitch. *Timing:* Meet later, not first. Build credibility through other touchpoints before requesting superintendent-level time.

**Associate Superintendent of Curriculum and Instruction** — *Approach:* Acknowledge the current adoption, ask how implementation is going, and offer to be a resource for the next cycle. This person's credibility is tied to the current program's success — respect that. *Receptivity:* Open to collegial conversation; closed to competitive positioning. *Timing:* A good early touchpoint if framed as learning about Fresno's process and priorities, not as a sales conversation. Ask what the district looks for in a materials partner — the answer informs how you position for the next cycle.

**Math Curriculum Coordinator, Kevin Yamamoto** — *Approach:* Build a collegial relationship through professional development channels, math education conferences, and shared resources. Yamamoto is deep in implementation coaching and is not an audience for a product pitch. *Receptivity:* Open to peer-level conversation about math instruction; closed to vendor outreach disguised as collaboration. *Timing:* Connect at conferences or PD events where the interaction is natural. Over time, Yamamoto becomes a key informant about how the current program is performing and what gaps emerge.

**Director of English Learner Services, Rosa Hernandez** — *Approach:* This is the most promising near-term entry point. With 14,340 EL students and 87% FRPM, EL services are central to Fresno's identity. Ask what supplemental EL math resources the district needs that the core adoption doesn't fully address. *Receptivity:* High for resources that complement (not compete with) the current program. *Timing:* Approachable now if the conversation is about EL-specific supplemental support, not core math replacement.

**Chief Business Officer** — *Approach:* Gather intelligence, not sell. Understanding the current multi-year contract terms — length, renewal provisions, performance clauses — reveals the timeline for the next adoption window. *Receptivity:* Neutral to informational conversations; resistant to anything that looks like it's undermining a current contract. *Timing:* Review public board meeting minutes and LCAP documents first — much of this information is available without a meeting.

**Site Principals in High-Need Schools** — *Approach:* Build relationships with principals leading schools with 90%+ FRPM and high EL concentrations. These leaders are the most candid about what's working and what isn't in the current adoption. *Receptivity:* High for genuine interest in their students' needs; low for vendor contact that feels transactional. *Timing:* These are long-cycle relationships. A principal who trusts you becomes an early warning system when dissatisfaction with the current program begins to surface — and an advocate when the next adoption cycle opens.`,
    },
    product_fit_data: {
      sectionLabel: 'Product Fit / Data',
      contentSource: 'synthesis',
      content: `The honest assessment: EnvisionMath's alignment with Fresno Unified's current procurement posture is low. The district is not in market for K-8 math materials, and the recently adopted competitor program occupies the space EnvisionMath would fill. This section provides a candid evaluation of the gap and a strategic framework for the long game.

**EnvisionMath (Mathematics, Grades 2-8):** The product capabilities are strong — EnvisionMath's problem-based learning, visual models, adaptive practice, and Spanish language support are well-suited to Fresno's demographics and academic needs. In a vacuum, the alignment would be excellent. But alignment isn't just about product-to-need fit; it's about timing and competitive position. Fresno has an active, recently signed contract with a competing math program. The district has invested in implementation, training, and rollout. EnvisionMath's value proposition — no matter how strong — cannot overcome the sunk cost, political commitment, and institutional inertia of a brand-new adoption.

**Where the gap is real:** This is not a case where a creative pitch or a compelling demo can change the equation. The district is contractually, financially, and politically committed to their current math program for the next several years. Any attempt to position EnvisionMath as a near-term alternative will be perceived as disrespectful of the district's decision-making process and will damage the relationship.

**Where opportunity exists — with patience:** The long-term alignment remains strong. Fresno's math proficiency at 25.1% means the current program will be measured against a clear baseline. If proficiency doesn't improve meaningfully over the next 2-3 years, dissatisfaction will build and the district will begin thinking about the next cycle early. Being a known, trusted, and helpful presence in the district before that moment arrives is the strategic goal. Additionally, supplemental and intervention programs that complement (rather than compete with) the core adoption may represent near-term opportunities worth exploring.

**Recommended approach:** Do not lead with EnvisionMath as a core adoption play. Instead, approach Fresno as a relationship-building opportunity with a multi-year time horizon.`,
    },
    handling_objections: {
      sectionLabel: 'Handling Objections',
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
    competition: {
      sectionLabel: 'Competition',
      contentSource: 'synthesis',
      content: `Fresno Unified recently completed a competitive math adoption and selected a competing program. Understanding the competitive landscape here is about long-term positioning, not near-term displacement.

**Current Adopted Program:**
Fresno selected a competing K-8 mathematics program in 2024 under a multi-year contract. The district invested in teacher training, materials distribution, and implementation support. The program is in its first full year of use.

**Why This Matters:**
- The adoption committee, teachers, and administrators are invested in making the current program succeed.
- Any attempt to position EnvisionMath as a near-term alternative will be perceived as disrespectful of the district's decision-making process.
- The current contract likely runs 5-7 years, creating an adoption window around 2029-2031.

**Long-Term Competitive Strategy:**
- **Monitor performance:** Fresno's math proficiency baseline is 25.1%. If the adopted program doesn't produce measurable improvement over 2-3 years, dissatisfaction will build. Being a known, trusted presence before that moment is the strategic goal.
- **Identify gaps:** Even strong core programs often have supplemental needs — intervention pathways, EL-specific math resources, or assessment tools that complement the core. These non-competitive offerings can maintain presence in the district.
- **Build peer intelligence:** Connect with curriculum coordinators at conferences and PD events. Over time, they become informants about how the current program is performing and what the district will prioritize in the next cycle.

**ELA Opportunity:**
The recent adoption was mathematics-only. Determine whether Fresno has an active or upcoming ELA adoption cycle — myPerspectives could be positioned independently of the math situation. This requires separate stakeholder conversations with the ELA curriculum team.

**Competitive Intelligence to Gather:**
- Which specific program was adopted (publisher, product name, grade range)
- Contract length and renewal terms (public record via board minutes)
- Teacher satisfaction after first year of implementation
- Whether supplemental or intervention needs exist that the core program doesn't address`,
    },
    news: {
      sectionLabel: 'News',
      contentSource: 'constrained',
      content: `Product-relevant news and recent developments for Fresno Unified will appear here when data sources are connected.

This section will surface implementation progress, board discussions, and community developments relevant to long-term positioning at Fresno Unified.`,
    },
  },
};
