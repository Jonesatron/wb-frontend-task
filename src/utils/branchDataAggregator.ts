import { BranchApiResponse, Product, ProductWithRevenue } from '../types';

export const branchDataAggregator = (data: BranchApiResponse[]): ProductWithRevenue[] => {
  const flatData = data.map(({ products }) => products).flat();

  const uniqueProducts = flatData.reduce<Record<Product['id'], ProductWithRevenue>>((acc, product) => {
    if (acc[product.id]) {
      acc[product.id].sold += product.sold;
      acc[product.id].revenue = acc[product.id].sold * acc[product.id].unitPrice;
      return acc;
    }
    acc[product.id] = {
      ...product,
      revenue: product.sold * product.unitPrice,
    };

    return acc;
  }, {});

  return Object.values(uniqueProducts).sort((a, b) => a.name.localeCompare(b.name));
};
