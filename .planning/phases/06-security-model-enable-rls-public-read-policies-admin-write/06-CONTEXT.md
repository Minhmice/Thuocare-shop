# Phase 6: Security model: enable RLS + public read policies + admin write - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning
**Mode:** Auto-generated (no questions)

<domain>
## Phase Boundary

Enable RLS for public-facing tables and implement policies so public site can read only active/allowed rows, while writes are restricted to admin/service role.

</domain>

<decisions>
## Implementation Decisions

- RLS enabled on tables exposed to client.
- Public policies: `select` allowed only when `is_active=true` (and additional visibility flags where relevant).
- Writes: blocked for anon/authenticated users unless explicit admin role (future CMS).

</decisions>

<code_context>
## Existing Code Insights

Frontend will call Supabase from server/components; security must not rely on frontend-only checks.

</code_context>

<specifics>
## Specific Ideas

- Keep policies minimal and explicit; prefer deny-by-default.

</specifics>

<deferred>
## Deferred Ideas

- Detailed admin role model and audit logging.

</deferred>
