import { expect } from "chai";
import { deserialize } from "class-transformer";
import "mocha";
import * as TypeMoq from "typemoq";
import { ILinkCreationConfig } from "../src/actions/LinkAction/ILinkCreationConfig";
import { ILinkCreator } from "../src/actions/LinkAction/ILinkCreator";
import { LinkAction } from "../src/actions/LinkAction/LinkAction";

describe("LinkAction", () => {

  it("should create links", () => {
    const expectedLinks = new Map<string, string[]>();
    expectedLinks.set("key1", [ "path1" ]);
    expectedLinks.set("key2", [ "path2", "path3" ]);

    const expectedLinkConfig: ILinkCreationConfig = {
      force: true,
    };

    const linkCreatorMock = TypeMoq.Mock.ofType<ILinkCreator>(undefined, TypeMoq.MockBehavior.Strict);
    expectedLinks.forEach((destinationPaths, targetPath) => {
      for (const destinationPath of destinationPaths) {
        linkCreatorMock.setup(
          (m) => m.createLinkAsync(
            targetPath,
            destinationPath,
            TypeMoq.It.isObjectWith<ILinkCreationConfig>(expectedLinkConfig)))
          .returns(() => Promise.resolve())
          .verifiable(TypeMoq.Times.once());
      }
    });

    const linkAction = new LinkAction(expectedLinks, expectedLinkConfig, linkCreatorMock.object);
    linkAction.execute();

    linkCreatorMock.verifyAll();
  });

  it("throws for empty destination links", () => {
    const expectedTargetPath = "testPath";
    const expectedLinks = new Map<string, string[]>();
    expectedLinks.set(expectedTargetPath, [ ]);
    const linkAction = new LinkAction(expectedLinks, { force: true});

    const testFunc = () => {
      linkAction.validate();
    };

    expect(testFunc).throws(RangeError, expectedTargetPath);
  });

  it("throws for empty target links", () => {
    const expectedLinks = new Map<string, string[]>();
    const linkAction = new LinkAction(expectedLinks, { force: true });

    const testFunc = () => {
      linkAction.validate();
    };

    expect(testFunc).throws(RangeError, "at least one target");
  });

  it("deserialize", () => {
    const expectedLinks = new Map<string, string[]>();
    expectedLinks.set("key1", [ "path1" ]);
    expectedLinks.set("key2", [ "path2", "path3" ]);

    const expectedLinkConfig: ILinkCreationConfig = {
      force: true,
    };

    const expectedLinkAction = new LinkAction(expectedLinks, expectedLinkConfig);

    const json = `
{
  "force":true,
  "links": {
    "key1": { "paths": [ "path1" ] },
    "key2": { "paths": [ "path2", "path3" ] }
  },
  "type":"link"
}`;

    const actualLinkAction = deserialize(LinkAction, json);
    expect(actualLinkAction).to.deep.equal(expectedLinkAction);
  });

});
