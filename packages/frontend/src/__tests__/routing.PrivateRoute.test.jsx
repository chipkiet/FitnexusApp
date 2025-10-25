import React from 'react';
import { describe, it, expect } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../test/utils.jsx';
import PrivateRoute from '../components/routing/PrivateRoute.jsx';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';

const API = (p) => `http://localhost:3001${p}`;

describe('PrivateRoute', () => {
  it('redirects unauthenticated users to /login', async () => {
    // /auth/me returns 401 by default (handlers)
    const { findByText } = renderWithProviders(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/protected"
          element={
            <PrivateRoute>
              <div>Protected Content</div>
            </PrivateRoute>
          }
        />
      </Routes>,
      { route: '/protected' }
    );
    expect(await findByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to onboarding step when required', async () => {
    // Authenticated user via /auth/me
    server.use(
      http.get(API('/auth/me'), () => HttpResponse.json({ user: { id: 1, role: 'USER' } })),
      http.get(API('/api/onboarding/session'), () => HttpResponse.json({ success: true, data: { required: true, completed: false, nextStepKey: 'age' } }))
    );

    const { findByText } = renderWithProviders(
      <Routes>
        <Route path="/onboarding/age" element={<div>Age Step</div>} />
        <Route
          path="/protected"
          element={
            <PrivateRoute>
              <div>Protected Content</div>
            </PrivateRoute>
          }
        />
      </Routes>,
      { route: '/protected' }
    );
    expect(await findByText('Age Step')).toBeInTheDocument();
  });
});

