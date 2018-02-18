import { Exclude } from "class-transformer";
import { ConsoleLogger } from "../../Logger/ConsoleLogger";
import { ILogger } from "../../Logger/ILogger";
import { CnctActionBase } from "../CnctActionBase";

@Exclude()
export class ShellAction extends CnctActionBase {
    public static readonly shellActionType: string = "shell";

    public constructor(
        logger: ILogger = new ConsoleLogger(),
    ) {
        super(ShellAction.shellActionType, logger);
    }

    public async execute(): Promise<void> {
        super.execute();
    }

    public validate(): void {
    }
}
