// tslint:disable:no-import-side-effect
import { expect } from "chai";
import "mocha";
import * as os from "os";
import { ShellType } from "../../src/actions/ShellAction/IShellActionConfig";
import { IShellInvoker } from "../../src/actions/ShellAction/IShellInvoker";
import { selectShell } from "../../src/actions/ShellAction/selectShell";
import { ShellInvokerBash } from "../../src/actions/ShellAction/ShellInvokerBash";
import { ShellInvokerPowerShell } from "../../src/actions/ShellAction/ShellInvokerPowerShell";
import { OperatingSystemType } from "../../src/OperatingSystem";

describe("selectShell", () => {

    it("selects PowerShell invoker", () => {
        const shellType: ShellType = "powershell";
        const shellInvoker: IShellInvoker = selectShell(shellType);
        expect(shellInvoker).to.be.instanceOf(ShellInvokerPowerShell);
    });

    it("selects bash invoker", () => {
        const shellType: ShellType = "bash";
        const shellInvoker: IShellInvoker = selectShell(shellType);
        expect(shellInvoker).to.be.instanceOf(ShellInvokerBash);
    });

    it("selects default OS invoker", () => {
        const shellInvoker: IShellInvoker = selectShell(undefined);
        const osType: OperatingSystemType = os.type() as OperatingSystemType;
        let actualShellInvoker: Object;
        if (osType === "Windows_NT") {
            actualShellInvoker = ShellInvokerPowerShell;
        } else {
            actualShellInvoker = ShellInvokerBash;
        }

        expect(shellInvoker).to.be.instanceOf(actualShellInvoker);
    });

});
