# CC Prompt: Decouple District Trends Tab from Intelligence Data

**Session:** SS-41  
**Prompt:** 3a of 3  
**Priority:** Quick bug fix — execute alongside or after SS41-02

---

## Objective

The District Trends tab (enrollment/proficiency charts from yearData) fails to render for districts that have year data but no intelligence entries. Fix the guard in `ResearchTabs` so the trend charts render independently.

## Problem

In `/src/components/district-profile/research-tabs.tsx`, line ~55:

```ts
if (availableTabs.length === 0 || !intel) return null;
```

The `availableTabs` array correctly includes the District Trends tab when `yearData` exists (even without intelligence data). But the `|| !intel` guard kills the entire component when `getDistrictIntelligence()` returns null. This means districts with year data but no intelligence entries (Natomas, Plumas County, and any future Tier 3 districts) show an empty profile page — no trend charts at all.

## Fix

Replace the early return guard:

```ts
// BEFORE
if (availableTabs.length === 0 || !intel) return null;

// AFTER  
if (availableTabs.length === 0) return null;
```

Then guard the individual intelligence tab contents to handle `intel` being null:

```ts
{tab.key === 'goalsFunding' && intel && <GoalsFundingTab intel={intel} />}
{tab.key === 'academicPerformance' && intel && <AcademicPerformanceTab intel={intel} />}
{tab.key === 'competitiveIntel' && intel && <CompetitiveIntelTab intel={intel} />}
```

The District Trends tab already has its own guard (`yearData &&`), so it doesn't need changes.

## Verification

1. Navigate to a Tier 3 district (one with no intelligence entry but with year data in fixtures — e.g., Natomas or Plumas after SS41-02 is complete)
2. The profile should show the identity bar AND the District Trends tab with enrollment/proficiency charts
3. No Goals & Funding, Academic Performance, or Competitive Intel tabs should appear (correct — no data)
4. Navigate to a Tier 1 district (Elk Grove, Sacramento City) — all tabs should still render normally
5. No console errors

## Files Modified

- `/src/components/district-profile/research-tabs.tsx` — guard logic only

## Do NOT Modify

- Tab configuration, tab rendering components, or the intelligence fixture data
