// evasions.test.ts
// Reason: Unit tests for leetspeak and narrativeInjection functions

import { leetspeak } from '../../../lib/evasions/leetspeak';
import { narrativeInjection } from '../../../lib/evasions/narrativeInjection';

describe('leetspeak', () => {
  it('should convert text to leetspeak', () => {
    expect(leetspeak('hello world')).toBe('h3110 w0r1d');
  });

  it('should handle empty strings', () => {
    expect(leetspeak('')).toBe('');
  });

  it('should handle special characters', () => {
    expect(leetspeak('!@#$%^&*()')).toBe('!@#$%^&*()');
  });
});

describe('narrativeInjection', () => {
  it('should inject narrative into text', () => {
    expect(narrativeInjection('hello world', 'Once upon a time,')).toBe('Once upon a time, hello world');
  });

  it('should handle empty input text', () => {
    expect(narrativeInjection('', 'Once upon a time,')).toBe('Once upon a time, ');
  });

  it('should handle empty narrative', () => {
    expect(narrativeInjection('hello world', '')).toBe(' hello world');
  });
});