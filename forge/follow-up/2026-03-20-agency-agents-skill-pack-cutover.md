# Agency-Agents Skill Pack Cutover

Date: 2026-03-20
Track: Directive Forge
Type: skill-pack extraction
Status: planned

## Source

- `C:\Users\User\.openclaw\workspace\agent-lab\tooling\agency-agents`

## Why It Matters

`agency-agents` is not valuable as a repo dependency.

It is valuable as:
- a large specialist-role library
- a source of operator-facing persona prompts
- a reusable skill-pack seed for callable Forge surfaces

## Useful Value To Keep

- role-specialized agent definitions
- deliverable-focused prompt structure
- "use with many tools" packaging pattern

## Directive Target

Target track:
- `Directive Forge`

Target form:
- skill pack
- curated callable role surfaces
- bounded host follow-up only after explicit promotion

## Keep / Exclude

Keep:
- role definitions worth operationalizing
- role naming patterns
- role-to-task mapping ideas

Do not keep blindly:
- the full repo tree
- every persona file
- upstream install scripts as product truth

## Next Extraction Step

Create a product-owned curated subset under Directive Forge skill ownership:
- identify which roles are actually useful for Mission Control or general Directive Forge use
- re-home only those roles as product-owned assets
- leave generic or low-value personas behind

## Exit Condition

This source becomes removable when:
- the retained role set is re-homed under Directive Workspace ownership
- no active workflow needs `C:\Users\User\.openclaw\workspace\agent-lab\tooling\agency-agents`
