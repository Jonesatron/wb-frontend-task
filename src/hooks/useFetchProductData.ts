import { useEffect, useState } from 'react';

import { BranchApiResponse, ProductWithRevenue } from '../types';
import { branchDataAggregator } from '../utils/branchDataAggregator';

export const useFetchProductData = (): [ProductWithRevenue[], isLoading: boolean, hasErrored: boolean] => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductWithRevenue[]>([]);
  const [hasErrored, setHasErrored] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      setHasErrored(false);

      try {
        const responses = await Promise.all([
          fetch('/api/branch1.json'),
          fetch('/api/branch2.json'),
          fetch('/api/branch3.json'),
        ]);

        const branchData = await Promise.all(responses.map<Promise<BranchApiResponse>>((res) => res.json()));

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
