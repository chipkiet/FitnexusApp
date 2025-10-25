import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/utils.jsx';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';

const API = (p) => `http://localhost:3001${p}`;

// Avoid creating real WebGL Canvas in jsdom
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="mock-canvas">{children}</div>,
  useThree: () => ({ camera: { position: { clone: () => ({}) } } }),
}));
vi.mock('@react-three/drei', () => ({
  Bounds: ({ children }) => <div data-testid="mock-bounds">{children}</div>,
  OrbitControls: () => null,
  useGLTF: () => ({ scene: { traverse: () => {} } }),
  Center: ({ children }) => <div data-testid="mock-center">{children}</div>,
}));
const Landing = (await import('../pages/landing/Landing.jsx')).default;

describe('Landing page', () => {
  it('unauthenticated users clicking CTA go to login', async () => {
    // /auth/me default returns 401
    const { getByRole, findByText } = renderWithProviders(
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      { route: '/' }
    );
    await userEvent.click(getByRole('button', { name: /Nhận kế hoạch luyện tập cá nhân hóa/i }));
    expect(await findByText('Login Page')).toBeInTheDocument();
  });

  it('logged-in users with pending onboarding go to next step', async () => {
    server.use(
      http.get(API('/auth/me'), () => HttpResponse.json({ user: { id: 2, role: 'USER' } })),
      http.get(API('/api/onboarding/session'), () => HttpResponse.json({ success: true, data: { required: true, completed: false, nextStepKey: 'goal' } }))
    );
    const { getByRole, findByText } = renderWithProviders(
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding/goal" element={<div>Goal Step</div>} />
      </Routes>,
      { route: '/' }
    );
    await userEvent.click(getByRole('button', { name: /Nhận kế hoạch luyện tập cá nhân hóa/i }));
    expect(await findByText('Goal Step')).toBeInTheDocument();
  });
});
