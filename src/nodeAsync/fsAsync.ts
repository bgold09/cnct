import * as fs from "fs";
import { promisify } from "util";

export const lstatAsync: (path: string) => Promise<fs.Stats> = promisify(fs.lstat);
export const symlinkAsync: (target: fs.PathLike, path: fs.PathLike, fileType: string) => Promise<void> = promisify(fs.symlink);
export const unlinkAsync: (path: fs.PathLike) => Promise<void> = promisify(fs.unlink);
