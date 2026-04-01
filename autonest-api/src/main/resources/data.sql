-- Older MySQL volumes may lack seller contact columns; add them before seed INSERTs that reference them.
SET @exists_phone := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'car_listings' AND COLUMN_NAME = 'contact_phone');
SET @stmt_phone := IF(@exists_phone = 0, 'ALTER TABLE car_listings ADD COLUMN contact_phone VARCHAR(32) NULL', 'SELECT 1');
PREPARE autonest_add_contact_phone FROM @stmt_phone;
EXECUTE autonest_add_contact_phone;
DEALLOCATE PREPARE autonest_add_contact_phone;

SET @exists_email := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'car_listings' AND COLUMN_NAME = 'contact_email');
SET @stmt_email := IF(@exists_email = 0, 'ALTER TABLE car_listings ADD COLUMN contact_email VARCHAR(255) NULL', 'SELECT 1');
PREPARE autonest_add_contact_email FROM @stmt_email;
EXECUTE autonest_add_contact_email;
DEALLOCATE PREPARE autonest_add_contact_email;

-- Users (idempotent seed via primary key + unique constraints)
INSERT INTO users (id, username, email, password_hash, role, is_active, created_at)
VALUES
  (1, 'admin', 'admin@autonest.com', '$2y$10$6j8jQp4VNvDlBzp4Jhyjf.R4BEL..GygSbRvWsToB4r7UHP.thFhy', 'ADMIN', true, NOW()),
  (2, 'buyer', 'buyer@autonest.com', '$2y$10$4ecScmlNIO1i6d/jocAMs.2yRWKOdp3jPMJWPSNtWMNof8Bs.AuCa', 'BUYER', true, NOW())
ON DUPLICATE KEY UPDATE
  username = VALUES(username),
  email = VALUES(email),
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  is_active = VALUES(is_active);

-- Sample car listings
INSERT INTO car_listings (
  id, created_by_user_id, title, brand, model, year, mileage, fuel_type, transmission,
  base_price, additional_charges, discount_amount, negotiable, location, contact_phone, contact_email, description,
  status, deleted_at, created_at, updated_at
)
VALUES
  (1001, 1, 'Toyota Corolla 2020', 'Toyota', 'Corolla', 2020, 45000, 'PETROL', 'AUTOMATIC',
   18500.00, 500.00, 0.00, true, 'Dubai', '+971501112233', 'corolla.seller@example.com', 'Well maintained, single owner.', 'AVAILABLE', NULL, NOW(), NOW()),
  (1002, 1, 'Tesla Model 3 2021', 'Tesla', 'Model 3', 2021, 22000, 'ELECTRIC', 'AUTOMATIC',
   42000.00, 0.00, 1500.00, false, 'Abu Dhabi', '+971502445566', 'tesla.model3@example.com', 'Long range, excellent condition.', 'AVAILABLE', NULL, NOW(), NOW()),
  (1003, 1, 'Honda Civic 2018', 'Honda', 'Civic', 2018, 60000, 'PETROL', 'MANUAL',
   16000.00, 350.00, 0.00, true, 'Sharjah', '+971503778899', 'civic.uae@example.com', 'Sporty drive, service history available.', 'RESERVED', NULL, NOW(), NOW()),
  (1004, 1, 'Ford Mustang GT 2022', 'Ford', 'Mustang', 2022, 92000, 'PETROL', 'AUTOMATIC',
   95000.00, 0.00, 0.00, false, 'Dubai', '+971501112200', 'mustang.seller@example.com', 'Low mileage, garage kept.', 'AVAILABLE', NULL, NOW(), NOW()),
  (1005, 1, 'Nissan Patrol 2023', 'Nissan', 'Patrol', 2023, 128000, 'PETROL', 'AUTOMATIC',
   198000.00, 1500.00, 0.00, true, 'Dubai', '+971504331100', 'patrol.nissan@example.com', 'Full option, desert-ready, agency service history.', 'AVAILABLE', NULL, NOW(), NOW()),
  (1006, 1, 'Mercedes-AMG G63 2022', 'Mercedes-Benz', 'G-Class G63', 2022, 240000, 'PETROL', 'AUTOMATIC',
   685000.00, 0.00, 25000.00, false, 'Abu Dhabi', '+971505992211', 'g63.amg@example.com', 'AMG Night package, low mileage, showroom condition.', 'AVAILABLE', NULL, NOW(), NOW()),
  (1007, 1, 'BMW M5 2020', 'BMW', 'M5 Competition', 2020, 132000, 'PETROL', 'AUTOMATIC',
   245000.00, 800.00, 0.00, true, 'Dubai', '+971506114433', 'm5.bmw@example.com', 'V8 twin-turbo, carbon trim, full BMW service records.', 'AVAILABLE', NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  brand = VALUES(brand),
  model = VALUES(model),
  year = VALUES(year),
  mileage = VALUES(mileage),
  fuel_type = VALUES(fuel_type),
  transmission = VALUES(transmission),
  base_price = VALUES(base_price),
  additional_charges = VALUES(additional_charges),
  discount_amount = VALUES(discount_amount),
  negotiable = VALUES(negotiable),
  location = VALUES(location),
  contact_phone = VALUES(contact_phone),
  contact_email = VALUES(contact_email),
  description = VALUES(description),
  status = VALUES(status),
  updated_at = NOW();

-- Seed images (1 primary per listing)
-- Idempotent: delete previous seeded rows, then insert/update.
DELETE FROM car_images WHERE id IN (2001, 2002, 2003, 2004, 2005, 2006, 2007);
INSERT INTO car_images (id, car_id, image_url, is_primary, sort_order, uploaded_at)
VALUES
  (2001, 1001, 'https://dealer26407.dealeron.com/blogs/6087/wp-content/uploads/2024/10/2020-Toyota-Corolla.jpg', true, 1, NOW()),
  (2002, 1002, 'https://media-r2.carsandbids.com/cdn-cgi/image/width=2080,quality=70/7a0a3c6148108c9c64425dd85e0181fa3cccb652/photos/9n4RR4bD-bhCVf-pk4c-(edit).jpg?t=170721671657', true, 1, NOW()),
  (2003, 1003, 'https://media.autoexpress.co.uk/image/private/s--X-WVjvBW--/f_auto,t_content-image-full-desktop@1/v1579703255/autoexpress/2018/03/dsc_0824.jpg', true, 1, NOW()),
  (2004, 1004, 'https://img.philkotse.com/2024/12/05/DN77gTEr/img-1968-2-copy-079f_wm.webp', true, 1, NOW()),
  (2005, 1005, 'https://www.autodeal.com.ph/custom/blog-post/header/i-finally-understand-why-the-nissan-patrol-is-number-1-in-the-deserts-of-dubai-66f35555be66f.jpeg', true, 1, NOW()),
  (2006, 1006, 'https://veluxrentals.com/wp-content/uploads/2024/09/IMG_9224.jpg', true, 1, NOW()),
  (2007, 1007, 'https://www.exoticshunter.com/imagetag/233/main/l/Used-2019-BMW-M5-Competition-VERY-RARE-Rosso-Corsa-Executive-Pack-+-Carbon-Upgrades!-1691604883.jpg', true, 1, NOW())
ON DUPLICATE KEY UPDATE
  car_id = VALUES(car_id),
  image_url = VALUES(image_url),
  is_primary = VALUES(is_primary),
  sort_order = VALUES(sort_order);



