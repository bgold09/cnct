import { Exclude, Expose } from "class-transformer";
import { IAction } from "../../IAction";
import { ILinkCreationConfig } from "./ILinkCreationConfig";
import { ILinkCreator } from "./ILinkCreator";
import { LinkCreator } from "./LinkCreator";

@Exclude()
export class LinkAction implements IAction {
    public readonly actionType: string = "link";

    public constructor(
        public readonly linkAssociations: Map<string, string[]> = new Map<string, string[]>(),
        public readonly linkCreationConfig: ILinkCreationConfig = {},
        private readonly linkCreator: ILinkCreator = new LinkCreator(),
    ) {
    }

    @Expose()
    public set force(force: boolean) {
        this.linkCreationConfig.force = force;
    }

    @Expose()
    public set links(value: {}) {
        Object.keys(value).forEach((key) => {
            this.linkAssociations.set(key, value[key]);
        });
    }

    public execute(): void {
        this.linkAssociations.forEach((destinationPaths, targetPath, _) => {
            destinationPaths.forEach((destinationPath: string) => {
                this.linkCreator.createLink(targetPath, destinationPath, this.linkCreationConfig);
            });
        });
    }

    public validate() {
        if (this.linkAssociations.size === 0) {
            throw new RangeError("There must be at least one target path to create links for.");
        }

        const badTargets: string[] = [];
        this.linkAssociations.forEach((destinationPaths, targetPath, _) => {
            if (destinationPaths.length === 0) {
                badTargets.push(`'${targetPath}'`);
            }
        });

        if (badTargets.length > 0) {
            const targetNames = badTargets.join(", ");
            throw new RangeError(
                `The following link targets have no destination links associated with them: ${targetNames}`);
        }
    }
}
