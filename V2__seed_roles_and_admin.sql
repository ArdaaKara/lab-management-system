-- =============================================================
-- V2__seed_roles_and_admin.sql
-- Seed: rol tanımları + ilk ADMIN kullanıcısı
-- MySQL 8.0+ | Flyway versioned migration
-- =============================================================
-- ⚠️  Admin şifresi: ChangeMe!2024  (BCrypt cost=12)
--     Production'da ilk girişten sonra mutlaka değiştir.
-- =============================================================

-- ── Roller ────────────────────────────────────────────────────
INSERT IGNORE INTO roles (name) VALUES
    ('ADMIN'),
    ('TEACHER'),
    ('TECHNICIAN');

-- ── İlk Admin Kullanıcısı ──────────────────────────────────────
INSERT IGNORE INTO users (id, full_name, email, password_hash, is_active)
VALUES (
    UUID(),
    'System Administrator',
    'admin@lab.local',
    '$2a$12$pFSa3G0tLpHtsMfJV3cAaOO7Lv3.6Vw5QajvpO2BvWJhX3qXOSXMK',
    1
);

-- ── Admin rolünü ata ──────────────────────────────────────────
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM   users u
JOIN   roles r ON r.name = 'ADMIN'
WHERE  u.email = 'admin@lab.local';

-- =============================================================
-- Opsiyonel: Demo verisi (sadece dev ortamı için)
-- Production'da bu bloğu sil veya ayrı V3__seed_demo.sql yap.
-- =============================================================

-- Demo Lab
INSERT IGNORE INTO labs (id, name, room_number, max_rows, max_cols, lab_api_key)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Bilgisayar Lab 1',
    'A101',
    5,
    8,
    'dev-api-key-lab1-do-not-use-in-production-000000000001'
);

-- Demo Teacher — Şifre: Teacher!2024 (BCrypt cost=12)
INSERT IGNORE INTO users (id, full_name, email, password_hash, is_active)
VALUES (UUID(), 'Demo Öğretmen', 'teacher@lab.local',
        '$2a$12$XGtlwbG0V0HvRidLPHRajeHuT6wgqORtGJ4eQSEHzRBMNz9sNvK2q', 1);

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u JOIN roles r ON r.name = 'TEACHER'
WHERE u.email = 'teacher@lab.local';

-- Demo Technician — Şifre: Tech!2024 (BCrypt cost=12)
INSERT IGNORE INTO users (id, full_name, email, password_hash, is_active)
VALUES (UUID(), 'Demo Teknisyen', 'tech@lab.local',
        '$2a$12$8TJdOkwwpODrMhf1q9PJaO5bV1OT3X6VhCxnrAV4vDgKJ7tNvKe5m', 1);

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u JOIN roles r ON r.name = 'TECHNICIAN'
WHERE u.email = 'tech@lab.local';

-- Atamalar (teacher + tech → Lab 1)
INSERT IGNORE INTO lab_assignments (user_id, lab_id)
SELECT u.id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
FROM   users u
WHERE  u.email IN ('teacher@lab.local', 'tech@lab.local');
