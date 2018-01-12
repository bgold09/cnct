/* tslint:disable:no-import-side-effect typedef */
import { expect, use } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import "mocha";
import * as path from "path";
import * as TypeMoq from "typemoq";
import { CnctConfig } from "../src/CnctConfig/CnctConfig";
import { CnctConfigLoader } from "../src/CnctConfig/CnctConfigLoader";
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
        configLoaderMock.setup(async m => m.loadConfigAsync())
            .returns(async () => Promise.resolve(configMock.object))
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
        configLoaderMock.setup(async m => m.loadConfigAsync())
            .returns(async () => Promise.resolve(configMock.object))
            .verifiable(TypeMoq.Times.once());

        const program: Program = new Program([ "", "", expectedFilePath ], configLoaderMock.object);
        // tslint:disable-next-line:await-promise
        await expect(program.runAsync()).to.be.rejectedWith(expectedError);

        configLoaderMock.verifyAll();
        configMock.verifyAll();
    });

    it("parses command line args for config file path", () => {
        const expectedConfigPath: string = "cnct.json";
        const argv: string[] = `--config ${expectedConfigPath}`.split(" ");

        const program: Program = new Program(argv);

        expect(program.options.config).to.equal(expectedConfigPath);
    });

    it("parses command line args if no config file path is supplied", () => {
        const argv: string[] = [ ];

        const program: Program = new Program(argv);

        expect(program.options.config).to.equal(`${process.cwd()}${path.sep}cnct.json`);
    });

    it("parses command line args if no config file path is supplied", () => {
        const argv: string[] = "--quiet --verbose".split(" ");

        const program: Program = new Program(argv);

        expect(program.options.quiet).to.equal(true, "quiet should have been set");
        expect(program.options.verbose).to.equal(false, "verbose should not have been set");
    });

});
