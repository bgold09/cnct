import { Program } from "../Program";
import { ILogger } from "./ILogger";

/* tslint:disable:no-console */

export class ConsoleLogger implements ILogger {
    public logInfo(message: string): void {
        if (!Program.cliOptions.quiet) {
            console.log(message);
        }
    }

    public logError(message: string): void {
        console.error(message);
    }

    public logDebug(message: string): void {
        if (Program.cliOptions.debug) {
            console.log(message);
        }
    }
}
