export interface ProductID {
  productID: string;
}

export interface TagID {
  tagID: string;
}

export interface ProductTypeID {
  productTypeID: string;
}

export interface VendorID {
  vendorID: string;
}

export interface FilterID {
  filterID: string;
}

export interface ProductRequest {
  title: string;
  description: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVE';
  price: number;
  cost: number;
  vendor: string;
  productType: string;
  barcode: string;
  stockKeepingUnit: string;
  quantity: number;
  tags: string[];
}

export interface TagRequest {
  tag: string;
}

export interface VendorRequest {
  vendor: string;
}

export interface ProductTypeRequest {
  productType: string;
}

export interface FilterRequest {
  title?: string;
  status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVE';
  productType?: string;
  vendor?: string;
  tag?: string;
}

export interface Error {
  error: string;
  message: string;
  statusCode: string;
}

export interface Params {
  [key: string]: string;
}

export interface AuthenticateOptions {
  validateExpiry?: boolean;
  requireToken?: boolean;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
}

export interface AccessToken {
  sub: string;
  iat: number;
  exp: number;
}

export interface RefreshToken {
  refreshToken: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface Username {
  username: string;
}
