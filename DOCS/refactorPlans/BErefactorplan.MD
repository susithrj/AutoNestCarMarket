## Backend Refactor Plan (Spring Boot)

This plan improves **modularity**, **extensibility**, and **consistency** in `autonest-api` while keeping changes incremental and low-risk.

---

## Goals

- Reduce duplication (especially DTO mapping).
- Make behavior explicit (soft delete “include deleted” paths, sorting semantics).
- Improve security configuration for different environments.
- Keep the API stable for the Angular SPA.

---

## Phase 0 — Baseline (no behavior change)

### 0.1 Introduce mapper utilities (remove DTO mapping duplication)

**Problem**
`CarService` maps `CarListing -> CarDetailResponse` in multiple methods with near-identical code blocks.

**Plan**
- Create `com.autonest.service.mapper` package:
  - `CarMapper`:
    - `toDetail(CarListing listing, List<CarImageResponse> images, BigDecimal finalPrice): CarDetailResponse`
    - `toListItem(CarListing listing, String primaryImageUrl, BigDecimal finalPrice): CarListItemResponse`
  - `CarImageMapper`:
    - `toDto(CarImage image): CarImageResponse`
- Update services to call the mapper.

**Acceptance**
- JSON responses remain identical.
- Future fields are added in one place.

### 0.2 Centralize “final price” calculation

**Problem**
Final price is computed in `CarService` and also as an expression in `CarSpecifications`.

**Plan**
- Add a small utility:
  - `Pricing.finalPrice(BigDecimal base, BigDecimal charges, BigDecimal discount)`
- Use it in `CarService` to reduce null-handling duplication.
- Keep the JPA Criteria expression as-is but comment that it matches the service-level formula.

**Acceptance**
- No behavioral changes.
- Formula remains single-source-of-truth in one helper.

---

## Phase 1 — Soft delete + “include deleted” clarity

### 1.1 Encapsulate “include deleted” queries

**Problem**
`CarRepository` uses `nativeQuery = true` to bypass `@Where(deleted_at IS NULL)` for admin paths.

**Plan**
- Keep this mechanism, but:
  - Document the reason directly in code (bypassing `@Where`).
  - Avoid `SELECT *` where possible (explicit columns or JPQL with filter override if chosen later).
  - Consider a dedicated repository interface (e.g. `AdminCarRepository`) if admin querying grows.

**Acceptance**
- Admin list/detail continue to show deleted listings.
- Public list/detail continue to exclude deleted listings.

### 1.2 Add a restore endpoint (optional)

**Plan**
- `POST /api/admin/cars/{id}/restore` sets `deleted_at = NULL`.
- This leverages the auditability advantage of soft delete.

**Acceptance**
- Restored cars reappear in public search.

---

## Phase 2 — Sorting semantics and API consistency

### 2.1 Align sorting by price with displayed “final price”

**Problem**
API sorts `price` by `basePrice`, but UI displays `finalPrice`.

**Options**
- **Option A (preferred)**: implement “finalPrice” sort by using a derived expression in queries (custom specification/order-by).
- **Option B**: keep base-price sort but rename sort key to `basePrice` and add `finalPrice` as a separate documented sort if implemented.

**Acceptance**
- Sorting behavior matches what the user sees.

### 2.2 Paginate admin listing (optional but scalable)

**Problem**
Admin list returns `List`, which can grow.

**Plan**
- Add paged admin endpoint:
  - `GET /api/admin/cars?page=&size=&sort=`
- Keep the old endpoint for backward compatibility or deprecate it.

---

## Phase 3 — Security configuration hardening

### 3.1 Make cookie flags environment-driven

**Problem**
Refresh cookie uses `.secure(false)` always.

**Plan**
- Introduce config properties:
  - `autonest.auth.cookie.secure`
  - `autonest.auth.cookie.same-site`
  - `autonest.auth.cookie.domain` (optional)
- Default to local dev safe settings; set secure settings in docker/prod.

**Acceptance**
- No local dev regression.
- Production-friendly settings available without code changes.

### 3.2 Add structured error codes (optional)

**Plan**
- Extend `ErrorResponse` to include a stable `code` string (e.g., `AUTH_INVALID_CREDENTIALS`).
- Keep message human readable.

**Acceptance**
- UI can branch on codes without string matching.

---

## Phase 4 — Image URL management robustness

### 4.1 Validate image URLs

**Problem**
Currently only trims/filters blanks.

**Plan**
- Validate allowed patterns:
  - `http://` / `https://`
  - or internal `/uploads/...` / `/resources/...`
- Return `400` with field errors for invalid URLs.

**Acceptance**
- Prevents storing obviously invalid values.

### 4.2 Enforce primary image invariants (optional)

**Plan**
- If deleting the primary image, promote the next image to primary automatically.

---

## Suggested package structure after refactor

```text
com.autonest/
  controller/
  service/
    mapper/
    pricing/
  repository/
  dto/
  model/
  security/
  config/
  exception/
```

---

## Implementation order (recommended)

1. Add mappers (`CarMapper`, `CarImageMapper`) and refactor services
2. Add pricing helper (`finalPrice`)
3. Document/include-deleted query strategy
4. Cookie flags configuration
5. Price sort alignment (final price)
6. Optional: admin pagination + restore endpoint
7. URL validation + primary invariants

---

## Definition of Done (DoD)

- Existing UI flows (browse, detail, admin CRUD, images) continue to work.
- Swagger still renders and endpoints remain documented.
- No changes in JSON response shape unless intentionally versioned.
- Core behaviors are covered by tests (service/unit level at minimum).

