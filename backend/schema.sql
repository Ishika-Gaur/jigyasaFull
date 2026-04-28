-- ============================================================
-- schema.sql — Run ONCE
-- psql -U postgres -d jigyasa_Clinic -f schema.sql
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── ADMINS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       VARCHAR(50)  NOT NULL DEFAULT 'admin'
               CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── BLOGS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blogs (
  id                 SERIAL PRIMARY KEY,
  title              VARCHAR(500) NOT NULL,
  slug               VARCHAR(600) NOT NULL UNIQUE,
  author             VARCHAR(255) NOT NULL DEFAULT '',
  category           VARCHAR(100) NOT NULL DEFAULT 'Uncategorized',
  excerpt            TEXT         NOT NULL DEFAULT '',
  content            TEXT         NOT NULL DEFAULT '',
  status             VARCHAR(20)  NOT NULL DEFAULT 'published'
                       CHECK (status IN ('draft', 'published')),
  cover_data         BYTEA,
  cover_content_type VARCHAR(50),
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── GALLERY ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            VARCHAR(200) NOT NULL,
  slug             VARCHAR(220) NOT NULL UNIQUE,
  badge            VARCHAR(100) NOT NULL,
  description      TEXT,
  images           TEXT[]       NOT NULL DEFAULT '{}',
  thumbnail_index  INT          NOT NULL DEFAULT 1,
  is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
  display_order    INT          NOT NULL DEFAULT 0,
  meta_title       VARCHAR(255),
  meta_description TEXT,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── VIDEO GALLERY ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS video_gallery (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            VARCHAR(255) NOT NULL,
  slug             VARCHAR(260) NOT NULL UNIQUE,
  category         VARCHAR(100) NOT NULL,
  description      TEXT,
  video_url        TEXT         NOT NULL,
  thumbnail_url    TEXT         NOT NULL,
  duration         VARCHAR(10),
  video_metadata   JSONB,
  is_featured      BOOLEAN      NOT NULL DEFAULT FALSE,
  is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
  display_order    INT          NOT NULL DEFAULT 0,
  meta_title       VARCHAR(255),
  meta_description TEXT,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── DOCTORS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctors (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name        VARCHAR(150) NOT NULL,
  slug             VARCHAR(160) NOT NULL UNIQUE,
  specialization   VARCHAR(120) NOT NULL,
  short_title      VARCHAR(255),
  degrees          TEXT[]       NOT NULL DEFAULT '{}',
  experience_years INT          CHECK (experience_years >= 0),
  about            TEXT,
  images           TEXT[],
  consultation     JSONB,
  conditions       JSONB,
  is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
  meta_title       VARCHAR(255),
  meta_description TEXT,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── AUTO updated_at TRIGGER ───────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS admins_updated_at        ON admins;
CREATE TRIGGER admins_updated_at
  BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS blogs_updated_at         ON blogs;
CREATE TRIGGER blogs_updated_at
  BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS gallery_updated_at       ON gallery;
CREATE TRIGGER gallery_updated_at
  BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS video_gallery_updated_at ON video_gallery;
CREATE TRIGGER video_gallery_updated_at
  BEFORE UPDATE ON video_gallery FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS doctors_updated_at       ON doctors;
CREATE TRIGGER doctors_updated_at
  BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION set_updated_at();