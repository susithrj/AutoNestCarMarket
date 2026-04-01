## Frontend Refactor Plan (Angular + Tailwind)

This plan focuses on improving **modularity**, **extensibility**, and **duplication reduction** while keeping changes incremental and low-risk.

### Current snapshot (what we’re optimizing)

- Components are **standalone** and feature-grouped under `src/app/features/*`.
- The browse page (`CarListComponent`) owns a large amount of UI + state + URL sync.
- Repeated logic exists for:
  - formatting (AED price, mileage)
  - status badges (labels + colors)
  - error and loading states

---

## Goals

- **Modularity**: smaller components with single responsibility (easy to test and reuse).
- **Extensibility**: new filters/pages (e.g. Saved/Favourites) should not expand a “mega component”.
- **Consistency**: one source of truth for formatting, badges, and error UI.
- **Maintainability**: state and URL mapping should be obvious and centralized.

---

## Phase 0 — Baseline (no behavior change)

### 0.1 Add shared formatting utilities (remove duplication)

**Problem**: `Intl.NumberFormat` usage is duplicated in:
- `features/cars/car-list/car-list.component.ts`
- `features/cars/car-detail/car-detail.component.ts`
- `features/admin/car-manage/car-manage.component.ts`

**Plan**
- Create `src/app/shared/utils/format.ts` (or pipes in `shared/pipes/*`):
  - `formatAed(n: number): string`
  - `formatKm(n: number): string`
- Replace all local `formatPrice` / `formatMileage` methods with shared usage.

**Acceptance**
- No UI changes; identical formatting output.
- One place to update locale/format rules.

### 0.2 Centralize listing status mapping (use existing BadgeComponent)

**Problem**: Status label/class logic is embedded in `CarDetailComponent` despite having `shared/components/badge`.

**Plan**
- Create `src/app/shared/domain/listing-status.ts`:
  - `statusLabel(status): string`
  - `statusVariant(status): BadgeVariant`
- Update detail/list/admin views to render status with `<app-badge>`.

**Acceptance**
- Status text and colors remain consistent across app.
- No duplicated switch statements for status.

---

## Phase 1 — Extract browse UI into composable components

### 1.1 Create `CarCardComponent` (reusable card)

**Why**: Card UI + hover overlay + favourite button is high-churn and will be reused (browse, favourites, “similar cars”).

**Plan**
- New file: `src/app/features/cars/components/car-card/car-card.component.ts`
- Inputs:
  - `car: CarListItem`
  - `isFavorite: boolean`
- Outputs:
  - `view: EventEmitter<number>` (navigate)
  - `toggleFavorite: EventEmitter<number>` (heart button)
- Move markup from `CarListComponent` into this component.

**Acceptance**
- Browse grid renders identically.
- Heart still does not trigger navigation.
- Keyboard accessibility remains (Enter/Space).

### 1.2 Create filter UI components

**Plan**
- `CarSearchBarComponent`
  - keyword input, Filters button, Show button
- `CarFiltersRowComponent`
  - Make, Model, Price + Reset
- `CarFiltersDrawerComponent`
  - Year, Fuel, Transmission, Mileage, Location + Apply/Reset
- `PopularBrandChipsComponent`
  - curated pills (no business logic, just events)

**Acceptance**
- All query-param driven behavior remains in parent.
- Components are mostly “dumb” (presentational) with clear input/output contracts.

---

## Phase 2 — Formalize browse state model (URL-driven but cleaner)

### 2.1 Introduce `CarsBrowseState`

**Problem**: `CarListComponent` contains many signals, scattered validations, and repeated “set + navigate merge”.

**Plan**
- Create `src/app/features/cars/browse/browse.models.ts`

```ts
export interface CarsBrowseState {
  q: string;
  brand: string;
  model: string;
  price: string;
  year: string;
  fuelType: string;
  transmission: string;
  maxMileage: string;
  location: string;
  sort: string;
  page: number;
  size: number;
}
```

- Create `src/app/features/cars/browse/browse.query.ts`
  - `stateFromQueryParamMap(qp): CarsBrowseState`
  - `queryParamsFromState(state): Record<string, any>`
  - `sanitizeState(state): CarsBrowseState` (normalize casing, validate values)

**Acceptance**
- All query param parsing + validation lives in one place.
- `CarListComponent` becomes orchestration only: read state, call API, render children.

---

## Phase 3 — Shared UI primitives for consistent Tailwind usage

### 3.1 Add minimal primitives (optional but high leverage)

**Problem**: Buttons/inputs/selects repeat long Tailwind class strings and drift over time.

**Plan**
- Add:
  - `shared/ui/button/button.component.ts` with variants (`primary`, `secondary`, `danger`, `ghost`)
  - `shared/ui/input/input.component.ts`
  - `shared/ui/select/select.component.ts`
  - `shared/ui/card/card.component.ts`

**Acceptance**
- Reduced class duplication.
- Faster UI changes while keeping consistent brand styling.

---

## Phase 4 — Error & loading state standardization

### 4.1 `ErrorStateComponent` + `LoadingState` pattern

**Plan**
- Create `shared/components/error-state/error-state.component.ts`:
  - Inputs: `message`, `actionLabel`
  - Output: `action`
- Create a small skeleton component for list/detail if desired.

**Acceptance**
- Consistent “Failed to load / Try again” UX across pages.
- Less repeated markup.

---

## Suggested file/dir layout after refactor

```text
src/app/
  core/
    auth/
    guards/
    http/
    favorites/
  features/
    cars/
      browse/                 # state + query mapping
        browse.models.ts
        browse.query.ts
      components/
        car-card/
        car-search-bar/
        car-filters-row/
        car-filters-drawer/
        popular-brand-chips/
      car-list/               # orchestration only
      car-detail/
    admin/
    auth/
  shared/
    components/
      badge/
      toast/
      pagination/
      error-state/
    domain/
      listing-status.ts
    ui/
      button/
      input/
      select/
    utils/
      format.ts
```

---

## Implementation order (recommended)

1. Shared formatting utils/pipes (`formatAed`, `formatKm`)
2. Listing status mapping + use `BadgeComponent`
3. Extract `CarCardComponent`
4. Extract filter row/drawer/search bar components
5. Introduce `CarsBrowseState` + query mapping helpers
6. Optional UI primitives (button/input/select)
7. Optional error/loading components

---

## Definition of Done (DoD)

- `npm run build` passes.
- Browse, detail, and admin flows match existing behavior.
- No new UX regressions on mobile breakpoints.
- Duplicated formatting/status mapping removed.
- Browse orchestration component becomes < ~200 lines of TS logic (templates moved to children).

