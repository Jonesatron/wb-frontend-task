## Choices

- Creation of `useFetchProductData` hook to extract away all the data fetching logic from within the main `App.jsx`. This also handles the Loading state.

- Created an Accessible LoadingState component. This uses `aria-live` polite and `role` of status so people using assistive technology would be read aloud the 'Loading' message.

- Moved `formatNumber` to a utils folder

- Created a util called `branchDataAggregator` which given an array of branch data (uses 3 in this case, but would work with more if more branches were added) returns a list of unique products, where amount sold have been aggregated across branches. I have also appended a `revenue` key to the product (sold \* unitPrice) for ease of use in the table. The products are returned sorted alphabetically.

## Improvements

- If I were adding any more fields to the table (aka another column), I would've extracted the product rows to be a new component. This would help keep the top level `App.jsx` as simple as possible.

```jsx
{
  filteredProducts.map((product) => (
    <ProductRow key={product.id} {...product} />
  ));
}
```

- I would probably also extract the ProductTable into its own component too. This would allow me to remove further logic from the main `App.jsx`.

- Depending on how many branches there were, I would consider removing the `useMemo`. If I was iterating over 10s of thousands of products it may be worth keeping, but if its only hundreds, it probably negatively affects performance.

-
