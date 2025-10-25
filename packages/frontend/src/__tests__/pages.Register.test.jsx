import React from 'react';
import { describe, it, expect } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/utils.jsx';
import Register from '../pages/authentication/Register.jsx';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';

const API = (p) => `http://localhost:3001${p}`;

describe('Register page', () => {
  it('registers successfully and redirects to login', async () => {
    // Availability checks
    server.use(
      http.get(API('/api/auth/check-username'), () => HttpResponse.json({ success: true, available: true })),
      http.get(API('/api/auth/check-email'), () => HttpResponse.json({ success: true, available: true })),
      http.get(API('/api/auth/check-phone'), () => HttpResponse.json({ success: true, available: true }))
    );

    const { getByPlaceholderText, getByText, getByRole, findByText } = renderWithProviders(
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<div>Login Screen</div>} />
      </Routes>,
      { route: '/register' }
    );

    await userEvent.type(getByPlaceholderText('johnny'), 'alice');
    await userEvent.type(getByPlaceholderText('John Doe'), 'Alice Doe');
    await userEvent.type(getByPlaceholderText('0123 456 789'), '0912345678');
    await userEvent.type(getByPlaceholderText('john.doe@gmail.com'), 'alice@example.com');
    // Password inputs are custom; query both by placeholder
    const [pwd, confirm] = document.querySelectorAll('input[placeholder="••••••••••"]');
    await userEvent.type(pwd, 'Abcdefghij1');
    await userEvent.type(confirm, 'Abcdefghij1');

    await userEvent.click(getByText(/tôi đồng ý/i));
    await userEvent.click(getByRole('button', { name: /create account/i }));

    expect(await findByText('Login Screen')).toBeInTheDocument();
  });
});
