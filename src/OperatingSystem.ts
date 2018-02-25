import { type } from "os";

export type OperatingSystemType = "Darwin" | "Linux" | "Windows_NT";

export function getOperatingSystemType() : OperatingSystemType {
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

export function fromFriendlyOperatingSystemName(osType: string) : OperatingSystemType {
        switch (osType.toLowerCase()) {
            case "windows":
                return "Windows_NT";

            case "linux":
                return "Linux";

            case "osx":
                return "Darwin";

            default:
                throw new RangeError(`Unrecognized operating system type '${osType}`);
        }
}
