import { Expose } from "class-transformer";
import { ConsoleLogger } from "../Logger/ConsoleLogger";
import { ILogger } from "../Logger/ILogger";
import { CURRENT_OS_TYPE, fromOperatingSystemString, OperatingSystemType } from "../OperatingSystem";

export abstract class CnctActionBase {
    protected osTypes: Set<OperatingSystemType> = new Set<OperatingSystemType>();

    protected constructor(
        public readonly actionType: string,
        protected readonly logger: ILogger = new ConsoleLogger(),
    ) {
    }

    @Expose()
    public set os(os: string | string[] | undefined) {
        if (!os) {
            return;
        }

        if (typeof os === "string") {
            this.osTypes.add(fromOperatingSystemString(os));
        } else {
            os.forEach((value: string) => {
                this.osTypes.add(fromOperatingSystemString(value));
            });
        }
    }

    public shouldExecute(): boolean {
        if (this.osTypes.size === 0
                || (this.osTypes.size > 0 && this.osTypes.has(CURRENT_OS_TYPE))) {

            return true;
        }

        return false;
    }

    public execute(): void {
        this.logger.logInfo(`executing ${this.actionType} action:`);
    }

    public abstract validate(): void;
}
