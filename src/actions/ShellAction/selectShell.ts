import { getOperatingSystemType } from "../../OperatingSystem";
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
            return (getOperatingSystemType() === "windows")
                ? new ShellInvokerPowerShell()
                : new ShellInvokerSH();

        default:
            throw new RangeError(`Unsupported shell type '${shellType}'`);
    }
}
