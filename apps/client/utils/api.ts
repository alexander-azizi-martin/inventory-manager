import axios from 'axios';
import { useSWRConfig } from 'swr';
import type { ProductForm } from '~/types';

const isDev = process.env.NODE_ENV == 'development';
const baseURL = isDev ? 'http://localhost:5000' : '';

const request = axios.create({
  baseURL: baseURL,
});

const exportProducts = async () => {
  await request.get('/api/products/export');
};

const getProducts = async () => {
  const { data } = await request.get('/api/products');

  return data;
};

const getProduct = async (productID: string) => {
  const { data } = await request.get(`/api/products/${productID}`);

  return data;
};

const createProduct = async (product: ProductForm) => {
  const { data } = await request.post(`/api/products`, product);

  return data;
};

const updatedProduct = async (productID: string, product: ProductForm) => {
  const { data } = await request.put(`/api/products/${productID}`, product);

  return data;
};

const deleteProduct = async (productID: string) => {
  await request.delete(`/api/products/${productID}`);
};

export default {
  baseURL,
  request,
  exportProducts,
  getProducts,
  getProduct,
  createProduct,
  updatedProduct,
  deleteProduct,
};
