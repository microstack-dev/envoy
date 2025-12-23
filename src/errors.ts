export class EnvoyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvoyError";
  }
}

export function formatErrors(errors: string[]): string {
  if (errors.length === 0) return "";
  
  const lines = [
    "❌ Invalid environment configuration",
    "",
    ...errors.map(err => `- ${err}`)
  ];
  
  return lines.join("\n");
}
