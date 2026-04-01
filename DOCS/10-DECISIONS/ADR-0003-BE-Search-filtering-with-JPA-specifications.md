## ADR-0003: BE — Search/filtering using JPA Specifications

### Context

The listing page supports keyword search plus multiple filters and sorts. We want a maintainable way to compose optional criteria.

### Decision

Use **Spring Data JPA Specifications** to build predicates dynamically from a `CarSearchCriteria` object.

### Alternatives considered

- Many repository methods (combinatorial explosion)
- Handwritten SQL builder
- QueryDSL

### Consequences

- **Pros**
  - Composable, testable query logic.
  - Easy to add new filters.
- **Cons / risks**
  - Requires care for performance (indexes, computed expressions).

### Links

- Specification implementation: `autonest-api/src/main/java/com/autonest/service/CarSpecifications.java`
- Search service: `autonest-api/src/main/java/com/autonest/service/CarService.java`

