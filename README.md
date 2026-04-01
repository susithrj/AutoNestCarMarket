# AutoNest — Used Car E-Commerce SPA

A full-stack Single Page Application for browsing and managing used car listings, built with Angular 21 and Spring Boot 3 (Java 21).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21, Tailwind CSS, TypeScript |
| Backend | Spring Boot 3, Java 21, Spring Security 6 |
| Database | MySQL 8, Spring Data JPA, Hibernate |
| Auth | JWT (in-memory) + refresh token (HttpOnly cookie) |
| Docs | SpringDoc OpenAPI — Swagger UI |
| Infra | Docker Compose (3 containers) |

---

## Prerequisites

To run via Docker Compose (recommended):
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine + Docker Compose plugin

To run locally without Docker:
- Java 21
- Node.js 20+
- MySQL 8 running locally
- Angular CLI 21 — `npm install -g @angular/cli@21`

---

## Running with Docker Compose (recommended)

This is the fastest way to get everything running. One command starts MySQL, the backend, and the frontend.

```bash
# Clone your repository (or download the source)
git clone <your-repo-url>
cd AutoNest
docker compose up --build
```

Once all containers are healthy:

| Service | URL |
|---|---|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/swagger-ui/index.html |
| OpenAPI spec | http://localhost:8080/v3/api-docs |

To stop and remove containers:

```bash
docker compose down
```

To stop and also wipe the database volume (full reset):

```bash
docker compose down -v
```

### Seed data

On first startup the backend automatically runs `data.sql`, which inserts:
- One ADMIN user
- One BUYER user
- A set of sample car listings

Images are represented as `image_url` rows. If the project uses local `/uploads/...` URLs in seed data, the corresponding image files must also be shipped/copied into the container on first startup; otherwise seed image URLs should point to public placeholder images.

Default credentials:

| Role | Email | Password |
|---|---|---|
| ADMIN | admin@autonest.com | Admin@123 |
| BUYER | buyer@autonest.com | Buyer@123 |

Admin (copy/paste):

- **Admin**: `admin@autonest.com` / `Admin@123`

---

## Running Locally (without Docker)

### 1. Database setup

Create a MySQL database and user:

```sql
CREATE DATABASE autonest;
CREATE USER 'autonest'@'localhost' IDENTIFIED BY 'autonest123';
GRANT ALL PRIVILEGES ON autonest.* TO 'autonest'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend

```bash
cd autonest-api
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`. Schema is auto-created by Hibernate on first run and seed data is loaded from `src/main/resources/data.sql`.

To use a different database URL or credentials, edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/autonest
    username: autonest
    password: autonest123
```

### 3. Frontend

```bash
cd autonest-ui
npm install
ng serve
```

The app starts on `http://localhost:4200`. The dev proxy forwards `/api` requests to `http://localhost:8080`.

---

## API Overview

### Public endpoints (no auth required)

```
GET  /api/cars              List and search listings
                            Query params: q, brand, model, minPrice, maxPrice,
                            fuelType, transmission, minYear, maxYear,
                            maxMileage, location, sort, page, size
GET  /api/cars/{id}         Car detail
GET  /api/cars/brands       Distinct brand list
POST /api/auth/register     Register as buyer
POST /api/auth/login        Login — returns access token + sets refresh cookie
POST /api/auth/refresh      Refresh access token using HttpOnly cookie
```

### Protected endpoints (ADMIN role required)

```
GET    /api/admin/cars                  All listings including soft-deleted
GET    /api/admin/cars/page             Paginated admin list (includes soft-deleted)
GET    /api/admin/cars/{id}             Admin detail (includes soft-deleted)
POST   /api/admin/cars                  Create listing
PUT    /api/admin/cars/{id}             Update listing
DELETE /api/admin/cars/{id}             Soft delete listing
POST   /api/admin/cars/{id}/restore     Restore a soft-deleted listing
POST   /api/admin/cars/{id}/images/urls Add image URL(s)
DELETE /api/admin/cars/{id}/images/{imgId}  Delete image
POST   /api/auth/logout                 Revoke refresh token
```

Full interactive documentation is available at `/swagger-ui/index.html` when the backend is running.

---

## Project Structure

```
AutoNest/
├── docker-compose.yml                  # mysql · autonest-api · autonest-ui
├── autonest-api/                       # Spring Boot backend
│   ├── src/main/java/com/autonest/
│   │   ├── config/                     # SecurityConfig, SwaggerConfig, CorsConfig
│   │   ├── controller/                 # AuthController, CarController, AdminCarController
│   │   ├── service/                    # AuthService, CarService, ImageService
│   │   ├── repository/                 # UserRepository, CarRepository,
│   │   │                               # CarImageRepository, RefreshTokenRepository
│   │   ├── model/                      # User, CarListing (@SQLDelete+@Where),
│   │   │                               # CarImage, RefreshToken
│   │   ├── dto/
│   │   │   ├── request/                # LoginRequest, RegisterRequest, CarRequest
│   │   │   └── response/               # AuthResponse, CarResponse (finalPrice),
│   │   │                               # ErrorResponse
│   │   ├── security/                   # JwtUtil, JwtFilter, RateLimitFilter
│   │   └── exception/                  # GlobalExceptionHandler
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── application-docker.yml
│   │   └── data.sql                    # Seed data (runs on first startup)
│   └── Dockerfile
├── autonest-ui/                        # Angular 21 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/             # auth.guard.ts, role.guard.ts
│   │   │   │   ├── http/               # auth.interceptor.ts
│   │   │   │   ├── auth/               # auth.service.ts, auth.models.ts
│   │   │   │   └── favorites/          # favorites.service.ts
│   │   │   ├── features/
│   │   │   │   ├── auth/               # login/, register/
│   │   │   │   ├── cars/               # car-list/, car-detail/, browse/, components/
│   │   │   │   └── admin/              # car-form/, car-manage/
│   │   │   ├── shared/
│   │   │   │   ├── components/         # pagination/, toast/, badge/, error-state/
│   │   │   │   ├── domain/             # listing-status.ts
│   │   │   │   └── utils/              # format.ts
│   │   │   └── app.routes.ts
│   │   ├── environments/               # environment.ts, environment.prod.ts
│   │   └── styles.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── README.md
```

---

## Features

### Buyer (guest or logged-in)
- Browse car listings in a responsive grid
- Search by keyword (brand, model, location)
- Filter by brand, price range, fuel type, year, mileage, transmission
- Sort by price, year, or mileage
- Paginated results (12 per page)
- View full car detail with image gallery

### Admin
- All buyer features
- Create, update, and soft-delete car listings
- Upload and remove car images
- View all listings including soft-deleted ones

### Security and extras
- JWT access tokens in Angular memory only — no `localStorage`, no `sessionStorage`
- Refresh token in `Secure`, `HttpOnly`, `SameSite=Strict` cookie with rotation
- Because the access token is in-memory, a full page refresh clears it; the UI can restore a session by calling `/api/auth/refresh` (cookie-based) on startup
- Rate limiting on auth endpoints — 10 req/min per IP via Bucket4j
- Role-based route guards on frontend + `@PreAuthorize` on backend
- Soft delete via `deleted_at` timestamp with Hibernate `@SQLDelete` + `@Where`
- `finalPrice` computed server-side in response DTO
- Seed data loaded on first startup — reviewer sees a populated UI immediately
- Docker named volumes for database and image persistence across restarts

---

## Assumptions and Design Decisions

- **ADMIN acts as seller.** There is no separate SELLER role. ADMIN users create and manage all listings. A `created_by_user_id` FK records which admin created each listing.
- **Pagination over infinite scroll.** Chosen for simplicity and better URL shareability. Page size defaults to 12.
- **Soft delete uses `deleted_at` timestamp.** More auditable than an `is_active` boolean. Hibernate `@SQLDelete` and `@Where` ensure deleted listings never appear in public queries without extra effort at the query level.
- **Final price is computed server-side.** `finalPrice = base_price + additional_charges - discount_amount`. The response DTO includes `finalPrice` so the frontend never calculates it.
- **Image URLs are relative paths in development.** Stored as `/uploads/cars/{id}/filename.jpg`, served by the Spring Boot static resource handler. The `ImageService` is abstracted so S3 can be swapped in without touching any other code.
- **Docker named volumes** (`mysql_data`, `uploads_data`) ensure database records and uploaded images persist across container restarts.

### Refresh token cookie and CSRF note

This project uses a refresh token stored in a `Secure`, `HttpOnly`, `SameSite=Strict` cookie. Because cookies are automatically attached by the browser, `/api/auth/refresh` and `/api/auth/logout` are treated as CSRF-relevant endpoints. The approach relies on `SameSite=Strict` plus a locked-down CORS policy (only the frontend origin is allowed). If the UI and API are hosted on different subdomains in production (where `SameSite=Strict` may block legitimate cross-site cookie use), the next step would be explicit CSRF tokens for these endpoints and a different SameSite setting.

For the full architecture document see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Running Tests

```bash
# Backend unit and integration tests
cd autonest-api
./mvnw test

# Frontend unit tests
cd autonest-ui
ng test --watch=false
```

---

## Demo video

- **Demo video link**: `https://www.loom.com/share/60a5a9a6215d4ca6803deeb5bea5185b` 

---

## Cloud preview deployment

If you want a **live cloud preview** (hosted frontend + API + database), I can provide a deployment/preview environment **upon request** (e.g., Render/Railway/Fly.io/AWS/GCP/Azure), based on your preferred provider and constraints.
