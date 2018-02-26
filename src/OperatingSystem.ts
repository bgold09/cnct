import { platform } from "os";

export type OperatingSystemType = "linux" | "windows" | "osx";

export const CURRENT_OS_TYPE: OperatingSystemType = getOperatingSystemType();

function getOperatingSystemType() : OperatingSystemType {
    const osType: NodeJS.Platform = platform();
    switch (osType) {
        case "win32":
            return "windows";

        case "linux":
            return "linux";

        case "darwin":
            return "osx";

        default:
            throw new RangeError(`Unrecognized operating system platform '${osType}`);
    }
}

export function fromOperatingSystemString(osType: string) : OperatingSystemType {
    const convertedOSType: OperatingSystemType = osType.toLowerCase() as OperatingSystemType;
    if (convertedOSType === "windows" || convertedOSType === "linux" || convertedOSType === "osx") {
        return convertedOSType;
    } else {
        throw new RangeError(`Unrecognized operating system type '${osType}'`);
    }
}
