import * as os from "os";
import { OperatingSystemType } from "../../OperatingSystem";
import { ShellType } from "./IShellActionConfig";
import { IShellInvoker } from "./IShellInvoker";
import { ShellInvokerBash } from "./ShellInvokerBash";
import { ShellInvokerPowerShell } from "./ShellInvokerPowerShell";

export function selectShell(shellType: ShellType | undefined): IShellInvoker {
    switch (shellType) {
        case "powershell":
            return new ShellInvokerPowerShell();

        case "bash":
            return new ShellInvokerBash();

        case undefined:
            const osType: OperatingSystemType = os.type() as OperatingSystemType;
            return (osType === "Windows_NT")      // tslint:disable-line:newline-before-return
                ? new ShellInvokerPowerShell()
                : new ShellInvokerBash();

        default:
            throw new RangeError(`Unsupported shell type '${shellType}'`);
    }
}
