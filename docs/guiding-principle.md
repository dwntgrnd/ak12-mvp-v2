# Product Guiding Principle

**Created:** 2026-02-17  
**Status:** Draft — pending team review  
**Referenced by:** All specs, handoffs, and prioritization decisions

---

## Core Value

**The purpose of this platform is not to match products to districts. It is to surface the trends, stories, and data-driven evidence that make a sales conversation compelling.**

A fit score may help a sales rep prioritize which districts to approach first. But the value is in what comes after: contextual intelligence that helps them walk into a meeting understanding what's happening in a district — declining math scores, a new LCAP priority around English learner support, a recent bond measure — and speak directly to those realities with evidence-backed talking points.

## Core User Story

> "In prepping to meet with each district, I want to be able to access a district-specific playbook to be able to quickly understand their needs, see how my offering addresses their specific needs, and know what each stakeholder cares about so that I can speak to proof-of-fit and handle objections confidently during the conversation."

This story defines the output that matters: a sales rep who walks into a meeting with district-specific context, evidence-backed product alignment, stakeholder awareness, and the confidence to handle objections. Everything the platform builds — data pipelines, matching logic, AI generation — is in service of that outcome.

## The Four Pillars

Every feature, data pipeline, and design decision should be evaluated against this question: **Does this help surface richer context, stronger evidence, or more compelling narratives for the sales conversation?**

- **District Intelligence** exists to provide the raw material — trends, pain points, priorities, funding context
- **Product Knowledge** exists to give the AI something to reason with — approved messaging, competitive positioning, target challenges
- **Matching** exists to connect the two — not as a score, but as the identification of which district signals align with which product strengths
- **Playbook Generation** is the synthesis — transforming those connections into actionable sales conversation building blocks: district context, stakeholder insights, proof-of-fit evidence, and objection handling

## Applying This Principle

When evaluating any proposed feature, spec, or implementation decision:

1. Does it contribute to the richness of district context, product knowledge, matching intelligence, or playbook output?
2. If yes — does it serve the MVP sales rep workflow, or is it a future enhancement?
3. If no — is it infrastructure that enables the above, or is it scope drift?
