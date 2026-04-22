export type LogLevel = "debug" | "info" | "warn" | "error";

export type Logger = {
  debug: (msg: string, meta?: Record<string, unknown>) => void;
  info: (msg: string, meta?: Record<string, unknown>) => void;
  warn: (msg: string, meta?: Record<string, unknown>) => void;
  error: (msg: string, meta?: Record<string, unknown>) => void;
};

function write(level: LogLevel, msg: string, meta?: Record<string, unknown>) {
  const payload = meta ? { msg, ...meta } : { msg };
  if (level === "error") console.error(payload);
  else if (level === "warn") console.warn(payload);
  else if (level === "info") console.info(payload);
  else console.debug(payload);
}

export const logger: Logger = {
  debug: (msg, meta) => write("debug", msg, meta),
  info: (msg, meta) => write("info", msg, meta),
  warn: (msg, meta) => write("warn", msg, meta),
  error: (msg, meta) => write("error", msg, meta),
};

