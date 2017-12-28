import { ILinkCreationConfig } from "./ILinkCreationConfig";

export interface ILinkCreator {
    createLink(target: string, link: string, linkCreationConfig: ILinkCreationConfig): void;
}
