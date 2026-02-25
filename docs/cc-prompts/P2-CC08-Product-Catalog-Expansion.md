# P2-CC08: Product Catalog Expansion — Two Additional Mock Products

**Session:** P2-S08
**Depends on:** Existing products.ts fixtures
**Risk:** Low — additive fixture data only. No component or service changes.
**Can run in parallel with:** CC07 (district intelligence expansion) — no file overlap.

---

## Objective

Add two products to `src/services/providers/mock/fixtures/products.ts`, bringing the total from 2 to 4. The new products fill gaps in the demo catalog: a math supplemental/intervention tool (prod-003) and a K-5 foundational literacy program (prod-004). This gives the product lens picker meaningful variety — core vs supplemental, elementary vs secondary, same-subject differentiation.

**Do not modify existing prod-001 or prod-002 entries.**

---

## 1. Product 003: Math Intervention/Supplemental

Model this as an adaptive diagnostic + practice platform (think i-Ready or DreamBox category — do NOT use a real product name). This is a **supplemental** tool, not a core curriculum replacement. That distinction matters for sales conversations and lens alignment.

```typescript
{
  productId: 'prod-003',
  tenantId: 'tenant-demo-001',
  name: 'MathPath Adaptive',
  description: // 2-3 sentences: adaptive math diagnostic and practice platform,
               // K-8, identifies skill gaps and delivers personalized learning paths.
               // Supplemental — designed to work alongside any core curriculum.
               // Emphasize data/reporting for teachers and intervention use cases.
  gradeRange: { gradeFrom: 2, gradeTo: 8 },
  subjectArea: 'Mathematics',
  keyFeatures: [
    // 4-5 features. Must include:
    // - Diagnostic assessment (identifies gaps)
    // - Adaptive practice paths
    // - Teacher dashboard / reporting
    // - Works alongside any core curriculum
    // - Progress monitoring for intervention compliance
  ],
  targetChallenges: [
    // 4 challenges. Must include:
    // - Students 2+ grade levels below in math
    // - Intervention documentation/compliance (MTSS)
    // - Lack of actionable diagnostic data
    // - Differentiation at scale
  ],
  competitiveDifferentiators: [
    // 3 differentiators. Position against generic practice apps.
    // Emphasize: diagnostic precision, teacher actionability, integration flexibility
  ],
  approvedMessaging: [
    // 2 taglines. Intervention/supplemental positioning.
  ],
  assets: [],
  createdAt: '2025-10-01T10:00:00Z',
  updatedAt: '2026-01-22T09:00:00Z',
}
```

### Key distinction from prod-001 (EnvisionMath):
EnvisionMath is a **core curriculum** — it replaces what teachers teach daily. MathPath Adaptive is a **supplemental tool** — it layers on top of whatever core curriculum exists. A district might buy both. The lens should surface different alignment signals for each: EnvisionMath aligns to "materials evaluation/adoption" signals, MathPath aligns to "intervention program" and "diagnostic assessment" signals.

---

## 2. Product 004: K-5 Foundational Literacy

Model this as an elementary ELA program with strong phonics/foundational skills emphasis (think Fundations or CKLA category — do NOT use a real product name). Fills the K-5 ELA gap since myPerspectives only covers 6-12.

```typescript
{
  productId: 'prod-004',
  tenantId: 'tenant-demo-001',
  name: 'ReadyReaders',
  description: // 2-3 sentences: evidence-based K-5 literacy program built on
               // science of reading principles. Systematic phonics, vocabulary,
               // fluency, and comprehension. Strong EL scaffolding.
  gradeRange: { gradeFrom: 0, gradeTo: 5 },
  subjectArea: 'English Language Arts',
  keyFeatures: [
    // 4-5 features. Must include:
    // - Systematic, explicit phonics instruction
    // - Science of reading alignment
    // - Embedded EL supports (vocabulary, visual scaffolds)
    // - Decodable readers at every level
    // - Formative assessment checkpoints
  ],
  targetChallenges: [
    // 4 challenges. Must include:
    // - Below-grade-level reading by end of 3rd grade
    // - Inconsistent foundational skills instruction
    // - English learner literacy gaps
    // - Teacher knowledge of structured literacy
  ],
  competitiveDifferentiators: [
    // 3 differentiators. Position on science of reading rigor.
    // Emphasize: evidence base, EL scaffolding depth, K-5 coherence
  ],
  approvedMessaging: [
    // 2 taglines. Foundational literacy / science of reading positioning.
  ],
  assets: [],
  createdAt: '2025-07-15T08:00:00Z',
  updatedAt: '2026-01-15T16:00:00Z',
}
```

### Key distinction from prod-002 (myPerspectives):
myPerspectives is **secondary ELA** (6-12) focused on engagement, diverse texts, and SEL. ReadyReaders is **elementary ELA** (K-5) focused on foundational skills and phonics. Different grade bands, different instructional philosophy, different buyer personas (elementary curriculum director vs secondary ELA lead).

---

## 3. Content Quality Guidelines

- **Descriptions** should read like vendor marketing copy — polished but not hyperbolic. 2-3 sentences.
- **Key features** should be specific and differentiating, not generic ("standards-aligned" is too vague).
- **Target challenges** should mirror real district pain points visible in the CDE data (low proficiency, EL gaps, intervention needs).
- **Competitive differentiators** should position against a category, not a named competitor.
- **Approved messaging** should be short taglines a sales rep could actually say in a meeting.

---

## 4. Verification

- [ ] `npx tsc --noEmit` passes
- [ ] `getMockProductSummaries()` returns 4 items
- [ ] All 4 products have unique `productId` values
- [ ] Grade ranges don't overlap unnecessarily (prod-001 and prod-003 overlap intentionally — core vs supplemental)
- [ ] `subjectArea` values are consistent with existing entries ("Mathematics", "English Language Arts")
- [ ] No modifications to prod-001 or prod-002
