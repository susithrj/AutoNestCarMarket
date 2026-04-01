## Full-Stack Refactor Plan (Angular SPA + Spring Boot API)

This is a consolidated plan derived from:
- `newdocs/refactorPlans/ferefactorplan.md`
- `newdocs/refactorPlans/BErefactorplan.MD`

It focuses on **coordinated decisions** that often require **both frontend and backend changes** (e.g., soft-delete restore, sorting semantics, admin pagination).

---

## Objectives

- **Modularity**: reduce “mega components/services” and move reusable logic into shared modules/mappers.
- **Extensibility**: make it easy to add new flows (Saved cars, Restore listing, Admin pagination, etc.).
- **Consistency**: align UI behavior with API semantics (sorting, status labels, error responses).
- **Security & operations**: keep dev UX smooth while making production settings configurable.

---

## Guiding principles (apply across FE + BE)

- **Single source of truth**
  - Price breakdown and “final price” rules: one documented formula.
  - Status labels/colors: one mapping used everywhere.
- **Stable contracts**
  - Prefer additive changes to API responses.
  - When changing semantics (e.g. price sorting), document and version if needed.
- **Incremental refactor**
  - Each phase should keep the app buildable and usable end-to-end.

---

## Phase 0 — Baseline refactors (no product behavior change)

### FE action items (`autonest-ui/`)

- **FE-0.1 Formatting utilities**
  - Add shared formatting utility/pipe(s) for AED and KM.
  - Replace duplicated `Intl.NumberFormat` usages in list/detail/admin screens.
  - Acceptance: output unchanged.

- **FE-0.2 Centralize listing status rendering**
  - Create shared mapping for `ListingStatus` → label + badge variant.
  - Render statuses through the shared `BadgeComponent` consistently.

- **FE-0.3 Standard error UI (optional, but easy win)**
  - Add `ErrorStateComponent` and use it for “Failed to load / Try again” blocks.

### BE action items (`autonest-api/`)

- **BE-0.1 DTO mapping extraction**
  - Introduce mapper classes (e.g., `CarMapper`, `CarImageMapper`) and refactor services to use them.
  - Acceptance: JSON shape unchanged.

- **BE-0.2 Centralize pricing helper**
  - Add a pricing helper method for final price calculation (null-safe).
  - Keep `CarSpecifications` expression aligned and documented.

---

## Phase 1 — Refactor browse UI into composable components (FE-only behavior)

### FE action items (`autonest-ui/`)

- **FE-1.1 Extract `CarCardComponent`**
  - Inputs: `car`, `isFavorite`
  - Outputs: `view`, `toggleFavorite`
  - Acceptance: grid unchanged; heart doesn’t navigate; keyboard works.

- **FE-1.2 Extract browse filter components**
  - `CarSearchBarComponent`, `CarFiltersRowComponent`, `CarFiltersDrawerComponent`, `PopularBrandChipsComponent`.
  - Parent keeps URL-sync and API orchestration.

- **FE-1.3 Introduce `CarsBrowseState` + query helpers**
  - Centralize parsing/validation/normalization of query params.
  - Acceptance: behavior unchanged, code clarity improved.

### BE action items

- None required (no contract changes).

---

## Phase 2 — Coordinated feature decisions (FE + BE changes)

This is where full-stack alignment matters most.

### 2.1 Restore soft-deleted listings (example from your note)

**Decision**: Support restoring soft-deleted listings to leverage the auditability of soft delete.

#### BE action items (`autonest-api/`)

- **BE-2.1.1 Add restore endpoint**
  - `POST /api/admin/cars/{id}/restore`
  - Behavior: sets `deleted_at = NULL` for the listing.
  - Security: admin-only (under `/api/admin/**`).
  - Response: either `204 No Content` or the restored `CarDetailResponse`.

- **BE-2.1.2 Repository support**
  - Because public repositories are filtered by `@Where(deleted_at IS NULL)`, implement restore using a path that can “see deleted”.
  - Options:
    - native update query (`UPDATE car_listings SET deleted_at=NULL WHERE id=?`)
    - or a dedicated admin repository method.

#### FE action items (`autonest-ui/`)

- **FE-2.1.1 Add “Restore” UI in Admin manage**
  - In the “Deleted” tab, show a **Restore** action.
  - Add confirmation modal copy: “This will restore the listing and make it visible publicly again.”

- **FE-2.1.2 Add Admin API method**
  - Add `restore(id: number)` to `AdminApi`.
  - On success: toast + reload list.

**Acceptance**
- Restored cars reappear in public search and detail pages.

---

### 2.2 Sorting semantics: displayed final price vs base price

**Decision needed**: When UI displays `finalPrice`, should `sort=price` reflect `finalPrice`?

#### BE action items (`autonest-api/`)

- **BE-2.2.1 Choose approach**
  - Option A: implement final-price sorting at DB level (custom order-by / derived expression).
  - Option B: document that `price` sorts by base price; rename keys to make it explicit.

#### FE action items (`autonest-ui/`)

- **FE-2.2.1 Align label + behavior**
  - If API sorts by base price, label sort dropdown accordingly (“Base price”).
  - If API sorts by final price, keep label “Price” and document.

**Acceptance**
- Sorting behavior matches what the user expects from the UI label.

---

### 2.3 Admin listing pagination (optional but scalable)

#### BE action items
- Add paged endpoint for admin list:
  - `GET /api/admin/cars?page=&size=&sort=`
  - Decide whether to keep the unpaged endpoint for backward compatibility.

#### FE action items
- Upgrade manage table to use pagination component (same as browse).

---

## Phase 3 — Security/ops hardening (mostly BE, minor FE)

### BE action items (`autonest-api/`)

- **BE-3.1 Cookie settings configurable**
  - Make refresh cookie `.secure`, `.sameSite`, and optional `domain` environment-driven.

- **BE-3.2 Structured error codes (optional)**
  - Add `code` field to `ErrorResponse` for stable client behavior.

### FE action items (`autonest-ui/`)

- **FE-3.1 Optional: map error codes to UX**
  - If `ErrorResponse.code` exists, show better messages without string matching.

---

## Phase 4 — Image robustness (full-stack alignment)

### BE action items
- Validate image URLs (allowed schemes/prefixes) and return field errors on invalid input.
- Optional: primary image invariants when deleting the primary image.

### FE action items
- Improve form messaging based on field-level errors (if backend returns them).

---

## Work sequencing (recommended)

1. **Phase 0** (safe refactors): mappers + formatting + status mapping
2. **Phase 1** (FE decomposition): extract browse components + browse state helpers
3. **Phase 2.1** (Restore endpoint): coordinated BE endpoint + FE admin action (good “full-stack” showcase)
4. Phase 2.2 (price sort decision)
5. Phase 3/4 (hardening)

---

## Deliverables checklist per phase

- **Builds pass**
  - FE: `npm run build`
  - BE: `./mvnw test` (or at least compile + unit tests)
- **No contract breakage** without documentation
- **Docs updated** (ADRs where decisions affect behavior)

