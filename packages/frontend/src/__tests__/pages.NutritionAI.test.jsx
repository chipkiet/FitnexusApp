import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../test/utils.jsx';
import { waitFor } from '@testing-library/react';

// Mock Tensorflow and Mobilenet to avoid heavy loading in tests
vi.mock('@tensorflow/tfjs', () => ({
  default: {},
  setBackend: vi.fn().mockResolvedValue(undefined),
  ready: vi.fn().mockResolvedValue(undefined),
  loadLayersModel: vi.fn().mockResolvedValue({
    outputs: [ { shape: [null, 3] } ],
    predict: vi.fn(() => ({ dataSync: () => new Float32Array([0.9, 0.05, 0.05]) })),
  }),
  browser: { fromPixels: vi.fn(() => ({ expandDims: () => ({}) })) },
  tidy: (fn) => fn(),
}));

vi.mock('@tensorflow/tfjs-backend-webgl', () => ({}));

vi.mock('@tensorflow-models/mobilenet', () => ({
  load: vi.fn().mockResolvedValue({ infer: vi.fn(() => ({})) }),
}));
const NutritionAI = (await import('../pages/nutrition/NutritionAI.jsx')).default;

describe('NutritionAI page', () => {
  it('renders hero and enables file input when ready', async () => {
    const { findByText, container } = renderWithProviders(
      <Routes>
        <Route path="/nutrition-ai" element={<NutritionAI />} />
      </Routes>,
      { route: '/nutrition-ai' }
    );

    expect(await findByText('Nhận diện món ăn & Tính calo tức thì')).toBeInTheDocument();
    // Hidden input becomes enabled once models and tables fetched
    const input = container.querySelector('input[type="file"]');
    await waitFor(() => expect(input.disabled).toBe(false));
  });
});
