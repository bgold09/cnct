import { ILogger } from "./ILogger";
import { ILoggerOptions } from "./ILoggerOptions";

export const LOGGER_OPTIONS: ILoggerOptions = {};

/* tslint:disable:no-console */

export class ConsoleLogger implements ILogger {
    public logInfo(message: string): void {
        if (!LOGGER_OPTIONS.quiet) {
            console.log(message);
        }
    }

    public logError(message: string): void {
        console.error(message);
    }

    public logDebug(message: string): void {
        if (LOGGER_OPTIONS.debug) {
            console.log(message);
        }
    }
}
