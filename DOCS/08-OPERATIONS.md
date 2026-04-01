## Operations

### Run with Docker Compose (recommended)

```bash
docker compose up --build
```

Services (default):

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI spec: `http://localhost:8080/v3/api-docs`

### Seed data

On startup, the backend runs `data.sql` to insert:

- seeded users (ADMIN/BUYER)
- sample listings
- sample image URL rows

### Local dev (without Docker)

- Backend:

```bash
cd autonest-api
./mvnw spring-boot:run
```

- Frontend:

```bash
cd autonest-ui
npm install
ng serve
```

### Troubleshooting

- **CORS errors**: confirm backend allowed origins include `http://localhost:4200`.
- **DB seed not visible**: use `docker compose down -v` to wipe volumes and restart.
- **Images not showing**: verify URL paths resolve (absolute URLs or served static assets).

