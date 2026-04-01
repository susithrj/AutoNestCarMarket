## API

### Conventions

- **Base URL**: `/api`
- **Pagination**: `page` is **0-indexed**; `size` controls page size.
- **Sorting**: `sort=<key>,<direction>` where direction is `asc|desc`.
- **Errors**: returned as non-2xx HTTP responses; UI surfaces user-friendly messages.

### API documentation (Swagger/OpenAPI)

```text
GET /swagger-ui/index.html
GET /v3/api-docs
```

### Public endpoints

```text
GET /api/cars
  Query:
    q, brand, model, minPrice, maxPrice,
    fuelType, transmission,
    minYear, maxYear,
    maxMileage, location,
    sort, page, size

GET /api/cars/{id}

GET /api/cars/brands
```

### Auth endpoints

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Admin endpoints (ADMIN role)

```text
GET    /api/admin/cars
GET    /api/admin/cars/page
GET    /api/admin/cars/{id}
POST   /api/admin/cars
PUT    /api/admin/cars/{id}
DELETE /api/admin/cars/{id}                 (soft delete)
POST   /api/admin/cars/{id}/restore         (restore soft-deleted listing)

POST   /api/admin/cars/{id}/images/urls     (add multiple image URLs)
DELETE /api/admin/cars/{id}/images/{imgId}
```

### Notes

- Images are stored and managed as **URLs** (preferred by assignment).
- Listing cards use a “primary image” convention based on first/primary image rows.

