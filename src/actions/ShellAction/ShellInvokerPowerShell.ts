import * as NodePowerShell from "node-powershell";
import { ConsoleLogger } from "../../Logger/ConsoleLogger";
import { ILogger } from "../../Logger/ILogger";
import { IShellActionConfig } from "./IShellActionConfig";
import { IShellInvoker } from "./IShellInvoker";

export class ShellInvokerPowerShell implements IShellInvoker {

    public constructor(
        private readonly logger: ILogger = new ConsoleLogger()) {
    }

    public async invokeShellAsync(shellActionConfig: IShellActionConfig): Promise<void> {
        const shell: NodePowerShell = new NodePowerShell({
            debugMsg: false,
            noProfile: true,
        });
        shell.addCommand(shellActionConfig.command);
        this.logger.logDebug(`EXECUTING: ${shell.history}`);
        try {
            await shell.invoke();
        } catch (error) {
            this.logger.logError(`Error: ${error}`);
        } finally {
            shell.dispose();
        }
    }
}
