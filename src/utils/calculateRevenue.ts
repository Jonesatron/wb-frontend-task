import { ProductWithRevenue } from '../types';

export const calculateRevenue = (products: ProductWithRevenue[]) =>
  products.reduce((total, product) => (total += product.revenue), 0);
