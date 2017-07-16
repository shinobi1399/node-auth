import * as winston from 'Winston';

export interface LoggingConfig {
    useFile: boolean;
    useConsole: boolean;
    minLevel?: string;
    fileOptions?: {
        filename: string;
        [key: string]: any;
    }
}

let globalLogger: winston.LoggerInstance;

export function getLogger(): winston.LoggerInstance {
    if (globalLogger == null) {
        globalLogger = new winston.Logger();
        globalLogger.add(winston.transports.Console);
        globalLogger.warn('logger has not been configured yet. Creating default logger');
    }
    return globalLogger;
}

export class LoggingManager {
    public static configure(config: LoggingConfig): void {
        globalLogger = LoggingManager.create(config);
    }

    public static create(config: LoggingConfig): winston.LoggerInstance {
        if (!config) {
            throw new Error('Invalid logging config');
        }
        let logger = new winston.Logger();
        if (config.minLevel) {
            logger.level = config.minLevel;
        }
        if (config.useConsole) {
            logger.add(winston.transports.Console, {name: 'console-logger'});
        }
        if (config.useFile) {
            let fileConfig = config.fileOptions ? config.fileOptions : <any> {};
            if (!fileConfig.filename) {
                fileConfig.filename = 'log.txt';
            }
            logger.add(winston.transports.File, fileConfig);
        }
        return logger;
    }
}
