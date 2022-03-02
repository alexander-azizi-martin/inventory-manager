import { Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

import UserDropdown from '~/components/Dropdowns/UserDropdown';
import { api, useRequest, apiURL } from '~/utils/api';

const Header = () => {
  const router = useRouter();
  const exportProducts = useRequest(() => api.get('/api/products/export'));

  const handleExport = async () => {
    const data = await exportProducts();

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([data]));
    link.setAttribute('download', 'export.csv');
    link.click();
  };

  return (
    <header className="flex justify-between items-center">
      <Typography variant="h4" gutterBottom component="h4" className="m-0">
        Products
      </Typography>

      <div className="h-8 flex gap-x-4">
        <Button size="small" onClick={handleExport}>
          Export
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => router.push(`/products/new`)}
        >
          New Product
        </Button>
        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;
