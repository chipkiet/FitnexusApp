import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../lib/api';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';

const API = (p) => `http://localhost:3001${p}`;
const makeJwt = (payload) => {
  const base64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  return `${base64({ alg: 'none', typ: 'JWT' })}.${base64(payload)}.`;
};

describe('api interceptors', () => {
  beforeEach(() => {
    // reset location.replace spy each time
    vi.restoreAllMocks();
    // clear tokens
    localStorage.clear();
    sessionStorage.clear();
  });

  it('adds Authorization header when token present', async () => {
    // set a realistic non-expired JWT token
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const token = makeJwt({ sub: 'u1', role: 'USER', exp });
    localStorage.setItem('accessToken', token);

    let seenAuth;
    server.use(
      http.get(API('/api/ping-auth'), ({ request }) => {
        seenAuth = request.headers.get('authorization');
        return HttpResponse.json({ ok: true });
      })
    );

    await api.get('/api/ping-auth');
    expect(seenAuth).toBe(`Bearer ${token}`);
  });

  it('redirects to /login on 423 for non-pass-through URL', async () => {
    const orig = window.location;
    const replace = vi.fn();
    Object.defineProperty(window, 'location', { value: { ...orig, replace }, writable: true });
    server.use(
      http.get(API('/api/protected-423'), () => HttpResponse.json({ message: 'Locked' }, { status: 423 }))
    );

    await expect(api.get('/api/protected-423')).rejects.toBeDefined();
    expect(replace).toHaveBeenCalledWith('/login');
    Object.defineProperty(window, 'location', { value: orig, writable: true });
  });

  it('does not redirect for pass-through /api/auth/login 401', async () => {
    const orig = window.location;
    const replace = vi.fn();
    Object.defineProperty(window, 'location', { value: { ...orig, replace }, writable: true });
    server.use(
      http.post(API('/api/auth/login'), () => HttpResponse.json({ message: 'Bad creds' }, { status: 401 }))
    );
    await expect(api.post('/api/auth/login', { identifier: 'a', password: 'b' })).rejects.toBeDefined();
    expect(replace).not.toHaveBeenCalled();
    Object.defineProperty(window, 'location', { value: orig, writable: true });
  });
});
