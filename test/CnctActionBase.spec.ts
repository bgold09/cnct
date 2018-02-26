/* tslint:disable:no-import-side-effect */
import { expect } from "chai";
import { deserialize } from "class-transformer";
import "mocha";
import * as TypeMoq from "typemoq";
import { CnctActionBase } from "../src/actions/CnctActionBase";
import { ILogger } from "../src/Logger/ILogger";
import { getOperatingSystemType, OperatingSystemType } from "../src/OperatingSystem";

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
        // tslint:disable:typedef
        const loggerMock = TypeMoq.Mock.ofType<ILogger>();
        loggerMock.setup(m => m.logInfo(TypeMoq.It.isAnyString())).verifiable(TypeMoq.Times.once());
        // tslint:enable:typedef

        const testAction: TestAction = new TestAction(loggerMock.object);

        testAction.execute();

        loggerMock.verifyAll();
    });

    it("can deserialize", () => {
        const expectedOS: OperatingSystemType = getOperatingSystemType();
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
