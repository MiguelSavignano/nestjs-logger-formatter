import { clc } from '@nestjs/common/utils/cli-colors.util';
import { Logger } from './index';

describe('Logger', () => {
  let logger: Logger;
  let getTraceId = jest.fn().mockReturnValue('uuid');

  beforeEach(() => {
    logger = new Logger({
      getTraceId,
    });
  });

  it('should format message correctly', () => {
    const result = logger['formatMessage'](
      'log',
      'Test message',
      '',
      'DEBUG',
      '[Context]',
      '',
    );

    expect(result).toContain(`LOG`);
    expect(result).toContain(`[Context]`);
    expect(result).toContain(`Test message`);
  });

  describe('should format context', () => {
    it('without trace id', () => {
      const result = logger['formatContext']('TestContext');

      expect(result).toContain('[TestContext uuid] ');
    });

    it('with trace id', () => {
      (getTraceId as jest.Mock).mockReturnValue('');
      const result = logger['formatContext']('TestContext');

      expect(result).toContain('[TestContext]');
    });
  });

  describe('should return original message', () => {
    it('if not in development environment', () => {
      process.env.ENV = 'production';
      const message = 'Test message';

      const result = new Logger()['colorize'](message, 'debug');

      expect(result).toEqual(message);
    });

    it.each(['development', ''])('if ENV is %s', (envValue) => {
      process.env.ENV = envValue;
      const message = 'Test message';
      const result = new Logger()['colorize'](message, 'debug');

      expect(result).toEqual(clc.magentaBright(message));
    });
  });
});
