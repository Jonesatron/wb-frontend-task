import { useMemo, useState } from 'react';
import ErrorState from './components/ErrorState';
import LoadingState from './components/LoadingState';
import { useFetchProductData } from './hooks/useFetchProductData';
import { calculateRevenue } from './utils/calculateRevenue';
import { formatNumber } from './utils/formatNumber';

const App: React.FC = () => {
  const [products, isLoading, hasErrored] = useFetchProductData();
  const [searchValue, setSearchValue] = useState('');

  const [productsToDisplay, totalRevenue] = useMemo(() => {
    if (searchValue) {
      const filteredProducts = products.filter(({ name }) => name.toLowerCase().includes(searchValue.toLowerCase()));

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
        <input id="search-input" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} type="text" />
      </search>
      {!hasErrored && productsToDisplay.length ? (
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
      ) : null}

      {hasErrored ? <ErrorState /> : null}
    </div>
  );
};

export default App;
