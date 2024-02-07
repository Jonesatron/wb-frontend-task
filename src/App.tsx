import { useMemo, useState } from "react";
import LoadingState from "./components/LoadingState";
import { useFetchProductData } from "./hooks/useFetchProductData";
import { formatNumber } from "./utils/formatNumber";
import { calculateRevenue } from "./utils/calculateRevenue";

const App: React.FC = () => {
  const [products, isLoading] = useFetchProductData();
  const [searchValue, setSearchValue] = useState("");

  const [productsToDisplay, totalRevenue] = useMemo(() => {
    if (searchValue) {
      const filteredProducts = products.filter(({ name }) =>
        name.toLowerCase().includes(searchValue.toLowerCase())
      );

      return [filteredProducts, calculateRevenue(filteredProducts)];
    }

    return [products, calculateRevenue(products)];
  }, [products, searchValue]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="product-list">
      <search className="search-container">
        <label htmlFor="search-input">Search Products</label>
        <input
          id="search-input"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          type="text"
        />
      </search>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {productsToDisplay.map(({ id, name, revenue }) => (
            <tr key={id}>
              <td>{name}</td>
              <td>{formatNumber(revenue)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{formatNumber(totalRevenue)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default App;
