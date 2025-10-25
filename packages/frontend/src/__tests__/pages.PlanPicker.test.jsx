import React from 'react';
import { describe, it, expect } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/utils.jsx';
import PlanPicker from '../pages/plans/PlanPicker.jsx';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';

const API = (p) => `http://localhost:3001${p}`;

describe('PlanPicker', () => {
  it('lists plans and adds exercise to selected plan', async () => {
    server.use(
      http.get(API('/auth/me'), () => HttpResponse.json({ user: { id: 1, role: 'USER' } })),
      http.get(API('/api/plans'), () => HttpResponse.json({ success: true, data: { items: [ { plan_id: 7, name: 'Plan A', difficulty_level: 'beginner' } ] } })),
      http.post(API('/api/plans/7/exercises'), () => HttpResponse.json({ success: true }))
    );

    const { findByText, getByLabelText } = renderWithProviders(
      <Routes>
        <Route path="/plans/select" element={<PlanPicker />} />
        <Route path="/exercises" element={<div>Exercise Library</div>} />
      </Routes>,
      { route: '/plans/select?exerciseId=123' }
    );

    // Wait for plan list
    await findByText('Plan A');

    // Select radio (use label click on plan name)
    await userEvent.click(await findByText('Plan A'));

    // Click add to selected
    await userEvent.click(await findByText('Thêm vào plan đã chọn'));

    expect(await findByText('Exercise Library')).toBeInTheDocument();
  });
});

