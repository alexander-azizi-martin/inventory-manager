import type { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { ArrowLeft } from 'react-feather';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import deepEqual from 'deep-equal';

import type { Product, ProductForm } from '~/types';
import { parseProduct } from '~/utils/helpers';
import { api, useRequest } from '~/utils/api';
import useAlert from '~/utils/useAlert';
import CollectionDropdown from '~/components/Dropdowns/CollectionDropdown';
import TagDropdown from '~/components/Dropdowns/TagDropdown';

const initialProductData: ProductForm = {
  title: '',
  description: '',
  price: 0,
  cost: 0,
  stockKeepingUnit: '',
  barcode: '',
  quantity: 0,
  status: 'DRAFT',
  vendor: '',
  productType: '',
  tags: [],
};

interface ProductEditorProps {
  productID: string;
}

const ProductEditor = ({ productID }: ProductEditorProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(productID != 'new');
  const [productData, setProductData] = useState(initialProductData);
  const [productFormData, setProductFormData] = useState(initialProductData);
  const [error, setError] = useAlert();

  useEffect(() => {
    const fetchData = async () => {      
      try {
        const data = await useRequest(() => api.get(`/api/products/${productID}`))();
        const parsedProduct = parseProduct(data);

        setLoading(false);
        setProductData(parsedProduct);
        setProductFormData(parsedProduct);
      } catch {}
    };

    if (productID !== 'new') {
      fetchData();
    }
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);

      if (productID == 'new') {
        await useRequest(() => api.post('/api/products', productFormData))();
      } else {
        await useRequest(() => api.put(`/api/products/${productID}`, productFormData))();
      }

      router.push('/');
    } catch (error: any) {
      setLoading(false);
      setError(error?.response?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async () => {
    try {
      let confirmation = confirm('Do you want to delete this product?');

      if (confirmation) {
        setLoading(true);

        await useRequest(() => api.delete(`/api/products/${productID}`))();

        router.push('/');
      }
    } catch (error: any) {
      setLoading(false);
      setError(error?.response?.data?.message || 'An error occurred');
    }
  };

  const handleChange = (property: string) => (event: ChangeEvent) => {
    setProductFormData({
      ...productFormData,
      [property]: (event.target as HTMLInputElement).value,
    });
  };

  let profit: number | null = null;
  let margin: string | null = null;
  if (productFormData.price && productFormData.cost) {
    profit = productFormData.price - productFormData.cost;
    margin = ((profit / productFormData.price) * 100).toFixed(2);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center w-[100vw] h-[100vh]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="px-8 py-4 flex flex-col items-center">
      {error && (
        <Alert
          severity="error"
          onClose={() => {
            setError('');
          }}
          className="fixed bottom-8"
        >
          {error}
        </Alert>
      )}
      <div className="max-w-[800px]">
        <header className="flex justify-between items-center h-full">
          <div className="flex gap-x-4 items-center">
            <div
              className="border border-black p-1 rounded hover:cursor-pointer"
              onClick={() => router.push('/')}
            >
              <ArrowLeft />
            </div>
            <Typography
              variant="h5"
              gutterBottom
              component="h5"
              className="m-0"
            >
              {productID == 'new' ? 'Add Product' : productData.title}
            </Typography>
          </div>

          <div className="h-8 flex gap-x-4">
            {productID != 'new' && (
              <Button size="small" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <Button
              disabled={deepEqual(productFormData, productData)}
              size="small"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </header>

        <div className="mt-10 flex gap-6 flex-wrap justify-center">
          <div className="card flex-1 flex flex-col gap-y-8 p-5">
            <div>
              <InputLabel htmlFor="title">Title</InputLabel>
              <TextField
                id="title"
                variant="outlined"
                size="small"
                fullWidth
                value={productFormData.title}
                onChange={handleChange('title')}
              />
            </div>
            <div>
              <InputLabel htmlFor="description">Description</InputLabel>
              <TextField
                id="description"
                variant="outlined"
                size="small"
                fullWidth
                multiline
                rows={4}
                value={productFormData.description}
                onChange={handleChange('description')}
              />
            </div>

            <div className="flex justify-between gap-x-4">
              <div>
                <InputLabel htmlFor="price">Price</InputLabel>
                <OutlinedInput
                  id="price"
                  placeholder="0.00"
                  size="small"
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  type="number"
                  value={productFormData.price}
                  onChange={handleChange('price')}
                />
              </div>
              <div>
                <InputLabel htmlFor="cost">Cost per item</InputLabel>
                <OutlinedInput
                  id="cost"
                  placeholder="0.00"
                  size="small"
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  type="number"
                  value={productFormData.cost}
                  onChange={handleChange('cost')}
                />
              </div>
            </div>

            <div className="flex gap-x-16">
              <div>
                <InputLabel htmlFor="outlined-adornment-password">
                  Margin
                </InputLabel>
                <div>{margin ? `${margin}%` : '-'}</div>
              </div>
              <div className="pr-10">
                <InputLabel htmlFor="outlined-adornment-password">
                  Profit
                </InputLabel>
                <div>{profit ? `$${profit}` : '-'}</div>
              </div>
            </div>

            <div className="flex justify-between gap-x-4">
              <div className="w-full">
                <InputLabel htmlFor="stockKeepingUnit">
                  SKU (Stock Keeping Unit)
                </InputLabel>
                <TextField
                  id="stockKeepingUnit"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={productFormData.stockKeepingUnit}
                  onChange={handleChange('stockKeepingUnit')}
                />
              </div>
              <div className="w-full">
                <InputLabel htmlFor="barcode">
                  Barcode (ISBN, UPC, etc.)
                </InputLabel>
                <TextField
                  id="barcode"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={productFormData.barcode}
                  onChange={handleChange('barcode')}
                />
              </div>
            </div>

            <div className="flex justify-between gap-x-4">
              <div className="w-full">
                <InputLabel htmlFor="quantity">Quantity Available</InputLabel>
                <TextField
                  id="quantity"
                  variant="outlined"
                  size="small"
                  type="number"
                  value={productFormData.quantity}
                  onChange={handleChange('quantity')}
                />
              </div>
              <div className="w-full">
                <InputLabel htmlFor="status">Status</InputLabel>
                <Select
                  id="status"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={productFormData.status}
                  onChange={handleChange('status') as any}
                >
                  <MenuItem value={'ACTIVE'}>Active</MenuItem>
                  <MenuItem value={'DRAFT'}>Draft</MenuItem>
                  <MenuItem value={'ARCHIVE'}>Archive</MenuItem>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <div className="card flex flex-col gap-y-8 p-5">
              <CollectionDropdown
                title="Vendors"
                id="vendor"
                collection="/api/vendors"
                value={productFormData.vendor}
                onChange={(newValue) => {
                  setProductFormData({
                    ...productFormData,
                    vendor: newValue,
                  });
                }}
              />
              <CollectionDropdown
                title="Product Types"
                id="productType"
                collection="/api/product-types"
                value={productFormData.productType}
                onChange={(newValue) => {
                  setProductFormData({
                    ...productFormData,
                    productType: newValue,
                  });
                }}
              />
              <TagDropdown
                selectedTags={productFormData.tags}
                onChange={(newTags) => {
                  setProductFormData({
                    ...productFormData,
                    tags: newTags,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEditor;
