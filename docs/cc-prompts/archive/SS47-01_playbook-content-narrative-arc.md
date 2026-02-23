# SS47-01: Playbook Content — Narrative Arc, Stakeholder Reframe, and Source Label Audit

**Session:** SS-47
**Scope:** Content and copy changes to playbook fixture content. No type/contract changes.
**Primary file:** `src/services/providers/mock/fixtures/playbook-content.ts`

---

## Context

Analysis of playbook content against the project's guiding principle identified three content-level issues:

1. **Stakeholder Map sections** repeat biographical information already available on the district profile, instead of focusing on sales approach strategy.
2. **District Story and Key Themes sections** in generic templates treat data as inventory rather than connecting every data point to a sales-relevant interpretation that builds toward the product value proposition.
3. **ContentSource labels** on generic templates are inaccurate — the generic District Story is labeled `verbatim` when it contains no district-specific sourced content.

All three issues share a root cause: the playbook sections currently read as six independent documents. They should read as **six chapters of one argument**: "I understand your situation, and here's how my solution addresses it."

---

## Guiding Content Principle

Every playbook section builds toward a single through-line:

- **District Story** — establishes the district's situation with evidence-backed interpretation. Every data point connects to a sales-relevant insight. Not "the proficiency rate is X%" as standalone fact, but "the proficiency rate is X%, which means Y for your conversation."
- **Key Themes** — interprets why the district's situation matters *right now* and creates the bridge to product relevance.
- **Product Alignment** — closes the gap: here's how the solution addresses the specific problems established in the first two sections, with evidence.
- **Stakeholder Map** — tells the rep *how to make this case* to each person, not *who each person is*. Assumes the rep has access to the district profile for biographical/org-chart context.
- **Objection Handling** — prepares the rep for resistance to the case being made.
- **Conversation Playbook** — gives the rep the words to deliver it.

---

## Change 1: Stakeholder Map Reframe

### Principle

The district profile owns the **who and what** — name, title, department, contact info, role in adoption process, general notes. The playbook stakeholder map owns the **how and why for this conversation** — given these products and this district's current priorities, how do you approach each person?

### Instructions

**For all three district-specific stakeholder map sections** (LAUSD, Sacramento, Fresno):

1. Remove biographical/background information that restates what the district profile contacts already provide (e.g., "Carvalho came from Miami-Dade in 2022", "Chen has been vocal at district PD events").
2. Replace with approach-strategy content for each stakeholder:
   - What to lead with when talking to this person
   - What this person will push back on or care most about
   - Where they sit on the receptivity spectrum for the products being presented
   - Tactical guidance: meet first vs. later, what to prepare specifically for them, what *not* to say
3. Frame each stakeholder entry as a mini-briefing: "Here's how to approach [Name]" — not "Here's who [Name] is."
4. Maintain the existing stakeholder names and titles (don't change who's listed — just change what's said about them).

**Example transformation for LAUSD Superintendent entry:**

Before (current):
> **Superintendent Alberto Carvalho** — Carvalho, who came to LAUSD from Miami-Dade County Public Schools in 2022, has established himself as an aggressive reformer focused on measurable outcomes. His public priorities include math proficiency recovery, closing achievement gaps for English Learners, and modernizing the district's instructional technology infrastructure...

After (target):
> **Superintendent Alberto Carvalho** — You won't meet Carvalho directly in an initial conversation, but his publicly stated math proficiency commitments are your air cover. Frame every EnvisionMath talking point as supporting his agenda — the district's instructional leadership is executing on priorities he set, and alignment with the superintendent's direction gives your advocates internal ammunition. Reference his specific LCAP targets when speaking to deputies; it signals you understand the chain of priority.

**For the Fresno stakeholder map specifically:** The reframe should reflect the relationship-building (not selling) posture established in the rest of the Fresno playbook. Approach guidance should focus on listening, learning, and positioning for the future cycle — not on persuasion tactics.

### Files to modify

- `src/services/providers/mock/fixtures/playbook-content.ts` — all three `stakeholder_map` entries in `DISTRICT_SPECIFIC_CONTENT`

---

## Change 2: Generic Template Narrative Quality

### Principle

Generic templates fire when no district-specific content exists. Currently they read as instructions to the rep ("review the district's academic performance data") rather than intelligence. The templates use `{{districtName}}`, `{{productNames}}`, and `{{productList}}` interpolation — they can't access actual district data in the current mock architecture.

Given this constraint, the fix is to make the generic templates model the *tone and structure* of the narrative arc, even when they can't provide specific data points. They should demonstrate what a good playbook section sounds like, framed around the kinds of signals the platform would surface, rather than giving meta-instructions.

### Instructions

For each generic template in `GENERIC_SECTION_TEMPLATES`:

**district_story:**
- Remove instructional language ("should be reviewed to identify", "a more detailed narrative would be available with").
- Rewrite as a narrative that acknowledges data limitations honestly while still providing the interpretive frame. Example direction: "Understanding {{districtName}}'s enrollment trajectory and academic trends is the foundation for any conversation. Where math and ELA proficiency stand — and which direction they're moving — tells you whether you're walking into urgency or stability..."
- The tone should be a briefing, not a tutorial.

**key_themes:**
- Current version is actually reasonable in tone. Tighten it: remove generic California-wide framing that doesn't relate back to `{{districtName}}` specifically. Every paragraph should connect back to what this means for positioning `{{productNames}}`.

**product_alignment:**
- Remove the instructional paragraph about budget timing and competitive landscape ("Budget timing and competitive landscape should be assessed before the meeting"). That's general sales advice, not product-district alignment intelligence.
- The `{{productList}}` placeholder is fine — this is where per-product content gets interpolated.
- Strengthen the "Recommended Lead" paragraph to model the interpretive pattern: lead with the product that addresses the district's most acute documented need, and explain *why* based on the data pattern.

**stakeholder_map:**
- Current generic version lists role archetypes (Superintendent, CAO, Subject Directors, CBO, Board, Principals) with generic descriptions.
- This is acceptable for a generic fallback — the roles are consistent across California districts.
- Reframe each entry to include approach guidance even in generic form. Example: for the Superintendent entry, add "Reference the district's LCAP priorities and board-adopted goals when framing your pitch to any stakeholder — alignment with the superintendent's public agenda gives your message institutional weight."

**objection_handling:**
- Current version is solid — district-contextualized objection/response pairs with actionable language.
- One fix: the closing sentence of each response should connect back to `{{productNames}}` more explicitly. The current responses sometimes drift into generic sales advice.

**conversation_playbook:**
- This is the weakest generic template. "Open by referencing something specific to {{districtName}}" is telling the rep to do the platform's job.
- Rewrite the opening to model the pattern with a structural template: "I've been looking at {{districtName}}'s [subject area] performance data and wanted to explore how some districts with a similar profile are approaching [relevant challenge] with {{productNames}}."
- Discovery Questions are good as-is — keep them.
- Strengthen the Suggested Next Step to be more specific in its options.

### Files to modify

- `src/services/providers/mock/fixtures/playbook-content.ts` — all entries in `GENERIC_SECTION_TEMPLATES`

---

## Change 3: ContentSource Label Audit

### Principle

The `contentSource` field communicates data confidence to the rep. Labels must accurately reflect what the content is based on.

Definitions:
- `verbatim` — content directly references specific, sourced district data (enrollment numbers, proficiency rates, named individuals, LCAP actions)
- `synthesis` — content interprets and connects multiple data points into narrative or recommendations
- `constrained` — content is limited by available data; may include general patterns applied to the district context

### Instructions

Audit and correct these assignments in `GENERIC_SECTION_TEMPLATES`:

| Section | Current | Correct | Reason |
|---|---|---|---|
| `district_story` | `verbatim` | `constrained` | Generic template contains no district-specific sourced data — only interpolated name |
| `key_themes` | `synthesis` | `constrained` | Generic themes are California-wide patterns, not synthesized from district data |
| `product_alignment` | `synthesis` | `synthesis` | Acceptable — it synthesizes product capabilities against general district patterns |
| `stakeholder_map` | `constrained` | `constrained` | Correct as-is — generic role archetypes with acknowledged limitations |
| `objection_handling` | `synthesis` | `synthesis` | Acceptable — synthesizes product positioning against common objections |
| `conversation_playbook` | `synthesis` | `constrained` | Generic playbook is constrained by lack of district-specific data |

Also verify district-specific content labels are accurate:
- District-specific `district_story` entries with named data points and sources → `verbatim` ✓
- District-specific `stakeholder_map` entries with named individuals from public sources → `constrained` (verify this is set correctly for all three districts)

### Files to modify

- `src/services/providers/mock/fixtures/playbook-content.ts` — `contentSource` fields in `GENERIC_SECTION_TEMPLATES` and verify in `DISTRICT_SPECIFIC_CONTENT`

---

## Execution Order

This is a single prompt — all three changes are in the same file and are thematically unified. Apply in this order within the file:

1. ContentSource label corrections (Change 3) — quick, mechanical
2. Generic template rewrites (Change 2) — tone and structure
3. Stakeholder map reframe (Change 1) — most substantive content rewrite

---

## Verification Checklist

- [ ] Generic `district_story` contentSource is `constrained`, not `verbatim`
- [ ] Generic `key_themes` contentSource is `constrained`
- [ ] Generic `conversation_playbook` contentSource is `constrained`
- [ ] Generic templates contain zero instructional/meta language ("should be reviewed", "would be available with")
- [ ] Generic `conversation_playbook` opening has a structural template, not "reference something specific"
- [ ] All three district-specific stakeholder maps focus on approach strategy, not biographical info
- [ ] Fresno stakeholder map reflects relationship-building posture, not sales tactics
- [ ] Stakeholder names and titles are unchanged — only the descriptive content changes
- [ ] Each district-specific stakeholder entry answers "how do I approach this person with these products" not "who is this person"
- [ ] No TypeScript errors: `npm run build` passes
- [ ] Section ordering unchanged — `SECTION_ORDER` array untouched
- [ ] All `{{districtName}}`, `{{productNames}}`, `{{productList}}` interpolation placeholders preserved in generic templates
