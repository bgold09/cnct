import { Exclude, Expose } from "class-transformer";
import * as os from "os";
import * as path from "path";
import { ConsoleLogger } from "../../Logger/ConsoleLogger";
import { ILogger } from "../../Logger/ILogger";
import { OperatingSystemType } from "../../OperatingSystem";
import { CnctActionBase } from "../CnctActionBase";
import { ILinkCreationConfig } from "./ILinkCreationConfig";
import { ILinkCreator } from "./ILinkCreator";
import { LinkCreator } from "./LinkCreator";

type DestinationLinksSignature = string | string[] | null;

type LinksPropertySignature = {
    [index: string]: DestinationLinksSignature | PlatformLinks;
};

type PlatformLinks = {
    global?: DestinationLinksSignature;
    linux?: DestinationLinksSignature;
    osx?: DestinationLinksSignature;
    windows?: DestinationLinksSignature;
};

type PlatformSpecificLinks = {
    [index in OperatingSystemType]: Map<string, string[]>
};

@Exclude()
export class LinkAction extends CnctActionBase {
    public static readonly linkActionType: string = "link";

    public constructor(
        private platformAgnosticLinks: Map<string, string[]> = new Map<string, string[]>(),
        private readonly platformLinks: PlatformSpecificLinks = {
            Windows_NT: new Map<string, string[]>(),
            Linux: new Map<string, string[]>(),
            Darwin: new Map<string, string[]>(),
        },
        public readonly linkCreationConfig: ILinkCreationConfig = {},
        private readonly linkCreator: ILinkCreator = new LinkCreator(),
        logger: ILogger = new ConsoleLogger(),
    ) {
        super(LinkAction.linkActionType, logger);
    }

    @Expose()
    public set force(force: boolean) {
        this.linkCreationConfig.force = force;
    }

    @Expose()
    public set links(value: LinksPropertySignature) {
        Object.keys(value).forEach((key: string) => {

            const destinations: DestinationLinksSignature | PlatformLinks = value[key];
            if (typeof destinations === "string") {
                this.platformAgnosticLinks.set(key, [ destinations ]);
            } else if (Array.isArray(destinations)) {
                this.platformAgnosticLinks.set(key, destinations);
            } else if (destinations === null) {
                this.platformAgnosticLinks.set(key, [ LinkAction.convertTargetForNull(key) ]);
            } else {
                LinkAction.parseLinkAssociations(key, destinations.linux, this.platformLinks.Linux);
                LinkAction.parseLinkAssociations(key, destinations.windows, this.platformLinks.Windows_NT);
                LinkAction.parseLinkAssociations(key, destinations.osx, this.platformLinks.Darwin);
                LinkAction.parseLinkAssociations(key, destinations.global, this.platformAgnosticLinks);
            }
        });
    }

    public async execute(): Promise<void> {
        super.execute();

        this.createLinks(this.platformAgnosticLinks);

        const osType: OperatingSystemType = os.type() as OperatingSystemType;
        const platformLinks: Map<string, string[]> | undefined = this.platformLinks[osType];
        if (platformLinks) {
            this.createLinks(platformLinks);
        }
    }

    public validate(): void {
        const currentPlatformLinks: Map<string, string[]> = this.platformLinks[os.type() as OperatingSystemType];
        if (this.platformAgnosticLinks.size === 0 && currentPlatformLinks.size === 0) {
            throw new RangeError("There must be at least one target path to create links for.");
        }

        const badTargets: string[] = [];
        Array.prototype.push.apply(badTargets, LinkAction.findBadTargets(this.platformAgnosticLinks));
        Array.prototype.push.apply(badTargets, LinkAction.findBadTargets(currentPlatformLinks));

        if (badTargets.length > 0) {
            const targetNames: string = badTargets.join(", ");
            throw new RangeError(
                `The following link targets have no destination links associated with them: ${targetNames}`);
        }
    }

    private static parseLinkAssociations(
        key: string,
        destinations: DestinationLinksSignature | undefined,
        linkAssociations: Map<string, string[]>): void {

        let links: string[];
        if (destinations === undefined) {
            links = [];
        } else if (typeof destinations === "string") {
            links = [ destinations ];
        } else if (destinations === null) {
            links = [ LinkAction.convertTargetForNull(key) ];
        } else {
            links = destinations;
        }

        if (links.length > 0) {
            linkAssociations.set(key, links);
        }
    }

    private static convertTargetForNull(target: string): string {
        const targetBaseName: string = path.basename(target);
        const dest: string = (targetBaseName.startsWith(".")) ? targetBaseName : `.${targetBaseName}`;

        return `~${path.sep}${dest}`;
    }

    private static findBadTargets(links: Map<string, string[]>): string[] {
        const badTargets: string[] = [];
        links.forEach((destinationPaths: string[], targetPath: string) => {
            if (destinationPaths.length === 0) {
                badTargets.push(`'${targetPath}'`);
            }
        });

        return badTargets;
    }

    private createLinks(links: Map<string, string[]>): void {
        links.forEach((destinationPaths: string[], targetPath: string) => {
            destinationPaths.forEach(async (destinationPath: string) => {
                this.logger.logInfo(`  [LINK] ${targetPath} -> ${destinationPath}`);
                await this.linkCreator.createLinkAsync(targetPath, destinationPath, this.linkCreationConfig);
            });
        });
    }
}
