# API

The structure of the body of the requests can found in `apps/server/schemas`.

| Method | Endpoint                         | Description                                          |
| ------ | -------------------------------- | ---------------------------------------------------- |
| GET    | /products                        | Returns all products.                                |
| POST   | /products                        | Created a new product.                               |
| GET    | /products/:productID             | Returns product with given ID.                       |
| PUT    | /products/:productID             | Replaces product with given ID.                      |
| DELETE | /products/:productID             | Deletes product with given ID.                       |
| GET    | /products/tags                   | Returns all tags.                                    |
| GET    | /products/:productID/tags        | Returns all tags for the product with given ID.      |
| POST   | /products/:productID/tags        | Creates a new tag for the given product.             |
| DELETE | /products/:productID/tags/:tagID | Deletes the tag from product with given IDs.         |
| GET    | /vendors                         | Returns all vendors.                                 |
| POST   | /vendors                         | Creates a new vendor.                                |
| PUT    | /vendors/:vendorID               | Replaces the vendor with given ID.                   |
| DELETE | /vendors/:vendorID               | Deletes the vendor with given ID.                    |
| GET    | /product-types                   | Returns all product types.                           |
| POST   | /product-types                   | Creates new product type.                            |
| PUT    | /product-types/:productTypeID    | Replaces vendor with given ID.                       |
| DELETE | /product-types/:productTypeID    | Deletes vendor with given ID.                        |
| GET    | /filters                         | Returns all filters.                                 |
| POST   | /filters/query/products          | Returns filtered products with given filter.         |
| POST   | /filters                         | Creates new filter.                                  |
| GET    | /filters/:filterID               | Returns filter with given ID.                        |
| GET    | /filters/:filterID/products      | Returns filtered products with filter with given ID. |
| PUT    | /filters/:filterID               | Replaces filter with given ID.                       |
| DELETE | /filters/:filterID               | Deletes filter with given ID.                        |
