import { Schema, Config } from './types';
import { EnvoyError, formatErrors } from './errors';

export function envoy<S extends Schema>(schema: S): Config<S> {
  const config: any = {};
  const errors: string[] = [];
  
  // Design Note: In v0.1.0 we only read from process.env
  // Future versions can accept an options object to specify sources.
  const envSource = process.env;

  for (const key of Object.keys(schema)) {
    const parser = schema[key];
    const rawValue = envSource[key];

    try {
      config[key] = parser.parse(rawValue, key);
    } catch (error: any) {
      // Collect all errors
      errors.push(error.message);
    }
  }

  if (errors.length > 0) {
    throw new EnvoyError(formatErrors(errors));
  }

  return Object.freeze(config) as Config<S>;
}
