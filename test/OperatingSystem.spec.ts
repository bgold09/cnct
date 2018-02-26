/* tslint:disable:no-import-side-effect */
import { expect } from "chai";
import "mocha";
import { platform } from "os";
import { CURRENT_OS_TYPE, fromOperatingSystemString, OperatingSystemType } from "../src/OperatingSystem";

function getExpectedOSType(): OperatingSystemType {
    switch (platform()) {
        case "win32":
            return "windows";

        case "linux":
            return "linux";

        case "darwin":
            return "osx";

        default:
            throw new RangeError();
    }
}

describe("OperatingSystem", () => {

    it("getOperatingSystemType for supported OS", () => {
        const expectedOSType: OperatingSystemType = getExpectedOSType();
        const actualOSType: OperatingSystemType = CURRENT_OS_TYPE;
        expect(actualOSType).to.equal(expectedOSType);
    });

    it("fromOperatingSystemString for supported OS", () => {
        const expectedOSType: OperatingSystemType = getExpectedOSType();
        const actualOSType: OperatingSystemType = fromOperatingSystemString(expectedOSType.toLocaleUpperCase());

        expect(actualOSType).to.equal(expectedOSType);
    });

    it("fromOperatingSystemString for unsupported or unknown OS", () => {
        expect(() => fromOperatingSystemString("some random OS")).to.throw(RangeError);
    });
});
