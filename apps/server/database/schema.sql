CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS "Sessions";
DROP TABLE IF EXISTS "Users";
DROP TABLE IF EXISTS "_ProductTags";
DROP TABLE IF EXISTS "Products";
DROP TABLE IF EXISTS "Tags";
DROP TABLE IF EXISTS "Vendors";
DROP TABLE IF EXISTS "ProductTypes";
DROP TABLE IF EXISTS "Filters";
DROP TYPE IF EXISTS "ProductStatus";

CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'DRAFT', 'ARCHIVE');

CREATE TABLE "Users" (
  "userID" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "username" VARCHAR(20) UNIQUE NOT NULL,
  "password" CHAR(60) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("userID")
);

CREATE TABLE "Sessions" (
  "userID" UUID NOT NULL,
  "refreshToken" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "expiration" TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '1 year'),
  PRIMARY KEY ("refreshToken"),
  FOREIGN KEY ("userID") REFERENCES "Users" ("userID") ON DELETE CASCADE
);

CREATE TABLE "Vendors" (
  "userID" UUID NOT NULL,
  "vendorID" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "vendor" VARCHAR(50) NOT NULL,
  UNIQUE ("userID", "vendor"),
  PRIMARY KEY ("vendorID"),
  FOREIGN KEY ("userID") REFERENCES "Users" ("userID") ON DELETE CASCADE
);

CREATE TABLE "ProductTypes" (
  "userID" UUID NOT NULL,
  "productTypeID" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "productType" VARCHAR(50) NOT NULL,
  UNIQUE ("userID", "productType"),
  PRIMARY KEY ("productTypeID"),
  FOREIGN KEY ("userID") REFERENCES "Users" ("userID") ON DELETE CASCADE
);

CREATE TABLE "Products" (
  "userID" UUID NOT NULL,
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
  FOREIGN KEY ("productTypeID") REFERENCES "ProductTypes" ("productTypeID") ON DELETE CASCADE,
  FOREIGN KEY ("userID") REFERENCES "Users" ("userID") ON DELETE CASCADE
);

CREATE TABLE "Tags" (
  "userID" UUID NOT NULL,
  "tagID" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "tag" VARCHAR(50) NOT NULL,
  UNIQUE ("userID", "tag"),
  PRIMARY KEY ("tagID"),
  FOREIGN KEY ("userID") REFERENCES "Users" ("userID") ON DELETE CASCADE
);

CREATE TABLE "_ProductTags" (
  "A" UUID NOT NULL,
  "B" UUID NOT NULL,
  FOREIGN KEY ("A") REFERENCES "Products" ("productID") ON DELETE CASCADE,
  FOREIGN KEY ("B") REFERENCES "Tags" ("tagID") ON DELETE CASCADE
);

CREATE TABLE "Filters" (
  "userID" UUID NOT NULL,
  "filterID" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "title" VARCHAR(50),
  "status" "ProductStatus", 
  "productType" VARCHAR(50),
  "vendor" VARCHAR(50),
  "tag" VARCHAR(50),
  PRIMARY KEY ("filterID"),
  FOREIGN KEY ("userID") REFERENCES "Users" ("userID") ON DELETE CASCADE
);
