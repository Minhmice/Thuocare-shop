import { z } from "zod";

export { z };

export type FieldErrors = Record<string, string>;

export function zodToFieldErrors(err: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of err.issues) {
    const path = issue.path.join(".");
    const key = path || "root";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

