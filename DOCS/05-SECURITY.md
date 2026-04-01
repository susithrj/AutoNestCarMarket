## Security

### Auth model

- **Access token**: JWT used for API calls.
- **Refresh token**: stored in an **HttpOnly cookie**; UI refreshes access tokens without storing secrets in localStorage.

### Authorization model (RBAC)

- Public endpoints (`/api/cars/**`, `/api/auth/**`) are accessible without Admin role.
- Admin endpoints (`/api/admin/**`) require `ROLE_ADMIN`.

### Validation

- Frontend: reactive form validators (required, type checks, min/max).
- Backend: request DTO validation via `@Valid` + constraint annotations (where defined).

### CORS and cookies

- CORS is restricted to the frontend origin.
- Refresh cookie is HttpOnly; consider CSRF protections if you allow cross-site cookie usage in production.
- Refresh cookie flags are configurable via:
  - `autonest.auth.cookie.secure`
  - `autonest.auth.cookie.same-site`

### Rate limiting

- Auth endpoints are rate limited to reduce brute-force attempts (where configured).
- Typical scope: `POST /api/auth/login` and `POST /api/auth/register` (IP-based).

### Threat model (light)

- **XSS**: avoid storing access tokens in localStorage; sanitize/escape user input in UI.
- **CSRF**: cookie-based refresh endpoints are CSRF-relevant; rely on strict SameSite + CORS, upgradeable to CSRF tokens if needed.
- **IDOR**: protect admin-only mutations via RBAC; validate ownership rules if multi-seller is introduced.

### Key evidence

- `autonest-api/src/main/java/com/autonest/config/SecurityConfig.java`
- `autonest-api/src/main/java/com/autonest/controller/AuthController.java`
- `autonest-ui/src/app/core/auth/auth.service.ts`
- `autonest-ui/src/app/core/guards/*`

