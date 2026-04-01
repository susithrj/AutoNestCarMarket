## ADR-0002: BE — Soft delete listings via `deleted_at`

### Context

The admin needs to “delete” listings, but hard deletes remove auditability and can break references (e.g., images).

### Decision

- Implement soft delete on car listings using a nullable `deleted_at` timestamp.
- Public queries exclude deleted records; admin views can include them.

### Alternatives considered

- Hard delete rows: simplest, but not reversible and less auditable.
- Boolean `is_deleted`: workable, but timestamp is more informative.

### Consequences

- **Pros**
  - Audit-friendly and safer.
  - Reversible in future (restore flow can be added).
- **Cons / risks**
  - Queries must consistently exclude deleted rows for public endpoints.

### Links

- Model and repository logic: `autonest-api/src/main/java/com/autonest/model/CarListing.java`
- Admin delete endpoint: `autonest-api/src/main/java/com/autonest/controller/AdminCarController.java`

