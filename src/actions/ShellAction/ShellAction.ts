import { Exclude, Expose } from "class-transformer";
import { ConsoleLogger } from "../../Logger/ConsoleLogger";
import { ILogger } from "../../Logger/ILogger";
import { CnctActionBase } from "../CnctActionBase";
import { IShellActionConfig, ShellType } from "./IShellActionConfig";
import { IShellInvoker } from "./IShellInvoker";
import { selectShell } from "./selectShell";

@Exclude()
export class ShellAction extends CnctActionBase {
    public static readonly shellActionType: string = "shell";

    public constructor(
        public readonly shellConfig: IShellActionConfig = {},
        logger: ILogger = new ConsoleLogger(),
    ) {
        super(ShellAction.shellActionType, logger);
    }

    @Expose()
    public set shell(shell: ShellType) {
        this.shellConfig.shell = shell;
    }

    @Expose()
    public set command(command: string) {
        this.shellConfig.command = command;
    }

    @Expose()
    public set description(description: string) {
        this.shellConfig.description = description;
    }

    public async execute(): Promise<void> {
        super.execute();

        const shellInvoker: IShellInvoker = selectShell(this.shellConfig.shell);
        shellInvoker.invokeShell(this.shellConfig);

        return Promise.resolve();
    }

    public validate(): void {
        if (!this.shellConfig.command || this.shellConfig.command === "") {
            throw new RangeError("Shell command cannot be empty.");
        }
    }
}
