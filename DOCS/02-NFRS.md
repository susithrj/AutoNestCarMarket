## Non-Functional Requirements (NFRs)

This document maps the assignment’s non-functional expectations to concrete choices in the codebase.

### Security

**What we implemented**

- **Authentication**: JWT access token with refresh flow (SPA-friendly).
- **Authorization (RBAC)**: Admin endpoints protected under `/api/admin/**`.
- **Input validation**: server-side validation with `@Valid` + frontend form validation.
- **CORS**: limited to the frontend origin.
- **Cookie considerations**: refresh token in `HttpOnly` cookie (mitigates token theft by JS).
- **Rate limiting**: auth endpoints protected via rate limit filter (where configured).

**Why it matters**

- Limits who can mutate data (Admin only).
- Protects against basic abuse and common input attacks.

**Evidence (where to look)**

- `autonest-api/src/main/java/com/autonest/config/SecurityConfig.java`
- `autonest-ui/src/app/core/guards/*`
- `autonest-ui/src/app/core/auth/*`

### Scalability

**What we implemented**

- **Pagination** on listing endpoint (avoids loading all cars at once).
- **Efficient searching/filtering** via database queries (JPA Specifications).
- **Sorting** performed server-side (consistent and efficient).
- **Primary image selection** optimized by batch lookup per page.

**Why it matters**

- Keeps list screens fast as records grow.
- Ensures consistent results across clients.

**Evidence**

- `autonest-api/src/main/java/com/autonest/controller/CarController.java`
- `autonest-api/src/main/java/com/autonest/service/CarSpecifications.java`
- `autonest-api/src/main/java/com/autonest/service/CarService.java` (primary image mapping)

### Responsiveness

**What we implemented**

- Responsive layouts using Tailwind breakpoints for:
  - Search/filters
  - Grid listing layout
  - Drawer pattern for “advanced filters”
  - Admin forms (single column on mobile, multi-column on larger screens)

**Evidence**

- `autonest-ui/src/app/features/cars/car-list/car-list.component.ts`
- `autonest-ui/src/app/features/admin/car-form/car-form.component.ts`

### Maintainability

**What we implemented**

- **Clear layering** on the backend (controller/service/repo/dto).
- **Feature-based structure** on the frontend.
- **Separation of concerns**: query parsing, criteria creation, and DB specs are isolated.
- **Consistent API contracts** via DTOs (avoids exposing JPA entities).
- **Docs + ADRs** (this folder) to capture decisions and trade-offs.

**Evidence**

- `autonest-api/src/main/java/com/autonest/dto/*`
- `autonest-ui/src/app/features/*`

