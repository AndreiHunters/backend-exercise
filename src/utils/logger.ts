type LogLevel = 'info' | 'warn' | 'error';

interface LogArgs {
  tag: string;
  message: string;
  [key: string]: unknown;
}

const emit = ({ level, args }: { level: LogLevel; args: LogArgs }): void => {
  const { tag, message, ...rest } = args;
  const line = {
    ts: new Date().toISOString(),
    level,
    tag,
    message,
    ...rest
  };
  const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  fn(JSON.stringify(line));
};

export const logger = {
  info: (args: LogArgs): void => emit({ level: 'info', args }),
  warn: (args: LogArgs): void => emit({ level: 'warn', args }),
  error: (args: LogArgs): void => emit({ level: 'error', args })
};
