export interface Product {
  id: string;
  name: string;
  unitPrice: number;
  sold: number;
}

export interface ProductWithRevenue extends Product {
  revenue: number;
}

export interface BranchApiResponse {
  branchId: string;
  products: Product[];
}
