# UX & Design Spec (v1)

This document consolidates the valuable UX/design guidance that previously lived under `Docs/`. It’s meant to be **implementation-facing**: flows, information hierarchy, layout decisions, and baseline tokens.

## User flows

### Buyer

- Land on site → browse listing grid
- Search by keyword (brand/model/location) and apply filters/sort
- Navigate paginated results
- Open car detail page
- Optionally login/register (browsing stays public)

### Admin

- Login as ADMIN → manage listings
- Create new listing (form) → save
- Edit existing listing → save
- Soft delete listing via confirm modal
- Restore deleted listing (soft-delete recovery)
- Manage images as part of create/edit (URLs or uploads as supported)

## Route map (UX-level)

| Route | Purpose | Notes |
|---|---|---|
| `/` | Listing grid | URL-driven state: `q`, filters, `sort`, `page`, `size`. |
| `/cars/:id` | Car detail | If listing not visible to public API, treat as 404. |
| `/login` | Login | Admin redirects to `/admin`; buyer to `/`. |
| `/register` | Register | Buyer registration only. |
| `/admin` | Admin manage listings | Protected by auth + ADMIN role. |
| `/admin/cars/new` | Create listing | Same form component as edit, in “create mode”. |
| `/admin/cars/:id/edit` | Edit listing | “edit mode” (pre-filled). |

## Information architecture

### Listing grid (browse)

**Goal:** browse/search/filter/sort/paginate from one screen.

1. Header/nav (Logo + nav + auth state)
2. Search input (keyword → `q=`; brand/model/location)
3. Filters (desktop row + advanced drawer on small screens)
4. Toolbar (results count + sort)
5. Car grid
6. Pagination

#### Car card content hierarchy

1. Primary image
2. Title (brand + model + year)
3. **Final price** (prominent)
4. Specs (year, mileage, fuel, transmission)
5. Location
6. Negotiable indicator (only when true)

### Car detail

1. “Back to listings” affordance
2. Image gallery (primary + thumbnails)
3. Title + status badge
4. Final price (+ negotiable badge)
5. Specs row
6. Location
7. Description
8. Optional price breakdown accordion (only if charges/discount non-zero)

### Admin manage listings

1. Page title + “Create listing” CTA
2. Tabs: All / Active / Deleted
3. Table/list of listings
4. Row actions: Edit, Delete (confirm), Restore (confirm; deleted tab)

### Admin car form (create/edit)

Suggested grouping:

- Identification: title, brand, model
- Specs: year, mileage, fuel, transmission, location
- Pricing: base price, additional charges, discount, negotiable, computed final price
- Status + description
- Images (URLs and/or upload capability as implemented)

## Layout wireframes (decisions)

### Listing grid

- Desktop: filters + toolbar + grid (1→2→3 columns depending on breakpoints).
- Mobile: advanced filters move into a drawer triggered by a “Filters” button.
- Pagination centered below grid; keep it predictable (prev/next + up to 5 pages).

### Detail

- ≥ `md`: two-column (gallery left, content right)
- < `md`: single-column (gallery above content)

## Breakpoints (Tailwind-aligned)

| Token | Min width | Typical layout |
|---|---:|---|
| `sm` | 640px | stacked filters; 1-col grid |
| `md` | 768px | 2-col grid |
| `lg` | 1024px | 3-col grid; full header nav |
| `xl` | 1280px | `max-w-screen-xl` container |

Touch targets should be ≥ 44×44px on mobile.

## Visual design tokens (baseline)

These are reference tokens to keep styles consistent (and avoid ad-hoc choices in components). Actual Tailwind theme values should remain the single source of truth.

### Color (conceptual)

- Primary: actions/links/price emphasis
- Neutrals: text, borders, surfaces
- Semantic: success/warning/danger/info (badges and feedback)

### Typography (roles)

- Page title: `text-2xl font-medium`
- Section heading: `text-xl font-medium`
- Card title: `text-base font-medium`
- Body: `text-sm`
- Meta/label: `text-xs text-gray-500`
- Price: `text-xl font-medium text-primary`

## Accessibility baseline

- Contrast: WCAG AA for body text (4.5:1).
- Focus: visible `focus-visible` ring for keyboard users.
- Forms: labels wired to inputs; errors associated via `aria-describedby`.
- Dialogs: focus trap; ESC closes.
- Icons: decorative icons `aria-hidden`, icon-only buttons have `aria-label`.

