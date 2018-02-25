/* tslint:disable:no-import-side-effect */
import "mocha";
import * as TypeMoq from "typemoq";
import { CnctActionBase } from "../src/actions/CnctActionBase";
import { ILogger } from "../src/Logger/ILogger";

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

});

class TestLogger implements ILogger {
    public logInfo(message: string): void {
        console.log(message);
    }

    public logError(message: string): void {
        console.error(message);
    }

    public logDebug(message: string): void {
        console.log(message);
    }
}

class TestAction extends CnctActionBase {
    public constructor(logger: ILogger = new TestLogger()) {
        super("test", logger);
    }

    public validate(): void {
        // do nothing
    }
}
