// tslint:disable:no-import-side-effect
import { expect } from "chai";
import { deserialize } from "class-transformer";
import "mocha";
import * as path from "path";
import * as TypeMoq from "typemoq";
import { ILinkCreationConfig } from "../src/actions/LinkAction/ILinkCreationConfig";
import { ILinkCreator } from "../src/actions/LinkAction/ILinkCreator";
import { LinkAction } from "../src/actions/LinkAction/LinkAction";
import { ILogger } from "../src/Logger/ILogger";
import { CURRENT_OS_TYPE } from "../src/OperatingSystem";

describe("LinkAction", () => {

  it("should create links", async () => {
    const expectedLinks: Map<string, string[]> = new Map<string, string[]>();
    expectedLinks.set("key1", [ "path1" ]);
    expectedLinks.set("key2", [ "path2", "path3" ]);

    const expectedLinkConfig: ILinkCreationConfig = {
      force: true,
    };

    /* tslint:disable:typedef */
    const loggerMock = TypeMoq.Mock.ofType<ILogger>();
    loggerMock.setup(m => m.logInfo(TypeMoq.It.is(s => s.startsWith("  [LINK]")))).verifiable(TypeMoq.Times.exactly(3));

    const linkCreatorMock = TypeMoq.Mock.ofType<ILinkCreator>(undefined, TypeMoq.MockBehavior.Strict);
    expectedLinks.forEach((destinationPaths: string[], targetPath: string) => {
      for (const destinationPath of destinationPaths) {
        linkCreatorMock.setup(
          async m => m.createLinkAsync(
            targetPath,
            destinationPath,
            TypeMoq.It.isObjectWith<ILinkCreationConfig>(expectedLinkConfig)))
          .returns(async () => Promise.resolve())
          .verifiable(TypeMoq.Times.once());
      }
    });
    /* tslint:enable:typedef */

    const linkAction: LinkAction = new LinkAction(expectedLinks, undefined, expectedLinkConfig, linkCreatorMock.object, loggerMock.object);
    await linkAction.execute();

    linkCreatorMock.verifyAll();
    loggerMock.verifyAll();
  });

  it("should create platform-specific destination links", async () => {
    const expectedLinksLinux: Map<string, string[]> = new Map<string, string[]>();
    expectedLinksLinux.set("key1", [ "path1" ]);

    const expectedLinksWindows: Map<string, string[]> = new Map<string, string[]>();
    expectedLinksWindows.set("key1", [ "path3" ]);

    const expectedLinksOsx: Map<string, string[]> = new Map<string, string[]>();
    expectedLinksOsx.set("key3", [ "path5" ]);

    const expectedLinksGlobal: Map<string, string[]> = new Map<string, string[]>();
    expectedLinksGlobal.set("key3", [ "path4", "path6" ]);

    const expectedLinkConfig: ILinkCreationConfig = {
      force: true,
    };

    // tslint:disable-next-line:typedef
    const platformLinks = {
      linux: expectedLinksLinux,
      windows: expectedLinksWindows,
      osx: expectedLinksOsx,
    };

    /* tslint:disable:typedef */
    const loggerMock = TypeMoq.Mock.ofType<ILogger>();
    loggerMock.setup(m => m.logInfo(TypeMoq.It.is(s => s.startsWith("  [LINK]")))).verifiable(TypeMoq.Times.exactly(3));

    const expectedOSLinks: Map<string, string[]> = platformLinks[CURRENT_OS_TYPE];

    const linkCreatorMock = TypeMoq.Mock.ofType<ILinkCreator>(undefined, TypeMoq.MockBehavior.Strict);
    expectedOSLinks.forEach((destinationPaths: string[], targetPath: string) => {
      for (const destinationPath of destinationPaths) {
        linkCreatorMock.setup(
          async m => m.createLinkAsync(
            targetPath,
            destinationPath,
            TypeMoq.It.isObjectWith<ILinkCreationConfig>(expectedLinkConfig)))
          .returns(async () => Promise.resolve())
          .verifiable(TypeMoq.Times.once());
      }
    });

    expectedLinksGlobal.forEach((destinationPaths: string[], targetPath: string) => {
      for (const destinationPath of destinationPaths) {
        linkCreatorMock.setup(
          async m => m.createLinkAsync(
            targetPath,
            destinationPath,
            TypeMoq.It.isObjectWith<ILinkCreationConfig>(expectedLinkConfig)))
          .returns(async () => Promise.resolve())
          .verifiable(TypeMoq.Times.once());
      }
    });
    /* tslint:enable:typedef */

    const linkAction: LinkAction = new LinkAction(
      expectedLinksGlobal,
      platformLinks,
      expectedLinkConfig,
      linkCreatorMock.object,
      loggerMock.object);

    await linkAction.execute();

    linkCreatorMock.verifyAll();
  });

  it("throws for empty destination links", () => {
    const expectedTargetPath: string = "testPath";
    const expectedLinks: Map<string, string[]> = new Map<string, string[]>();
    expectedLinks.set(expectedTargetPath, [ ]);
    const linkAction: LinkAction = new LinkAction(expectedLinks, undefined, { force: true});

    expect(() => linkAction.validate()).throws(RangeError, expectedTargetPath);
  });

  it("throws for empty target links", () => {
    const expectedLinks: Map<string, string[]> = new Map<string, string[]>();
    const linkAction: LinkAction = new LinkAction(expectedLinks, undefined, { force: true });

    expect(() => linkAction.validate()).throws(RangeError, "at least one target");
  });

  it("throws for empty platform-specific target links", () => {
    const expectedLinks: Map<string, string[]> = new Map<string, string[]>();
    // tslint:disable-next-line:typedef
    const platformLinks = {
      osx: new Map<string, string[]>(),
      windows: new Map<string, string[]>(),
      linux: new Map<string, string[]>(),
    };

    // tslint:disable-next-line:no-require-imports typedef
    const os = require("os");
    // tslint:disable-next-line:no-unsafe-any
    os.type = (): string => "Darwin";

    const linkAction: LinkAction = new LinkAction(expectedLinks, platformLinks, { force: true });

    expect(() => linkAction.validate()).throws(RangeError, "at least one target");
  });

  it("deserialize arrays of platform-agnostic destination links", () => {
    const expectedLinks: Map<string, string[]> = new Map<string, string[]>();
    expectedLinks.set("key1", [ "path1" ]);
    expectedLinks.set("key2", [ "path2", "path3" ]);

    const expectedLinkConfig: ILinkCreationConfig = {
      force: true,
    };

    const expectedLinkAction: LinkAction = new LinkAction(expectedLinks, undefined, expectedLinkConfig);

    // tslint:disable-next-line:no-multiline-string
    const json: string = `
{
  "force":true,
  "links": {
    "key1": [ "path1" ],
    "key2": [ "path2", "path3" ]
  },
  "actionType":"link"
}`;

    const actualLinkAction: LinkAction = deserialize(LinkAction, json);
    expect(actualLinkAction).to.deep.equal(expectedLinkAction);
  });

  it("deserialize single strings of platform-agnostic destination links", () => {
    const expectedLinks: Map<string, string[]> = new Map<string, string[]>();
    expectedLinks.set("key1", [ "path1" ]);
    expectedLinks.set("key2", [ "path2" ]);

    const expectedLinkConfig: ILinkCreationConfig = {
      force: true,
    };

    const expectedLinkAction: LinkAction = new LinkAction(expectedLinks, undefined, expectedLinkConfig);

    // tslint:disable-next-line:no-multiline-string
    const json: string = `
{
  "force":true,
  "links": {
    "key1": "path1",
    "key2": "path2"
  },
  "actionType":"link"
}`;

    const actualLinkAction: LinkAction = deserialize(LinkAction, json);
    expect(actualLinkAction).to.deep.equal(expectedLinkAction);
  });

  it("deserialize null platform-agnostic destination links", () => {
    const key1: string = "key1";
    const key2: string = "key2";
    const key3: string = "key3";
    const key4: string = "key4";
    const sep: string = path.sep;
    const expectedLinks: Map<string, string[]> = new Map<string, string[]>();
    expectedLinks.set(key1, [ `~${sep}.${key1}` ]);
    expectedLinks.set(`.${key2}`, [ `~${sep}.${key2}` ]);
    expectedLinks.set(`dir/${key3}`, [ `~${sep}.${key3}` ]);
    expectedLinks.set(`dir/.${key4}`, [ `~${sep}.${key4}` ]);

    const expectedLinkConfig: ILinkCreationConfig = {
      force: true,
    };

    const expectedLinkAction: LinkAction = new LinkAction(expectedLinks, undefined, expectedLinkConfig);

    // tslint:disable-next-line:no-multiline-string
    const json: string = `
{
  "force":true,
  "links": {
    "${key1}": null,
    ".${key2}": null,
    "dir/${key3}": null,
    "dir/.${key4}": null
  },
  "actionType":"link"
}`;

    const actualLinkAction: LinkAction = deserialize(LinkAction, json);
    expect(actualLinkAction).to.deep.equal(expectedLinkAction);
  });

  it("deserialize platform-specific destination links", () => {
    const expectedLinksLinux: Map<string, string[]> = new Map<string, string[]>();
    expectedLinksLinux.set("key1", [ "path1" ]);
    expectedLinksLinux.set("key2", [ "path2" ]);

    const expectedLinksWindows: Map<string, string[]> = new Map<string, string[]>();
    expectedLinksWindows.set("key1", [ `~${path.sep}.key1` ]);

    const expectedLinksOsx: Map<string, string[]> = new Map<string, string[]>();
    expectedLinksOsx.set("key3", [ "path5" ]);

    const expectedLinksGlobal: Map<string, string[]> = new Map<string, string[]>();
    expectedLinksGlobal.set("key3", [ "path4", "path6" ]);

    const expectedLinkConfig: ILinkCreationConfig = {
      force: true,
    };

    // tslint:disable-next-line:typedef
    const platformLinks = {
      linux: expectedLinksLinux,
      windows: expectedLinksWindows,
      osx: expectedLinksOsx,
    };

    const expectedLinkAction: LinkAction = new LinkAction(expectedLinksGlobal, platformLinks, expectedLinkConfig);

    // tslint:disable-next-line:no-multiline-string
    const json: string = `
{
  "force":true,
  "links": {
    "key1": {
      "linux": "path1",
      "windows": null
    },
    "key2": {
      "linux": [
        "path2"
      ]
    },
    "key3": {
      "global": [
        "path4",
        "path6"
      ],
      "osx": "path5"
    }
  },
  "actionType":"link"
}`;

    const actualLinkAction: LinkAction = deserialize(LinkAction, json);
    expect(actualLinkAction).to.deep.equal(expectedLinkAction);
  });

});
