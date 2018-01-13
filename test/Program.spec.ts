/* tslint:disable:no-import-side-effect */
import { expect, use } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import "mocha";
import * as TypeMoq from "typemoq";
import { CnctConfig } from "../src/CnctConfig/CnctConfig";
import { CnctConfigLoader } from "../src/CnctConfig/CnctConfigLoader";
import { ILogger } from "../src/Logger/ILogger";
import { Program } from "../src/Program";

before(() => {
    use(chaiAsPromised);
});

describe("Program", () => {

    it("validates and executes on run", async () => {
        const expectedFilePath: string = "somepath";

        /* tslint:disable:typedef */
        const configMock: TypeMoq.IMock<CnctConfig> = TypeMoq.Mock.ofType(CnctConfig, TypeMoq.MockBehavior.Strict);
        configMock.setup(m => m.validate()).verifiable(TypeMoq.Times.once());
        configMock.setup(m => m.execute()).verifiable(TypeMoq.Times.once());

        const configLoaderMock: TypeMoq.IMock<CnctConfigLoader> = TypeMoq.Mock.ofType(CnctConfigLoader);
        configLoaderMock.setup(async m => m.loadConfigAsync())
            .returns(async () => Promise.resolve(configMock.object))
            .verifiable(TypeMoq.Times.once());
        /* tslint:enable:typedef */

        const program: Program = new Program([ "", "", expectedFilePath ], configLoaderMock.object);
        await program.runAsync();

        configLoaderMock.verifyAll();
        configMock.verifyAll();
    });

    it("does not execute if validation fails", async () => {
        const expectedFilePath: string = "somepath";
        const expectedError: Error = new Error("some validation error");

        /* tslint:disable:typedef */
        const configMock: TypeMoq.IMock<CnctConfig> = TypeMoq.Mock.ofType(CnctConfig, TypeMoq.MockBehavior.Strict);
        configMock.setup(m => m.validate())
            .throws(expectedError)
            .verifiable(TypeMoq.Times.once());
        configMock.setup(m => m.execute()).verifiable(TypeMoq.Times.never());

        const configLoaderMock: TypeMoq.IMock<CnctConfigLoader> = TypeMoq.Mock.ofType(CnctConfigLoader);
        configLoaderMock.setup(async m => m.loadConfigAsync())
            .returns(async () => Promise.resolve(configMock.object))
            .verifiable(TypeMoq.Times.once());
        /* tslint:enable:typedef */

        const program: Program = new Program([ "", "", expectedFilePath ], configLoaderMock.object);
        // tslint:disable-next-line:await-promise
        await expect(program.runAsync()).to.be.rejectedWith(expectedError);

        configLoaderMock.verifyAll();
        configMock.verifyAll();
    });

    it("displays help content", async () => {
        // tslint:disable:typedef
        const loggerMock = TypeMoq.Mock.ofType<ILogger>(undefined, TypeMoq.MockBehavior.Strict);
        loggerMock.setup(m => m.logInfo(TypeMoq.It.isAnyString())).verifiable(TypeMoq.Times.once());

        const configLoaderMock = TypeMoq.Mock.ofType(CnctConfigLoader, TypeMoq.MockBehavior.Strict);
        configLoaderMock.setup(async (m) => m.loadConfigAsync()).verifiable(TypeMoq.Times.never());
        // tslint:enable:typedef

        const program: Program = new Program([], configLoaderMock.object, loggerMock.object);
        program.options.help = true;

        await program.runAsync();

        loggerMock.verifyAll();
        configLoaderMock.verifyAll();
    });

});
