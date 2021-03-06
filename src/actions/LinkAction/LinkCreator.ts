import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as rimraf from "rimraf";
import { lstatAsync, symlinkAsync, unlinkAsync } from "../../nodeAsync/fsAsync";
import { ILinkCreationConfig } from "./ILinkCreationConfig";
import { ILinkCreator } from "./ILinkCreator";

export class LinkCreator implements ILinkCreator {

    public async createLinkAsync(target: string, link: string, linkCreationConfig: ILinkCreationConfig): Promise<void> {
        target = LinkCreator.normalizePath(target);
        link = LinkCreator.normalizePath(link);

        let destinationExists: boolean = false;
        let stats: fs.Stats | undefined;
        try {
            stats = await lstatAsync(link);
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
            await LinkCreator.createDirectoryLink(target, link, destinationExists, stats);
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

    private static async createDirectoryLink(
        target: string,
        link: string,
        destinationExists: boolean,
        stats: fs.Stats | undefined): Promise<void> {

        if (destinationExists) {
            if (stats && stats.isSymbolicLink()) {
                await unlinkAsync(link);
            } else {
                rimraf(link, (error: Error) => {
                    throw error;
                });
            }
        }

        await symlinkAsync(target, link, "dir");
    }

    private static normalizePath(filePath: string): string {
        if (path.isAbsolute(filePath)) {
            return filePath;
        }

        if (filePath.startsWith("~")) {
            return `${os.homedir()}/${filePath.substr(1)}`;
        }

        return `${process.cwd()}/${filePath}`;
    }
}
