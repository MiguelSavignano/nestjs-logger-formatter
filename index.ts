import { ConsoleLogger, ConsoleLoggerOptions, LogLevel } from '@nestjs/common';
import { isPlainObject } from '@nestjs/common/utils/shared.utils';

interface LoggerOptions extends ConsoleLoggerOptions {
  devMode?: boolean;
  getTraceId?: () => string;
  context?: string;
}

/**
 * Logger with formatters
 * Extends https://github.com/nestjs/nest/blob/95b1632279b401d54e4f34bd6db5cac504d08dd2/packages/common/services/console-logger.service.ts#L42
 */
export class Logger extends ConsoleLogger {
  public devMode = false;
  public getTraceId = () => '';

  constructor(options: LoggerOptions = {}) {
    super(options.context, options);
    this.getTraceId = options.getTraceId || this.getTraceId;
    this.devMode = options.devMode || this.isDevEnv();
    this.setLogLevelByEnv(options.logLevels);
  }

  protected formatMessage(
    logLevel: LogLevel,
    message: unknown,
    pidMessage: string,
    originalFormattedLogLevel: string,
    contextMessage: string,
    timestampDiff: string,
  ) {
    const output = this.stringifyMessage(message, logLevel);
    const formattedLogLevel = this.colorize(logLevel.toUpperCase(), logLevel);

    return `${formattedLogLevel} ${contextMessage}${output}\n`;
  }

  /**
   * Print plain objects in one line
   */
  protected stringifyMessage(message: unknown, logLevel: LogLevel) {
    if (isPlainObject(message) || Array.isArray(message)) {
      const indent = this.devMode ? 2 : 0;
      return `${JSON.stringify(
        message,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value),
        indent,
      )}`;
    }
    return super.stringifyMessage(message, logLevel);
  }

  /**
   * Add trace id in context
   */
  protected formatContext(context: string): string {
    const traceId = this.getTraceId();
    const traceIdText = traceId ? ` ${traceId}` : '';

    return context ? this.colorize(`[${context}${traceIdText}] `, 'debug') : '';
  }

  /**
   * Remove colorize in not dev environment
   */
  protected colorize(message: string, logLevel: LogLevel) {
    if (!this.devMode) {
      return message;
    }

    return super.colorize(message, logLevel);
  }

  /**
   * For not dev environment disable debug logs
   */
  private setLogLevelByEnv(optionsLogLevels: LogLevel[]) {
    if (optionsLogLevels) return optionsLogLevels;

    this.setLogLevels(this.devMode ? ['verbose'] : ['log']);
  }

  private isDevEnv() {
    if (!process.env.ENV) return true;

    return process.env.ENV == 'development';
  }
}
