## Testing

### Scope

- Backend: unit/integration tests for services and key behaviors.
- Frontend: component/unit tests where applicable.

### How to run

- Backend:

```bash
cd autonest-api
./mvnw test
```

- Frontend:

```bash
cd autonest-ui
ng test --watch=false
```

### What to prioritize (assignment-focused)

- Search/filter/sort/pagination correctness
- Admin CRUD happy paths + validation errors
- Auth + RBAC enforcement (admin endpoints)
- Image URL add/delete

