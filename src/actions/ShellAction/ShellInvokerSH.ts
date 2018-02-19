import { exec, ExecOptions, ExecOutputReturnValue } from "shelljs";
import { promisify } from "util";
import { ConsoleLogger } from "../../Logger/ConsoleLogger";
import { ILogger } from "../../Logger/ILogger";
import { IShellActionConfig } from "./IShellActionConfig";
import { IShellInvoker } from "./IShellInvoker";

const execAsync = promisify<string, ExecOptions, ExecOutputReturnValue>(exec);

export class ShellInvokerSH implements IShellInvoker {

    public constructor(
        private readonly logger: ILogger = new ConsoleLogger()) {
    }

    public async invokeShellAsync(shellActionConfig: IShellActionConfig): Promise<void> {
        const options: ExecOptions = {
            silent: shellActionConfig.silent,
            async: false,
        };

        const r: ExecOutputReturnValue = await execAsync(shellActionConfig.command, options);
        this.logger.logInfo(`code: ${r.code}; stdout: ${r.stdout}`);
    }
}
