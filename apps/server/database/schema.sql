CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS "_ProductTags";
DROP TABLE IF EXISTS "Products";
DROP TABLE IF EXISTS "Tags";
DROP TABLE IF EXISTS "Vendors";
DROP TABLE IF EXISTS "ProductTypes";
DROP TABLE IF EXISTS "Filters";
DROP TYPE IF EXISTS "ProductStatus";

CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'DRAFT', 'ARCHIVE');

CREATE TABLE "Vendors" (
  "vendorID" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "vendor" VARCHAR(50) UNIQUE NOT NULL,

  PRIMARY KEY ("vendorID")
);

CREATE TABLE "ProductTypes" (
  "productTypeID" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "productType" VARCHAR(50) UNIQUE NOT NULL,

  PRIMARY KEY ("productTypeID")
);

CREATE TABLE "Products" (
  "productID" UUID NOT NULL DEFAULT uuid_generate_v4(),
  -- Product
  "title" VARCHAR(50) NOT NULL,
  "description" TEXT,
  "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
  -- Pricing
  "price" float NOT NULL DEFAULT 0,
  "cost" float,
  -- Organization
  "vendorID" UUID NOT NULL,
  "productTypeID" UUID NOT NULL,
  -- Inventory
  "barcode" TEXT,
  "stockKeepingUnit" TEXT,
  "quantity" int NOT NULL DEFAULT 0,
  -- Meta info
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY ("productID"),
  FOREIGN KEY ("vendorID") REFERENCES "Vendors" ("vendorID") ON DELETE CASCADE,
  FOREIGN KEY ("productTypeID") REFERENCES "ProductTypes" ("productTypeID") ON DELETE CASCADE
);

CREATE TABLE "Tags" (
  "tagID" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "tag" VARCHAR(50) UNIQUE NOT NULL,

  PRIMARY KEY ("tagID")
);

CREATE TABLE "_ProductTags" (
  "A" UUID NOT NULL,
  "B" UUID NOT NULL,

  FOREIGN KEY ("A") REFERENCES "Products" ("productID") ON DELETE CASCADE,
  FOREIGN KEY ("B") REFERENCES "Tags" ("tagID") ON DELETE CASCADE
);

CREATE TABLE "Filters" (
  "filterID" UUID NOT NULL DEFAULT uuid_generate_v4(),

  "title" VARCHAR(50),
  "status" "ProductStatus", 
  "productType" VARCHAR(50),
  "vendor" VARCHAR(50),
  "tag" VARCHAR(50),

  PRIMARY KEY ("filterID")
);
