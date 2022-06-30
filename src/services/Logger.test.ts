import { COLOR, IPrinter, Logger, LogMethod } from './Logger';
import { wait } from '../utils/wait';
import { FeatureFlag } from '../models/general';
import { ENV } from '../constants';

describe('Logger', () => {
  let logger: Logger;
  let printer: IPrinter;

  beforeEach(() => {
    printer = {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };
    logger = new Logger(printer, async () => null);
  });

  describe('color', () => {
    it('should color with multiple colors', () => {
      expect(logger.color([COLOR.RED, COLOR.BG_BLACK], 'some string')).toEqual(`${COLOR.RED}${COLOR.BG_BLACK}some string${COLOR.RESET}`);
    });
  });

  it('should log with a string or a number', async () => {
    logger.info('hello');
    await wait(0);
    expect(printer.info).toBeCalledWith(expect.any(String), 'hello');
    logger.info(5);
    expect(printer.info).toBeCalledWith(expect.any(String), '5');
  });

  it('should log with null or undefined', async () => {
    logger.info(null);
    await wait(0);
    expect(printer.info).toBeCalledWith(expect.any(String), 'null');
    logger.info(undefined);
    expect(printer.info).toBeCalledWith(expect.any(String), 'undefined');
  });

  it('should log with an object', async () => {
    logger.info({ a: 1 });
    await wait(0);
    expect(printer.info).toBeCalledWith(expect.any(String), expect.any(String));
  });

  it('should log on level: info', async () => {
    logger.info(1);
    await wait(0);
    expect(printer.info).toBeCalledWith(expect.any(String), expect.any(String));
  });

  it('should log on level: debug', async () => {
    logger.debug(1);
    await wait(0);
    expect(printer.debug).toBeCalledWith(expect.any(String), expect.any(String));
  });

  it('should log on level: warn', async () => {
    logger.warn(1);
    await wait(0);
    expect(printer.warn).toBeCalledWith(expect.any(String), expect.any(String));
  });

  it('should log on level: error', async () => {
    logger.error(1);
    await wait(0);
    expect(printer.error).toBeCalledWith(expect.any(String), expect.any(String));
  });

  it('should log on level: warn if the assert is truthy', async () => {
    logger.assert(LogMethod.WARN, true, 'some warn');
    await wait(0);
    expect(printer.warn).toBeCalledWith(expect.any(String), expect.any(String));
  });

  it('should not log on level: error if the assert is falsy', async () => {
    await wait(0);
    logger.assert(LogMethod.ERROR, false, 'some error');
    expect(printer.error).not.toBeCalled();
  });

  describe('feature flags', () => {
    let ignoredFeatureFlags: FeatureFlag[];

    beforeAll(() => {
      ignoredFeatureFlags = ENV.IGNORED_FEATURE_LIST;
    });

    beforeEach(() => {
      ENV.IGNORED_FEATURE_LIST = ignoredFeatureFlags;
    });

    afterAll(() => {
      ENV.IGNORED_FEATURE_LIST = ignoredFeatureFlags;
    });

    it('should not log DEBUG if DEBUG ignore flag is set', async () => {
      ENV.IGNORED_FEATURE_LIST = [FeatureFlag.LOG_LEVEL_DEBUG];
      logger.debug('some logs');
      await wait(0);
      expect(printer.debug).not.toBeCalled();
    });

    it('should not log INFO if INFO ignore flag is set', async () => {
      ENV.IGNORED_FEATURE_LIST = [FeatureFlag.LOG_LEVEL_INFO];
      logger.info('some logs');
      await wait(0);
      expect(printer.info).not.toBeCalled();
    });

    it('should not log WARN if WARN ignore flag is set', async () => {
      ENV.IGNORED_FEATURE_LIST = [FeatureFlag.LOG_LEVEL_WARN];
      logger.warn('some logs');
      await wait(0);
      expect(printer.warn).not.toBeCalled();
    });

    it('should not log ERROR if ERROR ignore flag is set', async () => {
      ENV.IGNORED_FEATURE_LIST = [FeatureFlag.LOG_LEVEL_ERROR];
      logger.error('some logs');
      await wait(0);
      expect(printer.error).not.toBeCalled();
    });
  });

  describe('event listeners', () => {
    it('should add an event listener', async () => {
      const handler = jest.fn();
      logger.addEventListener(LogMethod.INFO, handler);
      logger.error('test');
      await wait(0);
      expect(handler).not.toBeCalled();
      logger.info('test', 'test2');
      expect(handler).toBeCalledWith({ method: LogMethod.INFO, argList: ['test', 'test2'] });
    });

    it('should remove all event listeners for a method', async () => {
      const handler = jest.fn();
      const handler2 = jest.fn();
      logger.addEventListener(LogMethod.INFO, handler);
      logger.addEventListener(LogMethod.INFO, handler2);
      logger.removeEventListener(LogMethod.INFO);
      logger.info('test');
      await wait(0);
      expect(handler).not.toBeCalled();
      expect(handler2).not.toBeCalled();
    });

    it('should remove a single event listeners for a method', async () => {
      const handler = jest.fn();
      const handler2 = jest.fn();
      logger.addEventListener(LogMethod.INFO, handler);
      logger.addEventListener(LogMethod.INFO, handler2);
      logger.removeEventListener(LogMethod.INFO, handler);
      logger.info('test');
      await wait(0);
      expect(handler).not.toBeCalled();
      expect(handler2).toBeCalled();
    });
  });
});
