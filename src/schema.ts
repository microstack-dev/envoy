import { Parser, VariableType } from './types';
import { parseString, parseNumber, parseBoolean, parseEnum } from './parse';

interface SchemaBuilder<T> extends Parser<T> {
  optional(): SchemaBuilder<T | undefined>;
  default(value: T): SchemaBuilder<T>;
}

function createBuilder<T>(
  type: VariableType,
  parseLogic: (value: string) => T,
  isOptional: boolean = false,
  defaultValue?: T
): SchemaBuilder<T> {
  const builder: SchemaBuilder<T> = {
    type,
    isOptional,
    defaultValue,
    
    parse(value: string | undefined, key: string): T {
      // 1. Handle missing values
      if (value === undefined || value === '') {
        if (defaultValue !== undefined) {
          return defaultValue;
        }
        if (isOptional) {
          return undefined as unknown as T;
        }
        throw new Error(`${key} is missing`);
      }

      // 2. Parse existing value
      try {
        return parseLogic(value);
      } catch (error: any) {
        // Strip "Error: " prefix if present in message, or just use message
        const msg = error.message || String(error);
        throw new Error(`${key} ${msg}`);
      }
    },

    optional() {
      // If we mark as optional, the type becomes T | undefined
      // We pass the same parseLogic.
      return createBuilder<T | undefined>(
        type, 
        parseLogic as unknown as (v: string) => T | undefined, 
        true, 
        defaultValue as unknown as T | undefined
      );
    },

    default(val: T) {
      // Setting a default makes it effectively non-optional for the consumer (it always has a value),
      // but conceptually it handles the "missing" case.
      // If we chain .optional().default(x), the type should probably go back to T.
      return createBuilder<T>(
        type,
        parseLogic,
        isOptional,
        val
      );
    }
  };
  return builder;
}

export function string(): SchemaBuilder<string> {
  return createBuilder('string', parseString);
}

export function number(): SchemaBuilder<number> {
  return createBuilder('number', parseNumber);
}

export function boolean(): SchemaBuilder<boolean> {
  return createBuilder('boolean', parseBoolean);
}

export function enumType<T extends string>(values: readonly T[]): SchemaBuilder<T> {
  return createBuilder('enum', (v) => parseEnum(v, values));
}
