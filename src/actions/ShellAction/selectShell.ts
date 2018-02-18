import * as os from "os";
import { OperatingSystemType } from "../../OperatingSystem";
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
            const osType: OperatingSystemType = os.type() as OperatingSystemType;
            return (osType === "Windows_NT")      // tslint:disable-line:newline-before-return
                ? new ShellInvokerPowerShell()
                : new ShellInvokerSH();

        default:
            throw new RangeError(`Unsupported shell type '${shellType}'`);
    }
}
