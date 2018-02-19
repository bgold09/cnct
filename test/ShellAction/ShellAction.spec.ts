// tslint:disable:no-import-side-effect
import { expect } from "chai";
import { deserialize } from "class-transformer";
import "mocha";
import { IShellActionConfig, ShellType } from "../../src/actions/ShellAction/IShellActionConfig";
import { ShellAction } from "../../src/actions/ShellAction/ShellAction";

describe("ShellAction", () => {

  it("can deserialize action", () => {
    const expectedCommand: string = "some command --param arg";
    const expectedShell: ShellType = "bash";
    const expectedDescription: string = "some description";
    const expectedShellConfig: IShellActionConfig = {
        shell: expectedShell,
        command: expectedCommand,
        description: expectedDescription,
    };

    const expectedShellAction: ShellAction = new ShellAction(expectedShellConfig);

    // tslint:disable-next-line:no-multiline-string
    const json: string = `
{
  "command": "${expectedCommand}",
  "shell": "${expectedShell}",
  "description": "${expectedDescription}",
  "actionType": "shell"
}`;

    const actualShellAction: ShellAction = deserialize(ShellAction, json);
    expect(actualShellAction).to.deep.equal(expectedShellAction);
  });

});
