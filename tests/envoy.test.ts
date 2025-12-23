import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { envoy, string, number, boolean, enumType, EnvoyError } from '../src';

describe('Envoy', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('validates and parses a correct configuration', () => {
    process.env.PORT = '3000';
    process.env.NODE_ENV = 'production';
    process.env.DEBUG = 'true';
    process.env.API_URL = 'https://api.example.com';

    const env = envoy({
      PORT: number(),
      NODE_ENV: enumType(['development', 'production', 'test']),
      DEBUG: boolean(),
      API_URL: string(),
    });

    expect(env).toEqual({
      PORT: 3000,
      NODE_ENV: 'production',
      DEBUG: true,
      API_URL: 'https://api.example.com',
    });
  });

  it('uses default values when keys are missing', () => {
    // No env vars set
    const env = envoy({
      PORT: number().default(8080),
      REGION: string().default('us-east-1'),
      FEATURE_FLAG: boolean().default(false),
    });

    expect(env).toEqual({
      PORT: 8080,
      REGION: 'us-east-1',
      FEATURE_FLAG: false,
    });
  });

  it('handles optional values', () => {
    const env = envoy({
      OPTIONAL_KEY: string().optional(),
    });

    expect(env.OPTIONAL_KEY).toBeUndefined();
  });

  it('throws an error for missing required values', () => {
    expect(() => {
      envoy({
        REQUIRED_KEY: string(),
      });
    }).toThrow(EnvoyError);

    try {
      envoy({ REQUIRED_KEY: string() });
    } catch (e: any) {
      expect(e.message).toContain('REQUIRED_KEY is missing');
    }
  });

  it('throws an error for invalid number', () => {
    process.env.PORT = 'abc';
    
    expect(() => {
      envoy({ PORT: number() });
    }).toThrow('PORT must be a number');
  });

  it('throws an error for invalid boolean', () => {
    process.env.IS_ENABLED = 'yes'; // 'yes' is not supported by our boolean parser
    
    expect(() => {
      envoy({ IS_ENABLED: boolean() });
    }).toThrow('IS_ENABLED must be a boolean');
  });

  it('throws an error for invalid enum value', () => {
    process.env.NODE_ENV = 'staging';
    
    expect(() => {
      envoy({ NODE_ENV: enumType(['dev', 'prod']) });
    }).toThrow('NODE_ENV must be one of: dev, prod');
  });

  it('collects multiple errors', () => {
    process.env.PORT = 'not-a-number';
    // MISSING_KEY is missing

    try {
      envoy({
        PORT: number(),
        MISSING_KEY: string(),
      });
    } catch (e: any) {
      expect(e).toBeInstanceOf(EnvoyError);
      expect(e.message).toContain('PORT must be a number');
      expect(e.message).toContain('MISSING_KEY is missing');
      expect(e.message.split('\n').length).toBeGreaterThan(3); // Header + 2 errors
    }
  });

  it('returns a frozen object', () => {
    const env = envoy({ FOO: string().default('bar') });
    expect(Object.isFrozen(env)).toBe(true);
  });
});
