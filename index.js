"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Logger = void 0;
var common_1 = require("@nestjs/common");
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
/**
 * Logger with formatters
 * Extends https://github.com/nestjs/nest/blob/95b1632279b401d54e4f34bd6db5cac504d08dd2/packages/common/services/console-logger.service.ts#L42
 */
var Logger = /** @class */ (function (_super) {
    __extends(Logger, _super);
    function Logger(options) {
        var _this = _super.call(this) || this;
        _this.devMode = false;
        _this.getTraceId = function () { return ''; };
        _this.getTraceId = options.getTraceId || _this.getTraceId;
        _this.devMode = options.devMode || _this.isDevEnv();
        return _this;
    }
    Logger.prototype.formatMessage = function (logLevel, message, pidMessage, originalFormattedLogLevel, contextMessage, timestampDiff) {
        var output = this.stringifyMessage(message, logLevel);
        var formattedLogLevel = this.colorize(logLevel.toUpperCase(), logLevel);
        return "".concat(formattedLogLevel, " ").concat(contextMessage).concat(output, "\n");
    };
    /**
     * Print plain objects in one line
     */
    Logger.prototype.stringifyMessage = function (message, logLevel) {
        if ((0, shared_utils_1.isPlainObject)(message) || Array.isArray(message)) {
            var indent = this.devMode ? 2 : 0;
            return "".concat(JSON.stringify(message, function (key, value) { return (typeof value === 'bigint' ? value.toString() : value); }, indent));
        }
        return _super.prototype.stringifyMessage.call(this, message, logLevel);
    };
    /**
     * Add trace id in context
     */
    Logger.prototype.formatContext = function (context) {
        var traceId = this.getTraceId();
        var traceIdText = traceId ? " ".concat(traceId) : '';
        return context ? this.colorize("[".concat(context).concat(traceIdText, "] "), 'debug') : '';
    };
    /**
     * Remove colorize in not dev environment
     */
    Logger.prototype.colorize = function (message, logLevel) {
        if (!this.devMode) {
            return message;
        }
        return _super.prototype.colorize.call(this, message, logLevel);
    };
    Logger.prototype.isDevEnv = function () {
        if (!process.env.ENV)
            return true;
        return process.env.ENV == 'development';
    };
    return Logger;
}(common_1.ConsoleLogger));
exports.Logger = Logger;
