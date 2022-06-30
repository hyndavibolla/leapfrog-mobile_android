import { ENV } from '../constants';
import { DateLike, FeatureFlag } from '../models/general';
import { createUUID } from '../utils/create-uuid';
import { shouldShowFeature } from '_components/Flagged';

export enum COLOR {
  RESET = '\x1b[0m',
  BRIGHT = '\x1b[1m',
  DIM = '\x1b[2m',
  UNDERSCORE = '\x1b[4m',
  BLINK = '\x1b[5m',
  REVERSE = '\x1b[7m',
  HIDDEN = '\x1b[8m',

  BLACK = '\x1b[30m',
  RED = '\x1b[31m',
  GREEN = '\x1b[32m',
  YELLOW = '\x1b[33m',
  BLUE = '\x1b[34m',
  MAGENTA = '\x1b[35m',
  CYAN = '\x1b[36m',
  WHITE = '\x1b[37m',

  BG_BLACK = '\x1b[40m',
  BG_RED = '\x1b[41m',
  BG_GREEN = '\x1b[42m',
  BG_YELLOW = '\x1b[43m',
  BG_BLUE = '\x1b[44m',
  BG_MAGENTA = '\x1b[45m',
  BG_CYAN = '\x1b[46m',
  BG_WHITE = '\x1b[47m'
}

export interface IPrinter {
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

export enum LogMethod {
  INFO = 'info',
  DEBUG = 'debug',
  WARN = 'warn',
  ERROR = 'error'
}

export interface ILogSettings {
  ignoredLogMethodList: LogMethod[];
  argMaxLength: number;
}

export const getLogSettingsDefault = (): ILogSettings => ({ ignoredLogMethodList: [], argMaxLength: 0 });

export interface ILogHistoryItem {
  key: string;
  level: string;
  timestamp: DateLike;
  logList: any[];
}

export type LogHandler = (event: { method: LogMethod; argList: any[] }) => void;

export class Logger {
  constructor(private printer: IPrinter, private storageGetter: (key: string) => Promise<ILogSettings>) {}
  private shouldStoreLogHistory = shouldShowFeature(FeatureFlag.LOG_VIEW);
  private logHistoryList: ILogHistoryItem[] = [];
  private listenerMap: Record<string, LogHandler[]> = Object.values(LogMethod).reduce((total, curr) => ({ ...total, [curr]: [] }), {});

  /* istanbul ignore next line */
  getLogHistoryList = () => [...this.logHistoryList];

  public info = (...args: any[]) => this.deferredLogMethod(LogMethod.INFO, ...args);
  public debug = (...args: any[]) => this.deferredLogMethod(LogMethod.DEBUG, ...args);
  public warn = (...args: any[]) => this.deferredLogMethod(LogMethod.WARN, ...args);
  public error = (...args: any[]) => this.deferredLogMethod(LogMethod.ERROR, ...args);
  public assert = (level: LogMethod, shouldLog: boolean, ...args: any[]): void => {
    if (shouldLog) this[level](...args);
  };

  public format = (arg: any, argMaxLength?: number): string => {
    const maxArgLength = argMaxLength || Infinity;
    const parsed = (() => {
      if (['string', 'number'].includes(typeof arg) || [null, undefined].includes(arg)) return String(arg);
      return JSON.stringify(arg, null, 2);
    })();
    /* istanbul ignore next line | this ternary is only valid for the dev environment */
    return parsed.length > maxArgLength ? `${parsed.slice(0, maxArgLength)}\n...showing ${maxArgLength} out of ${parsed.length} chars...\n` : parsed;
  };

  public color = (colors: COLOR[], arg: any): string => `${colors.join('')}${arg}${COLOR.RESET}`;

  public addEventListener = (method: LogMethod, handler: LogHandler): void => {
    this.listenerMap = { ...this.listenerMap, [method]: [...this.listenerMap[method], handler] };
  };

  public removeEventListener = (method: LogMethod, handler?: LogHandler): void => {
    this.listenerMap = { ...this.listenerMap, [method]: this.listenerMap[method].filter(h => !!handler && handler !== h) };
  };

  private deferredLogMethod = (() => {
    let settings: ILogSettings;
    return (level: LogMethod, ...args: any[]) => {
      const log = () => this.logMethod(settings, level, ...args);
      settings
        ? log()
        : this.storageGetter(ENV.STORAGE_KEY.LOG_SETTINGS)
            .then(s => this.logMethod((settings = s || getLogSettingsDefault()), level, ...args))
            .catch(log);
    };
  })();

  private logMethod = (settings: ILogSettings, level: LogMethod, ...args: any[]) => {
    /* istanbul ignore next line */
    if (this.shouldStoreLogHistory) this.logHistoryList = [{ key: createUUID(), level, timestamp: Date.now(), logList: args }, ...this.logHistoryList];
    this.listenerMap[level]?.forEach(h => h({ method: level, argList: args }));

    if (!shouldShowFeature(FeatureFlag.LOG_LEVEL_DEBUG) && level === LogMethod.DEBUG) return;
    if (!shouldShowFeature(FeatureFlag.LOG_LEVEL_INFO) && level === LogMethod.INFO) return;
    if (!shouldShowFeature(FeatureFlag.LOG_LEVEL_WARN) && level === LogMethod.WARN) return;
    if (!shouldShowFeature(FeatureFlag.LOG_LEVEL_ERROR) && level === LogMethod.ERROR) return;

    switch (level) {
      case LogMethod.INFO:
        return this.printer.info(this.color([COLOR.BLUE], level.toUpperCase()), ...args.map(arg => this.format(arg, settings.argMaxLength)));

      case LogMethod.DEBUG:
        return this.printer.debug(this.color([COLOR.MAGENTA], level.toUpperCase()), ...args.map(arg => this.format(arg, settings.argMaxLength)));

      case LogMethod.WARN:
        return this.printer.warn(this.color([COLOR.YELLOW], level.toUpperCase()), ...args.map(arg => this.format(arg, settings.argMaxLength)));

      case LogMethod.ERROR:
        return this.printer.error(this.color([COLOR.RED], level.toUpperCase()), ...args.map(arg => this.format(arg, settings.argMaxLength)));
    }
  };
}
