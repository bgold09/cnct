import { exec, ExecOptions, ExecOutputReturnValue } from "shelljs";
import { promisify } from "util";
import { ConsoleLogger } from "../../Logger/ConsoleLogger";
import { ILogger } from "../../Logger/ILogger";
import { IShellActionConfig } from "./IShellActionConfig";
import { IShellInvoker } from "./IShellInvoker";

// export const execAsync: (command: string, options: shelljs.ExecOptions)
//  => Promise<shelljs.ExecOutputReturnValue> = promisify(shelljs.exec);
const execAsync = promisify<string, ExecOptions, ExecOutputReturnValue>(exec);

export class ShellInvokerSH implements IShellInvoker {

    public constructor(
        private readonly logger: ILogger = new ConsoleLogger()) {
    }

    public async invokeShellAsync(shellActionConfig: IShellActionConfig): Promise<void> {
        const options: ExecOptions = {
            silent: false,
            async: false,
        };

        const r: ExecOutputReturnValue = await execAsync(shellActionConfig.command, options);
        this.logger.logInfo(`code: ${r.code}; stdout: ${r.stdout}`);
    }
}
