import { getIsEmail } from './get-is-email';
import { describe, test, expect } from 'vitest';

describe('getIsEmail', () => {
  test('should return true for valid email addresses', () => {
    const validEmails = [
      'john.doe@example.com',
      'jane_doe@example.co.uk',
      'test.user+123@example.io',
      'user%test@example.gov',
    ];

    for (const email of validEmails) {
      expect(getIsEmail(email)).toBe(true);
    }
  });

  test('should return false for invalid email addresses', () => {
    const invalidEmails = [
      'john.doe@.com',
      'jane_doe@example.',
      'test.user+123@.io',
      'user%test@.gov',
      'plainaddress',
      '@missingusername.com',
      'missingatsign.com',
    ];

    for (const email of invalidEmails) {
      expect(getIsEmail(email)).toBe(false);
    }
  });

  test('should return false for empty input', () => {
    expect(getIsEmail('')).toBe(false);
  });

  test('should return false for non-string input', () => {
    const nonStringInputs = [123, null, undefined, {}, []];

    for (const input of nonStringInputs) {
      expect(getIsEmail(input as any)).toBe(false);
    }
  });
});
