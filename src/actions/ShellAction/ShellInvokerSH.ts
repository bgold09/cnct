import { IShellInvoker } from "./IShellInvoker";

export class ShellInvokerSH implements IShellInvoker {
    public async invokeShellAsync(): Promise<void> {
        return Promise.resolve();
    }
}
