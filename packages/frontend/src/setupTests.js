// Vitest setup file for frontend tests
import '@testing-library/jest-dom/vitest';
import { server } from './test/mocks/server';

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});

// Reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error conditions).
afterEach(() => {
  server.resetHandlers();
});

// Clean up after the tests are finished.
afterAll(() => {
  server.close();
});

