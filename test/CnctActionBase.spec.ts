/* tslint:disable:no-import-side-effect */
import { expect } from "chai";
import { deserialize } from "class-transformer";
import "mocha";
import { CnctActionBase } from "../src/actions/CnctActionBase";
import { ILogger } from "../src/Logger/ILogger";
import { CURRENT_OS_TYPE, OperatingSystemType } from "../src/OperatingSystem";

class TestAction extends CnctActionBase {
    public constructor(logger?: ILogger) {
        super("test", logger);
    }

    public validate(): void {
        // do nothing
    }
}

describe("CnctActionBase", () => {

    it("executes when no OS type is set", () => {
        const testAction: TestAction = new TestAction();
        const actual: boolean = testAction.shouldExecute();
        expect(actual).to.equal(true, "Action should execute");
    });

    it("executes for current OS type", () => {
        const testAction: TestAction = new TestAction();
        testAction.os = CURRENT_OS_TYPE;

        const actual: boolean = testAction.shouldExecute();

        expect(actual).to.equal(true, "Action should execute");
    });

    it("does not execute if current OS type excluded", () => {
        const osType: OperatingSystemType = CURRENT_OS_TYPE === "windows"
            ? "linux"
            : "windows";

        const testAction: TestAction = new TestAction();
        testAction.os = osType;

        const actual: boolean = testAction.shouldExecute();

        expect(actual).to.equal(false, "Action should not execute");
    });

    it("can deserialize", () => {
        const expectedOS: OperatingSystemType = CURRENT_OS_TYPE;
        // tslint:disable-next-line:no-multiline-string
        const json: string = `
{
  "os": "${expectedOS}",
  "actionType": "test"
}`;

        const expectedAction: TestAction = new TestAction();
        expectedAction.os = expectedOS;

        const actualAction: TestAction = deserialize(TestAction, json);
        expect(actualAction).to.deep.equal(expectedAction);
    });

});
