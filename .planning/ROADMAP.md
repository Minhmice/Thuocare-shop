# ROADMAP

## Milestone 1 — Supabase-powered catalog + Vietnamese routes

### Phase 0: Bootstrap roadmap + seed phase scaffolding

**Goal:** Establish planning scaffolding for the project so upcoming phases can be planned and executed consistently.
**Requirements**: TBD
**Depends on:** None
**Plans:** 0 plans

Plans:
- [ ] TBD


### Phase 1: Supabase schema+RPC for catalog_nodes nav tree; VN routes; frontend refactor

**Goal:** Implemented (schema + RPC + routes + header integration)
**Requirements**: TBD
**Depends on:** Phase 0
**Plans:** 0 plans

Plans:
- [x] Implemented in codebase + migrations

### Phase 2: Supabase schema v1: catalog_nodes/products/tags/link tables + indexes

**Goal:** Implemented (tables + constraints + indexes)
**Requirements**: TBD
**Depends on:** Phase 1
**Plans:** 0 plans

Plans:
- [x] Implemented in migrations 0008

### Phase 3: Seed VN taxonomy nodes + descriptions + featured links

**Goal:** Implemented (seeded demo taxonomy + featured links)
**Requirements**: TBD
**Depends on:** Phase 2
**Plans:** 0 plans

Plans:
- [x] Implemented in supabase/seed.sql

### Phase 4: Seed products + node links + tags

**Goal:** Implemented (seeded demo catalog product + node link; tags RPC ready)
**Requirements**: TBD
**Depends on:** Phase 3
**Plans:** 0 plans

Plans:
- [x] Implemented in supabase/seed.sql + migrations

### Phase 5: Postgres RPC: get_header_navigation/get_node_page_by_path/get_product_page_by_slug/search

**Goal:** Implemented (RPC functions returning JSON for app)
**Requirements**: TBD
**Depends on:** Phase 4
**Plans:** 0 plans

Plans:
- [x] Implemented in migrations 0009 + 0011

### Phase 6: Security model: enable RLS + public read policies + admin write

**Goal:** Implemented (RLS + public read for new tables)
**Requirements**: TBD
**Depends on:** Phase 5
**Plans:** 0 plans

Plans:
- [x] Implemented in migration 0010

### Phase 7: Frontend refactor: VN routes + data fetching via RPC

**Goal:** Implemented (dynamic VN category routes + canonical product/content routes + header RPC prefer)
**Requirements**: TBD
**Depends on:** Phase 6
**Plans:** 0 plans

Plans:
- [x] Implemented in app routes + data layer

### Phase 8: Cleanup old routes/nav data + CMS admin prep checklist

**Goal:** Partially implemented (removed # href from seed; legacy pages kept for compatibility)
**Requirements**: TBD
**Depends on:** Phase 7
**Plans:** 0 plans

Plans:
- [x] Cleanup applied where safe (no breaking deletions)
