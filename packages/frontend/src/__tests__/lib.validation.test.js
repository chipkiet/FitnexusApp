import { describe, it, expect } from 'vitest';
import { validateEmail } from '../lib/emailValidation';
import { validatePassword, getPasswordStrength } from '../lib/passwordValidation';
import { validateUsername } from '../lib/usernameValidation';
import { validatePhone } from '../lib/phoneValidation';
import { validateFullname } from '../lib/fullnameValidation';

describe('Validation utilities', () => {
  it('validates email format', () => {
    expect(validateEmail('')).toMatchObject({ isValid: false });
    expect(validateEmail('user@domain')).toMatchObject({ isValid: false });
    expect(validateEmail('user@domain.com').isValid).toBe(true);
  });

  it('validates password rules and strength', () => {
    const weak = validatePassword('abc');
    expect(weak.isValid).toBe(false);

    const mid = validatePassword('Abcdefghij');
    expect(mid.isValid).toBe(false); // missing number/special

    const good = validatePassword('Abcdefghij1');
    expect(good.isValid).toBe(true);

    expect(getPasswordStrength('')).toBe('weak');
    expect(getPasswordStrength('Abcdefghij')).toBe('good');
    expect(getPasswordStrength('Abcdefghij1')).toBe('strong');
  });

  it('validates username rules', () => {
    expect(validateUsername('')).toMatchObject({ isValid: false });
    expect(validateUsername('1ab')).toMatchObject({ isValid: false });
    expect(validateUsername('ab')).toMatchObject({ isValid: false });
    expect(validateUsername('a_b')).toMatchObject({ isValid: true });
    expect(validateUsername('a'.repeat(21)).isValid).toBe(false);
  });

  it('validates VN phone format', () => {
    expect(validatePhone('')).toMatchObject({ isValid: false });
    expect(validatePhone('01234').isValid).toBe(false);
    expect(validatePhone('0912345678').isValid).toBe(true);
    expect(validatePhone('+84912345678').isValid).toBe(true);
  });

  it('validates full name', () => {
    expect(validateFullname('')).toMatchObject({ isValid: false });
    expect(validateFullname('A').isValid).toBe(false);
    expect(validateFullname('John Doe').isValid).toBe(true);
    expect(validateFullname("Trần-Đức O'Connor").isValid).toBe(true);
  });
});
