import React from 'react';
import { describe, it, expect } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/utils.jsx';
import Login from '../pages/authentication/Login.jsx';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';

const API = (p) => `http://localhost:3001${p}`;

describe('Login page', () => {
  it('logs in successfully and navigates to dashboard', async () => {
    const { getByPlaceholderText, getByRole } = renderWithProviders(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>,
      { route: '/login' }
    );

    await userEvent.type(getByPlaceholderText('Email or Username'), 'john');
    await userEvent.type(getByPlaceholderText('Password'), 'Abcdefghij1');
    await userEvent.click(getByRole('button', { name: /login/i }));

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
  });

  it('shows locked account modal on 423', async () => {
    server.use(
      http.post(API('/api/auth/login'), () => HttpResponse.json({ message: 'Locked', data: { lockReason: 'Policy', lockedAt: '2025-01-01T00:00:00Z' } }, { status: 423 }))
    );

    const { getByPlaceholderText, getByRole, findByText } = renderWithProviders(
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>,
      { route: '/login' }
    );

    await userEvent.type(getByPlaceholderText('Email or Username'), 'locked');
    await userEvent.type(getByPlaceholderText('Password'), 'any');
    await userEvent.click(getByRole('button', { name: /login/i }));

    expect(await screen.findByRole('heading', { name: /Tài khoản đã bị khóa/i }, { timeout: 5000 })).toBeInTheDocument();
  });

  it('navigates admins to /admin after login', async () => {
    const makeJwt = (payload) => {
      const base64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
      return `${base64({ alg: 'none', typ: 'JWT' })}.${base64(payload)}.`;
    };
    server.use(
      http.post(API('/api/auth/login'), async ({ request }) => {
        const body = await request.json();
        const exp = Math.floor(Date.now() / 1000) + 3600;
        return HttpResponse.json({ success: true, data: { user: { id: 99, role: 'ADMIN', username: body?.identifier || 'admin' }, token: makeJwt({ sub: '99', role: 'ADMIN', exp }), refreshToken: makeJwt({ sub: '99', type: 'refresh', exp: exp + 3600 }) } });
      })
    );

    const { getByPlaceholderText, getByRole, findByText } = renderWithProviders(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<div>Admin Home</div>} />
      </Routes>,
      { route: '/login' }
    );

    await userEvent.type(getByPlaceholderText('Email or Username'), 'admin');
    await userEvent.type(getByPlaceholderText('Password'), 'Abcdefghij1');
    await userEvent.click(getByRole('button', { name: /login/i }));

    expect(await findByText('Admin Home')).toBeInTheDocument();
  });
});
