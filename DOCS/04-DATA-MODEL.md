## Data Model

This project uses MySQL with JPA/Hibernate. Listings support multiple images and soft delete.

### ASCII schema diagram

```text
users
  - id (PK)
  - username (unique)
  - email (unique)
  - password_hash
  - role [ADMIN|BUYER]
  - is_active
  - created_at

car_listings
  - id (PK)
  - created_by_user_id (FK -> users.id)
  - title
  - brand
  - model
  - year
  - mileage
  - fuel_type
  - transmission
  - base_price
  - additional_charges
  - discount_amount
  - negotiable
  - location
  - contact_phone
  - contact_email
  - description
  - status [AVAILABLE|RESERVED|SOLD]
  - deleted_at (NULL = active)   <-- soft delete
  - created_at
  - updated_at

car_images
  - id (PK)
  - car_id (FK -> car_listings.id)
  - image_url
  - is_primary
  - sort_order
  - uploaded_at
```

### Soft delete behavior

- Public listing/search endpoints should **not** return soft-deleted listings.
- Admin listing screens can include soft-deleted entries for auditing/restore workflows (if implemented).

### Indexing strategy (typical)

- `car_listings.brand` indexed (brand filter)
- `car_images.car_id` indexed (image lookup per listing)

### Seed data

- Seed scripts live in `autonest-api/src/main/resources/data.sql`.

