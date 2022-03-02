import type { Product, ProductForm } from '~/types';

type ParseProductType = (product: Product) => ProductForm;

export const parseProduct: ParseProductType = (product) => {
  const parsedProduct: ProductForm = {} as ProductForm;

  for (let key in product) {
    if (key == 'Vendor') {
      parsedProduct['vendor'] = product.Vendor.vendor;
    } else if (key == 'ProductType') {
      parsedProduct['productType'] = product.ProductType.productType;
    } else if (key == 'Tags') {
      parsedProduct['tags'] = product.Tags.map(({ tag }) => tag);
    } else if (
      key != 'userID' &&
      key != 'productID' &&
      key != 'vendorID' &&
      key != 'productTypeID' &&
      key != 'createdAt' &&
      key != 'updatedAt'
    ) {
      if (product[key] == null) {
        parsedProduct[key] = '';
      } else {
        parsedProduct[key] = product[key];
      }
    }
  }

  return parsedProduct;
};
