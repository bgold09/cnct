// tslint:disable:no-import-side-effect
import { expect } from "chai";
import "mocha";
import { ShellType } from "../../src/actions/ShellAction/IShellActionConfig";
import { IShellInvoker } from "../../src/actions/ShellAction/IShellInvoker";
import { selectShell } from "../../src/actions/ShellAction/selectShell";
import { ShellInvokerPowerShell } from "../../src/actions/ShellAction/ShellInvokerPowerShell";
import { ShellInvokerSH } from "../../src/actions/ShellAction/ShellInvokerSH";
import { getOperatingSystemType, OperatingSystemType } from "../../src/OperatingSystem";

describe("selectShell", () => {

    it("selects PowerShell invoker", () => {
        const shellType: ShellType = "powershell";
        const shellInvoker: IShellInvoker = selectShell(shellType);
        expect(shellInvoker).to.be.instanceOf(ShellInvokerPowerShell);
    });

    it("selects bash invoker", () => {
        const shellType: ShellType = "sh";
        const shellInvoker: IShellInvoker = selectShell(shellType);
        expect(shellInvoker).to.be.instanceOf(ShellInvokerSH);
    });

    it("selects default OS invoker", () => {
        const shellInvoker: IShellInvoker = selectShell(undefined);
        const osType: OperatingSystemType = getOperatingSystemType();
        let actualShellInvoker: Object;
        if (osType === "windows") {
            actualShellInvoker = ShellInvokerPowerShell;
        } else {
            actualShellInvoker = ShellInvokerSH;
        }

        expect(shellInvoker).to.be.instanceOf(actualShellInvoker);
    });

});
