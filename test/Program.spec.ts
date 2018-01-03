/* tslint:disable:no-import-side-effect typedef */
import { expect, use } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import "mocha";
import * as TypeMoq from "typemoq";
import { CnctConfig } from "../src/CnctConfig";
import { CnctConfigLoader } from "../src/CnctConfigLoader";
import { Program } from "../src/Program";

before(() => {
    use(chaiAsPromised);
});

describe("Program", () => {

    it("validates and executes on run", async () => {
        const expectedFilePath: string = "somepath";

        const configMock: TypeMoq.IMock<CnctConfig> = TypeMoq.Mock.ofType(CnctConfig, TypeMoq.MockBehavior.Strict);
        configMock.setup(m => m.validate()).verifiable(TypeMoq.Times.once());
        configMock.setup(m => m.execute()).verifiable(TypeMoq.Times.once());

        const configLoaderMock: TypeMoq.IMock<CnctConfigLoader> = TypeMoq.Mock.ofType(CnctConfigLoader);
        configLoaderMock.setup(m => m.loadConfigAsync())
            .returns(() => Promise.resolve(configMock.object))
            .verifiable(TypeMoq.Times.once());

        const program: Program = new Program([ "", "", expectedFilePath ], configLoaderMock.object);
        await program.runAsync();

        configLoaderMock.verifyAll();
        configMock.verifyAll();
    });

    it("does not execute if validation fails", async () => {
        const expectedFilePath: string = "somepath";
        const expectedError: Error = new Error("some validation error");

        const configMock: TypeMoq.IMock<CnctConfig> = TypeMoq.Mock.ofType(CnctConfig, TypeMoq.MockBehavior.Strict);
        configMock.setup(m => m.validate())
            .throws(expectedError)
            .verifiable(TypeMoq.Times.once());
        configMock.setup(m => m.execute()).verifiable(TypeMoq.Times.never());

        const configLoaderMock: TypeMoq.IMock<CnctConfigLoader> = TypeMoq.Mock.ofType(CnctConfigLoader);
        configLoaderMock.setup(m => m.loadConfigAsync())
            .returns(() => Promise.resolve(configMock.object))
            .verifiable(TypeMoq.Times.once());

        const program: Program = new Program([ "", "", expectedFilePath ], configLoaderMock.object);
        await expect(program.runAsync()).to.be.rejectedWith(expectedError);

        configLoaderMock.verifyAll();
        configMock.verifyAll();
    });

});
