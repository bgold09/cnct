import { CnctConfig } from "./CnctConfig";
import { CnctConfigLoader } from "./CnctConfigLoader";

export class Program {
    private readonly configPath: string;
    private readonly configLoader: CnctConfigLoader;

    public constructor(
        argv: string[],
        configLoader?: CnctConfigLoader,
    ) {
        // For now, naively assume the third arg is the config file path
        this.configPath = argv[2];

        if (configLoader) {
            this.configLoader = configLoader;
        } else {
            this.configLoader = new CnctConfigLoader(this.configPath);
        }
    }

    public async runAsync(): Promise<void> {
        const cnctConfig: CnctConfig = await this.configLoader.loadConfigAsync();

        cnctConfig.validate();
        cnctConfig.execute();
    }
}
