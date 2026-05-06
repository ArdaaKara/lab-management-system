-- =============================================================
-- V1__init_schema.sql
-- Computer Lab Management System — Initial Schema
-- MySQL 8.0+ (InnoDB) | Flyway versioned migration
-- =============================================================
-- ⚠️  CHARSET NOTU:
--     Tüm tablolar utf8mb4 + utf8mb4_unicode_ci kullanır.
--     Bu ayar MySQL server seviyesinde de yapılmalıdır:
--     my.cnf → character-set-server=utf8mb4
--               collation-server=utf8mb4_unicode_ci
-- =============================================================

-- ── users ──────────────────────────────────────────────────────
CREATE TABLE users (
    id            CHAR(36)     NOT NULL DEFAULT (UUID()),
    full_name     VARCHAR(120) NOT NULL,
    email         VARCHAR(254) NOT NULL COLLATE utf8mb4_unicode_ci,
    password_hash VARCHAR(255) NOT NULL,
    is_active     TINYINT(1)   NOT NULL DEFAULT 1,
    created_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                               ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── roles ──────────────────────────────────────────────────────
CREATE TABLE roles (
    id   TINYINT     NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── user_roles (join) ──────────────────────────────────────────
CREATE TABLE user_roles (
    user_id CHAR(36) NOT NULL,
    role_id TINYINT  NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id)
        REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── labs ───────────────────────────────────────────────────────
CREATE TABLE labs (
    id          CHAR(36)     NOT NULL DEFAULT (UUID()),
    name        VARCHAR(100) NOT NULL,
    room_number VARCHAR(20)  NOT NULL,
    max_rows    TINYINT      NOT NULL,
    max_cols    TINYINT      NOT NULL,
    lab_api_key VARCHAR(64)  NOT NULL,
    created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uq_labs_api_key (lab_api_key),
    CONSTRAINT chk_labs_rows CHECK (max_rows BETWEEN 1 AND 20),
    CONSTRAINT chk_labs_cols CHECK (max_cols BETWEEN 1 AND 20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── lab_assignments ────────────────────────────────────────────
CREATE TABLE lab_assignments (
    id          CHAR(36)    NOT NULL DEFAULT (UUID()),
    user_id     CHAR(36)    NOT NULL,
    lab_id      CHAR(36)    NOT NULL,
    assigned_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uq_lab_assign (user_id, lab_id),
    CONSTRAINT fk_la_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_la_lab  FOREIGN KEY (lab_id)
        REFERENCES labs(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── computers ──────────────────────────────────────────────────
-- ⚠️  MySQL'de PARTIAL INDEX yoktur.
--     NULL grid_row/grid_col olan (yerleştirilmemiş) PC'ler için
--     UNIQUE(lab_id, grid_row, grid_col) kısıtı bypass edilir:
--     MySQL'de NULL != NULL olduğundan birden fazla
--     (lab_id, NULL, NULL) satırı kısıtı ihlal etmez.
--     Bu davranış lehimizedir. Yerleştirilmiş PC'lerde çakışma
--     kontrolü uygulama katmanına (ComputerService) bırakılmıştır.
CREATE TABLE computers (
    id             CHAR(36)    NOT NULL DEFAULT (UUID()),
    lab_id         CHAR(36)    NOT NULL,
    asset_tag      VARCHAR(50) NOT NULL,
    hostname       VARCHAR(100),
    mac_address    VARCHAR(17) NOT NULL,
    ip_address     VARCHAR(45),
    grid_row       TINYINT     NULL,
    grid_col       TINYINT     NULL,
    status         ENUM('ACTIVE','FAULTY','UNDER_REPAIR','DECOMMISSIONED')
                               NOT NULL DEFAULT 'ACTIVE',
    hardware_specs JSON        NOT NULL DEFAULT ('{}'),
    is_active      TINYINT(1)  NOT NULL DEFAULT 1,
    last_seen_at   DATETIME(6),
    created_at     DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at     DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                               ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uq_computers_asset_tag (asset_tag),
    UNIQUE KEY uq_computers_mac       (mac_address),
    UNIQUE KEY uq_computers_grid      (lab_id, grid_row, grid_col),
    CONSTRAINT fk_comp_lab FOREIGN KEY (lab_id)
        REFERENCES labs(id) ON DELETE RESTRICT,
    CONSTRAINT chk_comp_mac CHECK (
        mac_address REGEXP '^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$'
    ),
    CONSTRAINT chk_comp_grid_row CHECK (grid_row IS NULL OR grid_row >= 0),
    CONSTRAINT chk_comp_grid_col CHECK (grid_col IS NULL OR grid_col >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── issues ─────────────────────────────────────────────────────
CREATE TABLE issues (
    id                     CHAR(36)    NOT NULL DEFAULT (UUID()),
    computer_id            CHAR(36)    NOT NULL,
    category               ENUM('NO_DISPLAY','NO_INTERNET','NO_POWER',
                                'SLOW_PERFORMANCE','PERIPHERAL_FAILURE',
                                'OS_ERROR','OTHER') NOT NULL,
    description            TEXT,
    student_id_reporter    VARCHAR(20) NOT NULL,
    reporter_ip            VARCHAR(45),
    status                 ENUM('OPEN','IN_PROGRESS','PENDING_APPROVAL',
                                'RESOLVED','REJECTED') NOT NULL DEFAULT 'OPEN',
    assigned_technician_id CHAR(36)    NULL,
    created_at             DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at             DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                                       ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_issue_computer   FOREIGN KEY (computer_id)
        REFERENCES computers(id) ON DELETE RESTRICT,
    CONSTRAINT fk_issue_technician FOREIGN KEY (assigned_technician_id)
        REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_student_id CHECK (
        student_id_reporter REGEXP '^[0-9]{6,}$'
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── issue_history (audit trail — immutable) ────────────────────
CREATE TABLE issue_history (
    id                 CHAR(36)    NOT NULL DEFAULT (UUID()),
    issue_id           CHAR(36)    NOT NULL,
    changed_by_user_id CHAR(36)    NULL,
    old_status         ENUM('OPEN','IN_PROGRESS','PENDING_APPROVAL','RESOLVED','REJECTED'),
    new_status         ENUM('OPEN','IN_PROGRESS','PENDING_APPROVAL','RESOLVED','REJECTED')
                                   NOT NULL,
    note               TEXT,
    changed_at         DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_ih_issue FOREIGN KEY (issue_id)
        REFERENCES issues(id) ON DELETE RESTRICT,
    CONSTRAINT fk_ih_user  FOREIGN KEY (changed_by_user_id)
        REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── refresh_tokens ─────────────────────────────────────────────
CREATE TABLE refresh_tokens (
    id         CHAR(36)    NOT NULL DEFAULT (UUID()),
    token_hash VARCHAR(64) NOT NULL,
    user_id    CHAR(36)    NOT NULL,
    expires_at DATETIME(6) NOT NULL,
    revoked    TINYINT(1)  NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_rt_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- Indexes
-- =============================================================

CREATE INDEX idx_users_is_active      ON users(is_active);
CREATE INDEX idx_lab_assign_user      ON lab_assignments(user_id);
CREATE INDEX idx_lab_assign_lab       ON lab_assignments(lab_id);
CREATE INDEX idx_computers_lab        ON computers(lab_id);
CREATE INDEX idx_computers_status     ON computers(status);
CREATE INDEX idx_computers_is_active  ON computers(is_active);
CREATE INDEX idx_issues_computer      ON issues(computer_id);
CREATE INDEX idx_issues_status        ON issues(status);
CREATE INDEX idx_issues_technician    ON issues(assigned_technician_id);
CREATE INDEX idx_issues_created_at    ON issues(created_at DESC);
CREATE INDEX idx_issue_history_issue  ON issue_history(issue_id);
CREATE INDEX idx_issue_history_time   ON issue_history(changed_at DESC);
CREATE INDEX idx_refresh_token_hash   ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_token_user   ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_token_active ON refresh_tokens(expires_at, revoked);

-- =============================================================
-- ⚠️  updated_at trigger'ı gerekmez:
--     ON UPDATE CURRENT_TIMESTAMP(6) tanımları zaten
--     her UPDATE'te sütunu otomatik günceller.
-- =============================================================
