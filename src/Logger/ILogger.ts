export interface ILogger {
    logInfo(message: string): void;
    logError(message: string): void;
    logVerbose(message: string): void;
}
