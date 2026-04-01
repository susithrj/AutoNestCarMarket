## ADR-0004: FE — URL-driven search/filter state

### Context

The browse page includes search, filters, sorting, and pagination. Users should be able to share URLs and use browser navigation reliably.

### Decision

- Represent browse state in **query params** (`q`, `brand`, `model`, `price`, `year`, etc.).
- Treat the URL as the source of truth; changes update query params and reload results.

### Alternatives considered

- Local component state only (not shareable, refresh loses state)
- Global store (NgRx) (more boilerplate than needed for assignment scope)

### Consequences

- **Pros**
  - Shareable links and predictable navigation.
  - Easy to persist state across reloads.
- **Cons / risks**
  - Must validate query params and normalize values.

### Links

- Browse page: `autonest-ui/src/app/features/cars/car-list/car-list.component.ts`

