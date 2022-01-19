export interface Product {
  [state: string]: any;
  title: string;
  description: string | null;
  status: string;
  price: number;
  cost: number | null;
  vendorID: string;
  productTypeID: string;
  barcode: string | null;
  stockKeepingUnit: string | null;
  quantity: number;
  tags: Tag[];
  vendor: Vendor;
  productType: ProductType;
}

export interface ProductType {
  productTypeID: string;
  productType: string;
}

export interface Tag {
  tagID: string;
  tag: string;
}

export interface Vendor {
  vendorID: string;
  vendor: string;
}

export interface ProductForm {
  [state: string]: any;
  title: string;
  description: string;
  price: number;
  cost: number;
  stockKeepingUnit: string;
  barcode: string;
  quantity: number;
  status: 'DRAFT' | 'ARCHIVED' | 'ACTIVE';
  vendor: string;
  productType: string;
  tags: string[];
}
