import { describe, it, expect } from 'vitest';
import { Email } from '../email';

describe('Email', () => {
  it('should create a valid email', () => {
    const email = new Email('test@example.com');

    expect(email.valor).toBe('test@example.com');
  });

  it('should convert email to lowercase', () => {
    const email = new Email('TEST@EXAMPLE.COM');

    expect(email.valor).toBe('test@example.com');
  });

  it('should trim whitespace', () => {
    const email = new Email('  test@example.com  ');

    expect(email.valor).toBe('test@example.com');
  });

  it('should throw error for invalid email format', () => {
    expect(() => new Email('invalid-email')).toThrow('Email inválido');
    expect(() => new Email('test@')).toThrow('Email inválido');
    expect(() => new Email('@example.com')).toThrow('Email inválido');
    expect(() => new Email('test.example.com')).toThrow('Email inválido');
    expect(() => new Email('')).toThrow('Email inválido');
  });

  it('should accept valid email formats', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      'test123@test-domain.com',
    ];

    validEmails.forEach(emailStr => {
      expect(() => new Email(emailStr)).not.toThrow();
    });
  });

  it('should check equality correctly', () => {
    const email1 = new Email('test@example.com');
    const email2 = new Email('test@example.com');
    const email3 = new Email('other@example.com');

    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals(email3)).toBe(false);
  });

  it('should format email as string', () => {
    const email = new Email('test@example.com');

    expect(email.toString()).toBe('test@example.com');
  });
});
