import type { NextPage } from 'next';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import type { Product } from '~/types';
import api from '~/utils/api';

const Home: NextPage = () => {
  const router = useRouter();

  const { data, error } = useSWR<Product[]>('/api/products', api.getProducts);

  return (
    <div className="px-8 py-4">
      <header className="flex justify-between items-center">
        <Typography variant="h4" gutterBottom component="h4" className="m-0">
          Products
        </Typography>

        <div className="h-8 flex gap-x-4">
          <Button
            size="small"
            onClick={() => {
              window.open(`${api.baseURL}/api/products/export`);
            }}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => router.push(`/products/new`)}
          >
            New Product
          </Button>
        </div>
      </header>

      <main className="my-4 card">
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
              {data &&
                data.map((product) => (
                  <TableRow
                    key={product.productID}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    className="hover:cursor-pointer hover:bg-[#f9fafb]"
                    onClick={() =>
                      router.push(`/products/${product.productID}`)
                    }
                  >
                    <TableCell component="th" scope="row">
                      {product.title}
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={product.status.toLowerCase()} />
                    </TableCell>
                    <TableCell align="center">{product.quantity}</TableCell>
                    <TableCell align="center">
                      {product.productType.productType}
                    </TableCell>
                    <TableCell align="center">
                      {product.vendor.vendor}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {!data && (
            <div className="p-4 w-full">
              <LinearProgress className="" />
            </div>
          )}
        </TableContainer>
      </main>
    </div>
  );
};

export default Home;
