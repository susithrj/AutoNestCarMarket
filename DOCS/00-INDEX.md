## AutoNest Docs (Start here)

This folder contains the project’s technical documentation, organized to cover both **functional requirements** and **non-functional expectations** (security, scalability, responsiveness, maintainability).

### Recommended reading order

- `01-ARCHITECTURE.md`: System overview, key flows, and boundaries
- `02-NFRS.md`: How we achieve security, scalability, responsiveness, maintainability
- `03-API.md`: API conventions and endpoint catalogue
- `04-DATA-MODEL.md`: Database schema and relationships (includes ASCII diagram)
- `05-SECURITY.md`: Auth/RBAC, validation, CORS/cookies, rate limiting, threat model
- `06-FRONTEND.md`: Angular app structure, routing/state conventions, UI patterns
- `11-UX-DESIGN.md`: UX flows, IA, wireframes decisions, baseline design tokens
- `07-BACKEND.md`: Spring Boot layering, specs search, pagination/sort, images
- `08-OPERATIONS.md`: How to run locally + Docker, seed data, troubleshooting
- `09-TESTING.md`: Test strategy, coverage, how to run tests

### Architecture Decision Records (ADRs)

ADRs capture why we made key decisions. They are in `10-DECISIONS/`.

- Use `ADR-TEMPLATE.md` for new decisions.
- Title ADRs with a prefix: **FE**, **BE**, or **FULLSTACK**.

