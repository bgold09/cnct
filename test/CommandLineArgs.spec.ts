/* tslint:disable:no-import-side-effect */
import { expect } from "chai";
import "mocha";
import * as path from "path";
import { CommandLineArgs } from "../src/CommandLineArgs";

describe("CommandLineArgs", () => {

    it("parses command line args for config file path", () => {
        const expectedConfigPath: string = "cnct.json";
        const argv: string[] = `--config ${expectedConfigPath}`.split(" ");

        const cliArgs: CommandLineArgs = new CommandLineArgs(argv);

        expect(cliArgs.options.config).to.equal(expectedConfigPath);
    });

    it("parses command line args if no config file path is supplied", () => {
        const argv: string[] = [ ];

        const cliArgs: CommandLineArgs = new CommandLineArgs(argv);

        expect(cliArgs.options.config).to.equal(`${process.cwd()}${path.sep}cnct.json`);
    });

    it("parses command line args if no config file path is supplied", () => {
        const argv: string[] = "--quiet --verbose".split(" ");

        const cliArgs: CommandLineArgs = new CommandLineArgs(argv);

        expect(cliArgs.options.quiet).to.equal(true, "quiet should have been set");
        expect(cliArgs.options.verbose).to.equal(false, "verbose should not have been set");
    });

});
