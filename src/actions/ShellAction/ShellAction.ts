import { Exclude, Expose } from "class-transformer";
import { ConsoleLogger } from "../../Logger/ConsoleLogger";
import { ILogger } from "../../Logger/ILogger";
import { getOperatingSystemType, OperatingSystemType } from "../../OperatingSystem";
import { CnctActionBase } from "../CnctActionBase";
import { IShellActionConfig, ShellType } from "./IShellActionConfig";
import { IShellInvoker } from "./IShellInvoker";
import { selectShell } from "./selectShell";

@Exclude()
export class ShellAction extends CnctActionBase {
    public static readonly shellActionType: string = "shell";

    public constructor(
        public readonly shellConfig: IShellActionConfig = { command: "" },
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

    @Expose()
    public set silent(silent: boolean) {
        this.shellConfig.silent = silent;
    }

    public async execute(): Promise<void> {
        super.execute();

        if (this.shellConfig.silent === undefined) {
            this.shellConfig.silent = true;
        }

        const shellInvoker: IShellInvoker = selectShell(this.shellConfig.shell);
        await shellInvoker.invokeShellAsync(this.shellConfig);
    }

    public validate(): void {
        if (!this.shellConfig.command || this.shellConfig.command === "") {
            throw new RangeError("Shell command cannot be empty.");
        }

        if (this.shellConfig.shell) {
            const shellType: ShellType = this.shellConfig.shell;
            const osType: OperatingSystemType = getOperatingSystemType();
            if ((osType === "windows" && shellType === "sh")
                    || ((osType === "linux" || osType === "osx") && shellType === "powershell")) {
                throw new RangeError(`Shell type '${shellType}' is not supported for operating system '${osType}'.`);
            }
        }
    }
}
