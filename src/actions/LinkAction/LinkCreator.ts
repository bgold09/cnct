import * as fs from "fs";
import * as rimraf from "rimraf";
import { lstatAsync, symlinkAsync, unlinkAsync } from "../../nodeAsync/fsAsync";
import { ILinkCreationConfig } from "./ILinkCreationConfig";
import { ILinkCreator } from "./ILinkCreator";

export class LinkCreator implements ILinkCreator {
    public async createLinkAsync(target: string, link: string, linkCreationConfig: ILinkCreationConfig): Promise<void> {
        let destinationExists: boolean = false;
        try {
            await lstatAsync(link);
            destinationExists = true;
        } catch (error) {
            const e: NodeJS.ErrnoException = error as NodeJS.ErrnoException;
            if (!(e && e.code === "ENOENT")) {
                throw error;
            }
        }

        if (destinationExists && !linkCreationConfig.force) {
            throw new Error(
                `The destination file or directory '${link}' exists and the force parameter was not provided.`);
        }

        const targetFileInfo: fs.Stats = await lstatAsync(target);
        if (targetFileInfo.isDirectory()) {
            await LinkCreator.createDirectoryLink(target, link, destinationExists);
        } else if (targetFileInfo.isFile()) {
            await LinkCreator.createFileLink(target, link, destinationExists);
        } else {
            throw new RangeError(`Could not create link to '${target}'; it is not a file or directory.`);
        }
    }

    private static async createFileLink(target: string, link: string, destinationExists: boolean): Promise<void> {
        if (destinationExists) {
            await unlinkAsync(link);
        }

        await symlinkAsync(target, link, "file");
    }

    private static async createDirectoryLink(target: string, link: string, destinationExists: boolean): Promise<void> {
        if (destinationExists) {
            rimraf(link, (error: Error) => {
                throw error;
            });
        }

        await symlinkAsync(target, link, "directory");
    }
}
