export type VariableType = 'string' | 'number' | 'boolean' | 'enum';

export interface Parser<T> {
  parse(value: string | undefined, key: string): T;
  type: VariableType;
  isOptional: boolean;
  defaultValue?: T;
}

export type Schema = Record<string, Parser<any>>;

export type InferType<T extends Parser<any>> = ReturnType<T['parse']>;

export type Config<S extends Schema> = {
  readonly [K in keyof S]: InferType<S[K]>;
};
