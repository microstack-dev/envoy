# Envoy

**Envoy** is a typed, runtime-safe environment & configuration manager for modern JavaScript and TypeScript applications.

It adheres to a strict "Fail Fast" philosophy: if your environment configuration is invalid, your application should not start.

## Features

- **Runtime Safety**: Validates environment variables at startup.
- **TypeScript First**: Infers types automatically from your schema.
- **Fail Fast**: Throws a descriptive error if validation fails.
- **Zero Dependencies**: Lightweight and minimal.
- **No Magic**: explicit is better than implicit.

## Installation

```bash
npm install envoy
# or
yarn add envoy
# or
pnpm add envoy
```

## Basic Usage

Define your schema and validate your environment in one step. We recommend doing this in a dedicated file (e.g., `src/env.ts`) and importing it wherever needed.

```typescript
// src/env.ts
import { envoy, string, number, boolean, enumType } from 'envoy';

export const env = envoy({
  // Required string (throws if missing)
  DATABASE_URL: string(),

  // Number with default value
  PORT: number().default(3000),

  // Enum validation
  NODE_ENV: enumType(['development', 'production', 'test']),

  // Boolean parsing (accepts 'true', 'false', '1', '0')
  DEBUG: boolean().default(false),
  
  // Optional value (type will be string | undefined)
  API_KEY: string().optional(),
});
```

Now use `env` in your application with full type safety:

```typescript
import { env } from './env';

console.log(`Server starting on port ${env.PORT}`); // env.PORT is number

if (env.NODE_ENV === 'development') {
  // ...
}
```

## Error Handling

If the environment does not match the schema, **Envoy** throws a readable error listing all issues:

```text
❌ Invalid environment configuration

- DATABASE_URL is missing
- PORT must be a number (received "abc")
```

## Philosophy

1. **Fail fast**: Invalid config is a bug. Crash immediately.
2. **Types are truth**: The runtime object matches the TypeScript type exactly.
3. **Explicit**: No hidden `.env` loading. Use your preferred loader (like `dotenv` or `dotenv-flow`) before calling `envoy`.

## License

MIT