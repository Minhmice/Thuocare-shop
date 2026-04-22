import { NextResponse } from "next/server";
import { ApiError, isApiError, unknownToApiError } from "@/infrastructure/validation/api-error";
import { logger } from "@/infrastructure/logging/logger";

export type ApiOk<T extends object> = { ok: true } & T;
export type ApiFail = {
  ok: false;
  code: ApiError["code"];
  message: string;
  // Back-compat: older clients expect `error` string
  error: string;
  fieldErrors?: Record<string, string>;
};

export async function parseJson<T>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new ApiError({ code: "VALIDATION_ERROR", status: 400, message: "Invalid JSON body" });
  }
}

export function getRequestId(req: Request) {
  return req.headers.get("x-request-id") ?? crypto.randomUUID();
}

export function ok<T extends object>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, ...data } satisfies ApiOk<T>, init);
}

export function fail(e: unknown, requestId?: string) {
  const err = unknownToApiError(e);
  if (!isApiError(e)) {
    logger.error("api.unhandled_error", {
      requestId,
      code: err.code,
      message: err.message,
    });
  }

  const body: ApiFail = { ok: false, code: err.code, message: err.message, error: err.message };
  if (err.code === "VALIDATION_ERROR" && err.details && typeof err.details === "object") {
    const details = err.details as { fieldErrors?: Record<string, string> };
    if (details.fieldErrors) body.fieldErrors = details.fieldErrors;
  }
  return NextResponse.json(body, { status: err.status, headers: requestId ? { "x-request-id": requestId } : undefined });
}

