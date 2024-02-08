import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HttpResponse, http } from 'msw';
import { server } from '../mocks/node';
import { useFetchProductData } from './useFetchProductData';

server.use(
  http.get('/api/branch1.json', () => {
    return HttpResponse.json({
      branchId: '1',
      products: [
        {
          id: '000',
          name: 'pear',
          sold: 50,
          unitPrice: 7.5,
        },
        {
          id: '001',
          name: 'apple',
          sold: 100,
          unitPrice: 10,
        },
      ],
    });
  }),
  http.get('/api/branch2.json', () => {
    return HttpResponse.json({
      branchId: '2',
      products: [
        {
          id: '000',
          name: 'pear',
          sold: 50,
          unitPrice: 7.5,
        },
        {
          id: '002',
          name: 'orange',
          sold: 110,
          unitPrice: 15,
        },
      ],
    });
  }),
  http.get('/api/branch3.json', () => {
    return HttpResponse.json({
      branchId: '3',
      products: [
        {
          id: '000',
          name: 'pear',
          sold: 50,
          unitPrice: 7.5,
        },
        {
          id: '003',
          name: 'grapes',
          sold: 120,
          unitPrice: 20,
        },
      ],
    });
  }),
);

describe('when calling the useFetchProductData hook', () => {
  describe('and branch API responses are successful', () => {
    it('should return aggregated array of products with revenue', async () => {
      const { result } = renderHook(() => useFetchProductData());

      // Flush Promises
      await act(async () => {
        await Promise.resolve();
      });

      const [products, isLoading, hasErrored] = result.current;

      expect(isLoading).toEqual(false);
      expect(hasErrored).toEqual(false);
      expect(products).toEqual([
        {
          id: '001',
          name: 'apple',
          sold: 100,
          unitPrice: 10,
          revenue: 1000,
        },
        {
          id: '003',
          name: 'grapes',
          sold: 120,
          unitPrice: 20,
          revenue: 2400,
        },
        {
          id: '002',
          name: 'orange',
          sold: 110,
          unitPrice: 15,
          revenue: 1650,
        },
        {
          id: '000',
          name: 'pear',
          sold: 150,
          unitPrice: 7.5,
          revenue: 1125,
        },
      ]);
    });
  });

  describe('and any branch API call is unsuccessful', () => {
    it('should return empty products array and hasErrored as true', async () => {
      server.use(
        http.get('/api/branch2.json', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );

      const { result } = renderHook(() => useFetchProductData());

      // Flush Promises
      await act(async () => {
        await Promise.resolve();
      });

      const [products, isLoading, hasErrored] = result.current;

      expect(isLoading).toEqual(false);
      expect(hasErrored).toEqual(true);
      expect(products).toEqual([]);
    });
  });

  describe('and any branch API call is does not return valid JSON', () => {
    it('should return empty products array and hasErrored as true', async () => {
      server.use(
        http.get('/api/branch2.json', () => {
          return HttpResponse.text('Not JSON');
        }),
      );

      const { result } = renderHook(() => useFetchProductData());

      // Flush Promises
      await act(async () => {
        await Promise.resolve();
      });

      const [products, isLoading, hasErrored] = result.current;

      expect(isLoading).toEqual(false);
      expect(hasErrored).toEqual(true);
      expect(products).toEqual([]);
    });
  });
});
