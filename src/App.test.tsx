import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HttpResponse, http } from 'msw';
import App from './App';
import { server } from './mocks/node';

describe('when rendering <App />', () => {
  it('should render without crashing', () => {
    render(<App />);
  });

  it('should render loading text initially', async () => {
    render(<App />);
    expect(screen.getByRole('status', { name: 'Loading...' })).toBeInTheDocument();
  });

  describe('and the branch data APIs successfully return data', () => {
    it('should renders a table after data load', async () => {
      render(<App />);
      expect(screen.getByRole('status', { name: 'Loading...' })).toBeInTheDocument();

      await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    });

    it('should render rows with product name as key', async () => {
      render(<App />);
      expect(screen.getByRole('status', { name: 'Loading...' })).toBeInTheDocument();

      await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

      expect(screen.getAllByRole('row').at(57)).toHaveTextContent('Hominy');
      expect(screen.getAllByRole('row').at(74)).toHaveTextContent('Lychee');
    });

    it('should render table that is sorted ascending', async () => {
      render(<App />);
      expect(screen.getByRole('status', { name: 'Loading...' })).toBeInTheDocument();

      await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

      expect(screen.getByRole('table')).toMatchSnapshot();
    });

    it('should calculate total revenue of all branches', async () => {
      render(<App />);
      expect(screen.getByRole('status', { name: 'Loading...' })).toBeInTheDocument();

      await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

      expect(within(screen.getAllByRole('row').at(-1)!).getAllByRole('cell').at(-1)).toHaveTextContent('2,102,619.44');
    });

    it('should filter the displayed products', async () => {
      render(<App />);
      expect(screen.getByRole('status', { name: 'Loading...' })).toBeInTheDocument();

      await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

      fireEvent.change(screen.getByLabelText('Search Products'), {
        target: { value: 'pear' },
      });

      expect(within(screen.getAllByRole('row').at(-1)!).getAllByRole('cell').at(-1)).toHaveTextContent('60,681.02');
    });
  });

  describe('and the branch data APIs are not successful', () => {
    it('should render error message', async () => {
      server.use(
        http.get('/api/branch2.json', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );

      render(<App />);
      expect(screen.getByRole('status', { name: 'Loading...' })).toBeInTheDocument();

      await waitFor(() => expect(screen.getByRole('alert', { name: 'Something went wrong' })).toBeInTheDocument());
    });
  });
});
