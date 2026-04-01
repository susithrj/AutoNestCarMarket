## Backend (Spring Boot)

### Stack

- Spring Boot 3, Java 21
- Spring Data JPA + Hibernate
- MySQL 8

### Layering

- **Controllers**: HTTP bindings and routing
- **Services**: business logic and orchestration
- **Repositories**: data access
- **DTOs**: request/response contracts

### Search/filtering

- Uses **JPA Specifications** to build predicates from query parameters.
- Supports:
  - keyword search (brand/model/location/title)
  - brand/model/fuel/transmission filters
  - year range and max mileage
  - price range using computed final price expression

### Pagination & sorting

- Pageable-based pagination.
- Sort key mapping at controller boundary (e.g. `sort=year,desc`).
- Admin paging endpoint exists for scalability (`GET /api/admin/cars/page`).

### Image management

- Images stored as URL strings in `car_images`.
- Admin can add multiple image URLs at once and delete images.
- Image URL inputs are validated (http/https or known internal prefixes).

### Soft delete

- Listings are soft deleted using `deleted_at`.
- Public endpoints should exclude deleted records.
- Admin restore is supported (`POST /api/admin/cars/{id}/restore`).

### Key files to reference

- Controllers: `autonest-api/src/main/java/com/autonest/controller/*`
- Specs: `autonest-api/src/main/java/com/autonest/service/CarSpecifications.java`
- Search: `autonest-api/src/main/java/com/autonest/service/CarService.java`
- Repos: `autonest-api/src/main/java/com/autonest/repository/*`

