import { IShellActionConfig } from "./IShellActionConfig";

export interface IShellInvoker {
    invokeShellAsync(shellActionConfig: IShellActionConfig): Promise<void>;
}
