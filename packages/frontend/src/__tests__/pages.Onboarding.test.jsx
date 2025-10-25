import React from 'react';
import { describe, it, expect } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/utils.jsx';
import OnboardingAge from '../pages/boardings/OnboardingAge.jsx';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';

const API = (p) => `http://localhost:3001${p}`;

describe('Onboarding Age step', () => {
  it('submits age and goes to dashboard when completed', async () => {
    // Logged-in user and required onboarding: at age step
    server.use(
      http.get(API('/auth/me'), () => HttpResponse.json({ user: { id: 1, role: 'USER' } })),
      http.get(API('/api/onboarding/session'), () => HttpResponse.json({ success: true, data: { required: true, completed: false, currentStepKey: 'age' } })),
      http.post(API('/api/onboarding/steps/age/answer'), () => HttpResponse.json({ success: true, data: { completed: true } }))
    );

    const { getByLabelText, findByText } = renderWithProviders(
      <Routes>
        <Route path="/onboarding/age" element={<OnboardingAge />} />
        <Route path="/dashboard" element={<div>My Dashboard</div>} />
      </Routes>,
      { route: '/onboarding/age' }
    );

    // tick both checkboxes
    await userEvent.click(getByLabelText(/Điều khoản dịch vụ/i));
    await userEvent.click(getByLabelText(/tôi muốn nhận thông tin/i));

    // click first age option (button contains label)
    const proceed = await findByText(/Tuổi: 16–29/);
    await userEvent.click(proceed);

    expect(await findByText('My Dashboard')).toBeInTheDocument();
  });
});

