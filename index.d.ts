import { ConsoleLogger, LogLevel } from '@nestjs/common';
interface LoggerOptions {
    devMode?: boolean;
    getTraceId?: () => string;
}
/**
 * Logger with formatters
 * Extends https://github.com/nestjs/nest/blob/95b1632279b401d54e4f34bd6db5cac504d08dd2/packages/common/services/console-logger.service.ts#L42
 */
export declare class Logger extends ConsoleLogger {
    devMode: boolean;
    getTraceId: () => string;
    constructor(options?: LoggerOptions);
    protected formatMessage(logLevel: LogLevel, message: unknown, pidMessage: string, originalFormattedLogLevel: string, contextMessage: string, timestampDiff: string): string;
    /**
     * Print plain objects in one line
     */
    protected stringifyMessage(message: unknown, logLevel: LogLevel): any;
    /**
     * Add trace id in context
     */
    protected formatContext(context: string): string;
    /**
     * Remove colorize in not dev environment
     */
    protected colorize(message: string, logLevel: LogLevel): string;
    private isDevEnv;
}
export {};
