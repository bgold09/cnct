import { type } from "os";

export type OperatingSystemType = "Darwin" | "Linux" | "Windows_NT";

export function getOperatingSystemType() : OperatingSystemType{
    return type() as OperatingSystemType;
}

export function toFriendlyOperatingSystemName(osType: OperatingSystemType): string {
    switch (osType) {
        case "Windows_NT":
            return "Windows";

        case "Linux":
            return "Linux";

        case "Darwin":
            return "OSX";

        default:
            throw new RangeError();
    }
}
