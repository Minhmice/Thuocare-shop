# Phase 3: Seed VN taxonomy nodes + descriptions + featured links - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning
**Mode:** Auto-generated (no questions)

<domain>
## Phase Boundary

Populate `catalog_nodes` with real VN top-level categories + child categories (max 2 levels), including menu descriptions and initial featured links so header + category pages can render from DB.

</domain>

<decisions>
## Implementation Decisions

- Nodes keyed by `route_path` and `full_slug` per locked route rules.
- Top-level nodes have `description` (landing copy).
- Nodes intended for header dropdown have `is_visible_in_nav=true` and `nav_description`.
- Featured quick links come from `node_featured_links` (no hardcoded cards).

</decisions>

<code_context>
## Existing Code Insights

Current frontend still has hardcoded nav data; seed enables migration to DB-driven nav.

</code_context>

<specifics>
## Specific Ideas

- Keep seed minimal but representative (enough to validate header + listing).

</specifics>

<deferred>
## Deferred Ideas

- Full taxonomy coverage (can iterate after UI shows correctly).

</deferred>
