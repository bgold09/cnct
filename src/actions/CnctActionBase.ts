import { Expose } from "class-transformer";
import { ConsoleLogger } from "../Logger/ConsoleLogger";
import { ILogger } from "../Logger/ILogger";
import { fromFriendlyOperatingSystemName, getOperatingSystemType, OperatingSystemType } from "../OperatingSystem";

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
            this.osTypes.add(fromFriendlyOperatingSystemName(os));
        } else {
            os.forEach((value: string) => {
                this.osTypes.add(fromFriendlyOperatingSystemName(value));
            });
        }
    }

    public execute(): void {
        if (this.osTypes.size === 0
                || (this.osTypes.size > 0 && this.osTypes.has(getOperatingSystemType()))) {
            this.logger.logInfo(`executing ${this.actionType} action:`);
        }
    }

    public abstract validate(): void;
}
