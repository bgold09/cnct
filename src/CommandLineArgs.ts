import { OptionDefinition } from "command-line-args";
import * as commandLineArgs from "command-line-args";
import * as cliUsage from "command-line-usage";
import * as path from "path";

export type ProgramOptions = {
    config: string,
    quiet: boolean,
    verbose: boolean,
    help: boolean,
};

export class CommandLineArgs {

    private static readonly cliOptionDefinitions: OptionDefinition[] = [
        {
            name: "config",
            alias: "c",
            type: String,
            defaultValue: `${process.cwd()}${path.sep}cnct.json`,
            description: "Path to a configuration file. If not supplied, a file called 'cnct.json' "
                + "in the current directory will be used, if it can be found."
        },
        {
            name: "quiet",
            alias: "q",
            type: Boolean,
            description: "Suppress all output other than errors."
        },
        {
            name: "verbose",
            alias: "v",
            type: Boolean
        },
        {
            name: "help",
            alias: "h",
            type: Boolean,
            description: "Display this help and exit."
        },
    ];

    // tslint:disable-next-line:typedef
    private static readonly cliUsageSections = [
        {
            header: "cnct",
            content: "A cross-platform bootstrapping tool. Connect your dotfiles / cnct the dots!",
        },
        {
            header: "SYNOPSIS",
            content: "cnct [OPTION]...",
        },
        {
            header: "PARAMETERS",
            optionList: CommandLineArgs.cliOptionDefinitions,
        },
    ];

    public readonly options: ProgramOptions;

    public constructor(
        argv: string[]
    ) {
        const options: ProgramOptions = commandLineArgs(CommandLineArgs.cliOptionDefinitions, { argv }) as ProgramOptions;

        if (options.quiet) {
            // quiet-level logging should override everything else
            options.verbose = false;
        }

        this.options = options;
    }

    public get usage(): string {
        // tslint:disable-next-line:no-unsafe-any
        return cliUsage(CommandLineArgs.cliUsageSections);
    }
}
