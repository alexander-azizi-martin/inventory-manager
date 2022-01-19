import type { Product, ProductForm } from '~/types';

type ParseProductType = (product: Product) => ProductForm;

export const parseProduct: ParseProductType = (product) => {
  const parsedProduct: ProductForm = {} as ProductForm;

  for (let key in product) {
    if (key == 'vendor') {
      parsedProduct[key] = product.vendor.vendor;
    } else if (key == 'productType') {
      parsedProduct[key] = product.productType.productType;
    } else if (key == 'tags') {
      parsedProduct[key] = product.tags.map(({ tag }) => tag);
    } else if (
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
