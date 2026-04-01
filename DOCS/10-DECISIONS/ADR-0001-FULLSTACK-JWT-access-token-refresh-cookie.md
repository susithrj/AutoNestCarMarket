## ADR-0001: FULLSTACK — JWT access token + refresh cookie

### Context

We need authentication for buyer/admin, while keeping the SPA secure. Storing tokens in `localStorage` increases XSS impact. The assignment prefers “basic auth/authz” as a bonus.

### Decision

- Use a short-lived **JWT access token** for API authorization.
- Use an **HttpOnly refresh token cookie** for silent session restoration.
- Keep the access token **in memory** in the SPA (not persisted).

### Alternatives considered

- **LocalStorage JWT**: simpler but higher XSS risk.
- **Server sessions**: more stateful; less aligned with stateless API scaling.

### Consequences

- **Pros**
  - Reduced token theft surface (no access token in JS storage).
  - Clean separation of public vs admin endpoints.
- **Cons / risks**
  - Full page refresh clears in-memory access token; requires refresh flow.
  - Cookie-based refresh endpoints can be CSRF-relevant; rely on SameSite+CORS or add CSRF tokens if needed.

### Links

- Backend security chain: `autonest-api/src/main/java/com/autonest/config/SecurityConfig.java`
- Frontend auth: `autonest-ui/src/app/core/auth/auth.service.ts`

