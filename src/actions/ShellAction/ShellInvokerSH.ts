import { exec, ExecOptions, ExecOutputReturnValue, ShellString } from "shelljs";
import { promisify } from "util";
import { ConsoleLogger } from "../../Logger/ConsoleLogger";
import { ILogger } from "../../Logger/ILogger";
import { IShellActionConfig } from "./IShellActionConfig";
import { IShellInvoker } from "./IShellInvoker";

const execAsync: (command: string, options: ExecOptions) => Promise<ExecOutputReturnValue> =
    promisify<string, ExecOptions, ExecOutputReturnValue>(exec);

export class ShellInvokerSH implements IShellInvoker {

    public constructor(
        private readonly logger: ILogger = new ConsoleLogger()) {
    }

    public async invokeShellAsync(shellActionConfig: IShellActionConfig): Promise<void> {
        const options: ExecOptions = {
            silent: shellActionConfig.silent,
            async: false,
        };

        this.logger.logInfo(`Executing '${shellActionConfig.command}' in shell 'sh'...`);

        // The typings say otherwise, but this will be a ShellString when executing synchronously
        const result: ShellString = (await execAsync(shellActionConfig.command, options)) as ShellString;
        if (result.code) {
            this.logger.logInfo(`code: ${result.code}; stdout: ${result.stdout}; stderr: ${result.stderr}`);
        } else {
            this.logger.logInfo("command executed");
        }
    }
}
