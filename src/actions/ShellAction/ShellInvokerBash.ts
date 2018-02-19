import { IShellInvoker } from "./IShellInvoker";

export class ShellInvokerBash implements IShellInvoker {
    public async invokeShellAsync(): Promise<void> {
        return Promise.resolve();
    }
}
