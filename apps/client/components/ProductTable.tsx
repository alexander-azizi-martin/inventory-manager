import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  LinearProgress,
} from '@mui/material';
import { useRouter } from 'next/router';

import type { Product } from '~/types';

interface ProductTableProps {
  products: Product[] | undefined;
}

const ProductTable = ({ products }: ProductTableProps) => {
  const router = useRouter();

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="w-[24%]">Product</TableCell>
            <TableCell align="center" className="w-[19%]">
              Status
            </TableCell>
            <TableCell align="center" className="w-[19%]">
              Inventory
            </TableCell>
            <TableCell align="center" className="w-[19%]">
              Type
            </TableCell>
            <TableCell align="center" className="w-[19%]">
              Vendor
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products &&
            products.map((product) => (
              <TableRow
                key={product.productID}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                className="hover:cursor-pointer hover:bg-[#f9fafb]"
                onClick={() => router.push(`/products/${product.productID}`)}
              >
                <TableCell component="th" scope="row">
                  {product.title}
                </TableCell>
                <TableCell align="center">
                  <Chip label={product.status.toLowerCase()} />
                </TableCell>
                <TableCell align="center">{product.quantity}</TableCell>
                <TableCell align="center">
                  {product.ProductType.productType}
                </TableCell>
                <TableCell align="center">{product.Vendor.vendor}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {!products && (
        <div className="p-4 w-full">
          <LinearProgress className="" />
        </div>
      )}
    </TableContainer>
  );
};

export default ProductTable;
