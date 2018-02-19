import { IShellActionConfig } from "./IShellActionConfig";

export interface IShellInvoker {
    invokeShell(shellActionConfig: IShellActionConfig): void;
}
