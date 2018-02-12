import { CnctConfig } from "./CnctConfig/CnctConfig";
import { CnctConfigLoader } from "./CnctConfig/CnctConfigLoader";
import { CommandLineArgs, ProgramOptions } from "./CommandLineArgs";
import { ConsoleLogger } from "./Logger/ConsoleLogger";
import { ILogger } from "./Logger/ILogger";

export class Program {
    public static cliOptions: ProgramOptions;

    public readonly cliArgs: CommandLineArgs;
    private readonly configLoader: CnctConfigLoader;

    public get options(): ProgramOptions {
        return Program.cliOptions;
    }

    public constructor(
        argv: string[],
        configLoader?: CnctConfigLoader,
        private readonly logger: ILogger = new ConsoleLogger(),
    ) {
        const cliArgs: CommandLineArgs = new CommandLineArgs(argv);
        this.cliArgs = cliArgs;
        Program.cliOptions = cliArgs.options;

        if (configLoader) {
            this.configLoader = configLoader;
        } else {
            this.configLoader = new CnctConfigLoader(this.options.config);
        }
    }

    public async runAsync(): Promise<void> {
        if (this.options.help) {
            const usage: string = this.cliArgs.usage;
            this.options.quiet = false;
            this.logger.logInfo(usage);

            return;
        }

        if (this.options.version) {
            this.displayVersionInformation();

            return;
        }

        const cnctConfig: CnctConfig = await this.configLoader.loadConfigAsync();

        cnctConfig.validate();
        cnctConfig.execute();
    }

    private displayVersionInformation(): void {
        this.logger.logInfo("cnct v0.1.0");
    }
}
