/* tslint:disable:no-import-side-effect */
import { expect } from "chai";
import "mocha";
import { type } from "os";
import { fromOperatingSystemString, getOperatingSystemType, OperatingSystemType } from "../src/OperatingSystem";

function getExpectedOSType(): OperatingSystemType {
    switch (type()) {
        case "Windows_NT":
            return "windows";

        case "Linux":
            return "linux";

        case "Darwin":
            return "osx";

        default:
            throw new RangeError();
    }
}

describe("OperatingSystem", () => {

    it("getOperatingSystemType for supported OS", () => {
        const expectedOSType: OperatingSystemType = getExpectedOSType();
        const actualOSType: OperatingSystemType = getOperatingSystemType();
        expect(actualOSType).to.equal(expectedOSType);
    });

    it("fromOperatingSystemString for supported OS", () => {
        const expectedOSType: OperatingSystemType = getExpectedOSType();
        const actualOSType: OperatingSystemType = fromOperatingSystemString(type());

        expect(actualOSType).to.equal(expectedOSType);
    });

    it("fromOperatingSystemString for unsupported or unknown OS", () => {
        expect(() => fromOperatingSystemString("some random OS")).to.throw(RangeError);
    });
});
