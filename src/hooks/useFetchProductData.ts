import { useEffect, useState } from 'react';

import { ProductWithRevenue } from '../types';
import { branchDataAggregator } from '../utils/branchDataAggregator';
import { fetchBranchData } from '../utils/fetchBranchData';

export const useFetchProductData = (): [products: ProductWithRevenue[], isLoading: boolean, hasErrored: boolean] => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductWithRevenue[]>([]);
  const [hasErrored, setHasErrored] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      setHasErrored(false);

      //TODO: With more time I would've improved this so a single failure does not result
      // in the application error state being displayed. It would just display products from
      // the branches which do return data, and aggregate only those and display a message to the user.
      try {
        const branchData = await Promise.all([
          fetchBranchData('/api/branch1.json'),
          fetchBranchData('/api/branch2.json'),
          fetchBranchData('/api/branch3.json'),
        ]);

        setProducts(branchDataAggregator(branchData));
        setIsLoading(false);
      } catch (err) {
        setHasErrored(true);
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, []);

  return [products, isLoading, hasErrored];
};
