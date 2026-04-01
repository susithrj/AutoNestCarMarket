## Frontend (Angular SPA)

### Stack

- Angular 21 (standalone components)
- Tailwind CSS

### UX/design reference

- For user flows, information architecture, and baseline tokens, see `11-UX-DESIGN.md`.

### Key UI pages

- **Browse**: listings grid, search, filters, sorting, pagination
- **Detail**: single car view, image gallery
- **Auth**: login/register
- **Admin**: manage listings, create/edit, image URL management

### State + URL conventions

- Search, filters, sort, and pagination are represented in **query params**.
- This enables:
  - Shareable links
  - Back/forward browser navigation support
  - Refresh-safe browsing state

### Responsiveness patterns

- Grid changes by breakpoint (1 → 2 → 3 columns).
- Progressive disclosure for filters (drawer for “advanced” filters).

### Accessibility checklist (baseline)

- Interactive card is keyboard accessible (`tabindex`, Enter/Space).
- Buttons have `aria-label` where needed (favourite/save icon).

### Key files to reference

- Browse: `autonest-ui/src/app/features/cars/car-list/car-list.component.ts`
- Browse components: `autonest-ui/src/app/features/cars/components/*`
- Browse state helpers: `autonest-ui/src/app/features/cars/browse/*`
- Detail: `autonest-ui/src/app/features/cars/car-detail/car-detail.component.ts`
- Routing: `autonest-ui/src/app/app.routes.ts`
- Auth: `autonest-ui/src/app/features/auth/*`

