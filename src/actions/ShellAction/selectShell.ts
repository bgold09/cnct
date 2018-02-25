import { CURRENT_OS_TYPE } from "../../OperatingSystem";
import { ShellType } from "./IShellActionConfig";
import { IShellInvoker } from "./IShellInvoker";
import { ShellInvokerPowerShell } from "./ShellInvokerPowerShell";
import { ShellInvokerSH } from "./ShellInvokerSH";

export function selectShell(shellType: ShellType | undefined): IShellInvoker {
    switch (shellType) {
        case "powershell":
            return new ShellInvokerPowerShell();

        case "sh":
            return new ShellInvokerSH();

        case undefined:
            return (CURRENT_OS_TYPE === "windows")
                ? new ShellInvokerPowerShell()
                : new ShellInvokerSH();

        default:
            throw new RangeError(`Unsupported shell type '${shellType}'`);
    }
}
