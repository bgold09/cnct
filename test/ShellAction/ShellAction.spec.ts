// tslint:disable:no-import-side-effect
import { expect } from "chai";
import { deserialize } from "class-transformer";
import "mocha";
import { IShellActionConfig, ShellType } from "../../src/actions/ShellAction/IShellActionConfig";
import { ShellAction } from "../../src/actions/ShellAction/ShellAction";

describe("ShellAction", () => {

  it("can deserialize action", () => {
    const expectedCommand: string = "some command --param arg";
    const expectedShell: ShellType = "sh";
    const expectedSilent: boolean = true;
    const expectedDescription: string = "some description";
    const expectedShellConfig: IShellActionConfig = {
        shell: expectedShell,
        command: expectedCommand,
        description: expectedDescription,
        silent: expectedSilent,
    };

    const expectedShellAction: ShellAction = new ShellAction(expectedShellConfig);

    // tslint:disable-next-line:no-multiline-string
    const json: string = `
{
  "command": "${expectedCommand}",
  "shell": "${expectedShell}",
  "silent": ${expectedSilent},
  "description": "${expectedDescription}",
  "actionType": "shell"
}`;

    const actualShellAction: ShellAction = deserialize(ShellAction, json);
    expect(actualShellAction).to.deep.equal(expectedShellAction);
  });

  it("throws for empty command", () => {
    const shellAction: ShellAction = new ShellAction({ command: "" });
    expect(() => shellAction.validate()).to.throw(RangeError, "Shell command cannot be empty.");
  });

});
