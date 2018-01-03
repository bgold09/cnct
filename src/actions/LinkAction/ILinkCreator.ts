import { ILinkCreationConfig } from "./ILinkCreationConfig";

export interface ILinkCreator {
    createLinkAsync(target: string, link: string, linkCreationConfig: ILinkCreationConfig): Promise<void>;
}
