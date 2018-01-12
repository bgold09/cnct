import { ConsoleLogger } from "./Logger/ConsoleLogger";
import { ILogger } from "./Logger/ILogger";

export abstract class CnctActionBase {
    protected constructor(
        public readonly actionType: string,
        protected readonly logger: ILogger = new ConsoleLogger(),
    ) {
    }

    public execute(): void {
        this.logger.logInfo(`executing ${this.actionType} action:`);
    }

    public abstract validate(): void;
}
