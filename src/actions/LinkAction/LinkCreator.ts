import * as fs from "fs";
import rimraf = require("rimraf");
import { ILinkCreationConfig } from "./ILinkCreationConfig";
import { ILinkCreator } from "./ILinkCreator";

export class LinkCreator implements ILinkCreator {
    public createLink(target: string, link: string, linkCreationConfig: ILinkCreationConfig): void {

        if (!fs.existsSync(target)) {
            throw new Error(`The target file '${target}' could not be found.`);
        }

        const destinationExists: boolean = fs.existsSync(link);
        if (destinationExists && !linkCreationConfig.force) {
            throw new Error(
                `The destination file or directory '${link}' exists and the force parameter was not provided.`);
        }

        const targetFileInfo: fs.Stats = fs.lstatSync(target);
        if (targetFileInfo.isDirectory()) {
            LinkCreator.createDirectoryLink(target, link, destinationExists);
        } else if (targetFileInfo.isFile()) {
            LinkCreator.createFileLink(target, link, destinationExists);
        } else {
            throw new RangeError(`Could not create link to '{target}'; it is not a file or directory.`);
        }
    }

    private static createFileLink(target: string, link: string, destinationExists: boolean): void {
        if (destinationExists) {
            fs.unlinkSync(link);
        }

        fs.symlinkSync(target, link, "file");
    }

    private static createDirectoryLink(target: string, link: string, destinationExists: boolean): void {
        if (destinationExists) {
            rimraf(link, (error) => {
                throw error;
            });
        }

        fs.symlinkSync(target, link, "directory");
    }
}
