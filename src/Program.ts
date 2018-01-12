import * as commandLineArgs from "command-line-args";
import { OptionDefinition } from "command-line-args";
import * as path from "path";
import { CnctConfig } from "./CnctConfig";
import { CnctConfigLoader } from "./CnctConfigLoader";

export type ProgramOptions = {
    config: string,
};

export class Program {
    public static cliOptions: ProgramOptions;

    private static readonly cliOptionDefinitions: OptionDefinition[] = [
        { name: "config", alias: "c", type: String },
    ];

    private readonly configLoader: CnctConfigLoader;

    public get options(): ProgramOptions {
        return Program.cliOptions;
    }

    public constructor(
        argv: string[],
        configLoader?: CnctConfigLoader,
    ) {
        const options: ProgramOptions = commandLineArgs(Program.cliOptionDefinitions, { argv }) as ProgramOptions;
        if (!options.config) {
            options.config = `${process.cwd()}${path.sep}cnct.json`;
        }

        Program.cliOptions = options;

        if (configLoader) {
            this.configLoader = configLoader;
        } else {
            this.configLoader = new CnctConfigLoader(this.options.config);
        }
    }

    public async runAsync(): Promise<void> {
        const cnctConfig: CnctConfig = await this.configLoader.loadConfigAsync();

        cnctConfig.validate();
        cnctConfig.execute();
    }
}
