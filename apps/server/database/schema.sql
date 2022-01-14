CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS product_tags;
DROP TABLE IF EXISTS vendors;
DROP TABLE IF EXISTS product_types;
DROP TYPE IF EXISTS product_status;

CREATE TYPE product_status AS ENUM ('ACTIVE', 'DRAFT', 'ARCHIVE');

CREATE TABLE products (
  product_id UUID NOT NULL DEFAULT uuid_generate_v4(),
  -- Product
  title VARCHAR(50) NOT NULL,
  description TEXT,
  status product_status NOT NULL DEFAULT 'ARCHIVE',
  -- Pricing
  price float NOT NULL DEFAULT 0,
  cost float,
  -- Organization
  vendor VARCHAR(50) NOT NULL,
  product_type VARCHAR(50),
  -- Inventory
  barcode TEXT,
  stock_keeping_unit TEXT,
  quantity int NOT NULL DEFAULT 0,
  -- Meta info
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (product_id)
);

CREATE TABLE tags (
  tag_id UUID NOT NULL DEFAULT uuid_generate_v4(),
  tag VARCHAR(50) UNIQUE NOT NULL,

  PRIMARY KEY (tag_id)
);

CREATE TABLE product_tags (
  product_id UUID NOT NULL,
  tag_id UUID NOT NULL,

  FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags (tag_id) ON DELETE CASCADE
);

CREATE TABLE vendors (
  vendor_id UUID NOT NULL DEFAULT uuid_generate_v4(),
  vendor VARCHAR(50) UNIQUE NOT NULL,

  PRIMARY KEY (vendor_id)
);

CREATE TABLE product_types (
  product_type_id UUID NOT NULL DEFAULT uuid_generate_v4(),
  product_type VARCHAR(50) UNIQUE NOT NULL,

  PRIMARY KEY (product_type_id)
);
