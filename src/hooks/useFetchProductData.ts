import { useEffect, useState } from "react";

import { branchDataAggregator } from "../utils/branchDataAggregator";
import { BranchApiResponse, ProductWithRevenue } from "../types";

//Error handling

export const useFetchProductData = (): [ProductWithRevenue[], boolean] => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductWithRevenue[]>([]);

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      const responses = await Promise.all([
        fetch("/api/branch1.json"),
        fetch("/api/branch2.json"),
        fetch("/api/branch3.json"),
      ]);

      const branchData = await Promise.all(
        responses.map<Promise<BranchApiResponse>>((res) => res.json())
      );

      setProducts(branchDataAggregator(branchData));

      setIsLoading(false);
    };

    fetchProductData();
  }, []);

  return [products, isLoading];
};
