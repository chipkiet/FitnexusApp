import { describe, it, expect, beforeEach } from 'vitest';
import {
  setTokens,
  getToken,
  getRefreshToken,
  clearAllTokens,
  isTokenExpired,
  getTokenInfo,
} from '../lib/tokenManager';

// helper to craft unsigned JWT with exp
const makeJwt = (payload) => {
  const base64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  return `${base64({ alg: 'none', typ: 'JWT' })}.${base64(payload)}.`;
};

describe('tokenManager', () => {
  beforeEach(() => {
    clearAllTokens();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('stores tokens in session when rememberMe=false', () => {
    setTokens('a.b.c', 'r1', false);
    expect(getToken()).toBe('a.b.c');
    expect(getRefreshToken()).toBe('r1');
    expect(sessionStorage.getItem('accessToken')).toBeTruthy();
    expect(localStorage.getItem('accessToken')).toBeFalsy();
  });

  it('stores tokens in localStorage when rememberMe=true', () => {
    setTokens('a.b.c', 'r2', true);
    expect(getToken()).toBe('a.b.c');
    expect(getRefreshToken()).toBe('r2');
    expect(localStorage.getItem('accessToken')).toBeTruthy();
  });

  it('parses token info and expiration', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600; // 1h later
    const token = makeJwt({ sub: 'u1', role: 'USER', exp });
    setTokens(token, 'r', false);
    const info = getTokenInfo();
    expect(info.role).toBe('USER');
    expect(info.isExpired).toBe(false);
    expect(isTokenExpired(token)).toBe(false);
  });

  it('detects expired tokens', () => {
    const expPast = Math.floor(Date.now() / 1000) - 1;
    const token = makeJwt({ sub: 'u1', role: 'USER', exp: expPast });
    setTokens(token, 'r', false);
    expect(isTokenExpired(token)).toBe(true);
  });
});

