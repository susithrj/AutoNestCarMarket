## Architecture

### Goals

- Deliver a **Used Car E-Commerce SPA** with Buyer and Admin flows
- Ensure **security**, **scalability**, **responsiveness**, **maintainability**
- Keep the design **simple and reviewable** (assignment-friendly)

### System context

```text
Browser (Angular SPA)
  |
  |  HTTPS/HTTP (JSON)
  v
Spring Boot API (JWT auth + RBAC)
  |
  |  JDBC
  v
MySQL 8 (JPA/Hibernate)
```

### Key flows

- **Browse/search**: SPA calls `GET /api/cars` with query params (q/filters/sort/page/size).
- **Detail**: SPA calls `GET /api/cars/{id}` for a single listing + images.
- **Admin CRUD**:
  - List/manage: `GET /api/admin/cars`
  - Create: `POST /api/admin/cars`
  - Edit: `PUT /api/admin/cars/{id}`
  - Delete: `DELETE /api/admin/cars/{id}` (soft delete)
- **Images (URL-based)**:
  - Add image URLs: `POST /api/admin/cars/{id}/images/urls`
  - Delete image: `DELETE /api/admin/cars/{id}/images/{imgId}`

### Frontend module boundaries (high level)

- `src/app/features/cars/*`: public browse + detail
- `src/app/features/admin/*`: admin manage + form
- `src/app/features/auth/*`: login/register
- `src/app/core/*`: auth, guards, interceptors, favourites, shared core services
- `src/app/shared/*`: reusable UI pieces (pagination, toast, etc.)

### Backend layering

- `controller/*`: HTTP routing + request binding
- `service/*`: business logic (search criteria, soft delete, pricing, image logic)
- `repository/*`: database access (JPA repositories + custom queries)
- `dto/*`: request/response contracts (API boundary)
- `config/security/*`: security + JWT filter + rate limiting

### “Unique” design decisions worth calling out

- **Soft delete** for listings via `deleted_at` (auditability + safe recovery).
- **Final price** is computed server-side (single source of truth for UI display).
- **Search/filters are URL-driven** in the SPA (shareable state, easy pagination links).
- **Multiple images per car** with stable ordering + primary image selection logic.

