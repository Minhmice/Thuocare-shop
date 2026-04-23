# Phase 8: Cleanup old routes/nav data + CMS admin prep checklist - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning
**Mode:** Auto-generated (no questions)

<domain>
## Phase Boundary

Finish migration by removing old English/legacy routes and hardcoded nav fallbacks; ensure the Supabase catalog system is the single source of truth; leave a clear CMS admin checklist.

</domain>

<decisions>
## Implementation Decisions

- Delete/retire old route pages once VN routes stable.
- Remove `"#"` nav fallbacks.
- Remove old `TOP_NAV`/static nav sources.
- Produce CMS admin prep checklist: CRUD nodes, ordering, active flags, featured links, descriptions, tags.

</decisions>

<code_context>
## Existing Code Insights

Repo currently contains multiple older routes and nav data modules; cleanup should be surgical to avoid breaking app router.

</code_context>

<specifics>
## Specific Ideas

- Keep redirects/aliases only if explicitly desired; otherwise remove route surface to avoid duplicate content.

</specifics>

<deferred>
## Deferred Ideas

- Actual admin UI implementation.

</deferred>
