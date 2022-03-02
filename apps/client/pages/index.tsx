import type { NextPage } from 'next';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import Header from '~/components/Header';
import ProductTable from '~/components/ProductTable';

import type { Product } from '~/types';
import { api, apiURL, useRequest } from '~/utils/api';

const Home: NextPage = () => {
  const { data } = useSWR<Product[]>(
    '/api/products',
    useRequest(() => api.get('/api/products')),
  );

  return (
    <div className="px-8 py-4">
      <Header />

      <main className="my-4 card">
        <ProductTable products={data} />
      </main>
    </div>
  );
};

export default Home;
