import * as commandLineArgs from "command-line-args";
import { OptionDefinition } from "command-line-args";
import * as path from "path";
import { CnctConfig } from "./CnctConfig";
import { CnctConfigLoader } from "./CnctConfigLoader";

export type ProgramOptions = {
    config: string,
    quiet: boolean,
    verbose: boolean,
};

export class Program {
    public static cliOptions: ProgramOptions;

    private static readonly cliOptionDefinitions: OptionDefinition[] = [
        { alias: "c", name: "config",  type: String },
        { alias: "q", name: "quiet",   type: Boolean },
        { alias: "v", name: "verbose", type: Boolean },
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

        if (options.quiet) {
            // quiet-level logging should override everything else
            options.verbose = false;
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
