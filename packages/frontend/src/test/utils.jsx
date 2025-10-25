import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AuthProvider } from '../context/auth.context.jsx';

export function renderWithProviders(ui, { route = '/', initialEntries = [route] } = {}) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </AuthProvider>
  );
}

export function withRoutes(children) {
  return children; // helper noop for readability in tests
}

