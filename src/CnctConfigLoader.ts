import { plainToClass } from "class-transformer";
import { readFile } from "fs";
import { promisify } from "util";
import { CnctConfig } from "./CnctConfig";

export class CnctConfigLoader {

    public constructor(
        private readonly configFilePath: string,
    ) {
    }

    public async loadConfigAsync(): Promise<CnctConfig> {
        const contents: string = await promisify(readFile)(this.configFilePath, "utf8");
        const config: Object = JSON.parse(contents) as Object;

        return plainToClass(CnctConfig, config);
    }
}
