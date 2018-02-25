import { type } from "os";

export type OperatingSystemType = "linux" | "windows" | "osx";

export function getOperatingSystemType() : OperatingSystemType {
    const osType: string = type();
    switch (osType) {
        case "Windows_NT":
            return "windows";

        case "Linux":
            return "linux";

        case "Darwin":
            return "osx";

        default:
            throw new RangeError(`Unrecognized operating system type '${osType}`);
    }
}

export function fromOperatingSystemString(osType: string) : OperatingSystemType {
    const convertedOSType: OperatingSystemType = osType.toLowerCase() as OperatingSystemType;
    if (convertedOSType === "windows" || convertedOSType === "linux" || convertedOSType === "osx") {
        return convertedOSType;
    } else {
        throw new RangeError(`Unrecognized operating system type '${osType}`);
    }
}
