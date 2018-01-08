// tslint:disable:no-import-side-effect
import { expect } from "chai";
import { deserialize } from "class-transformer";
import "mocha";
import * as TypeMoq from "typemoq";
import { ILinkCreationConfig } from "../src/actions/LinkAction/ILinkCreationConfig";
import { ILinkCreator } from "../src/actions/LinkAction/ILinkCreator";
import { LinkAction } from "../src/actions/LinkAction/LinkAction";

/* tslint:disable:no-backbone-get-set-outside-model */

describe("LinkAction", () => {

  it("should create links", async () => {
    const expectedLinks: Map<string, string[]> = new Map<string, string[]>();
    expectedLinks.set("key1", [ "path1" ]);
    expectedLinks.set("key2", [ "path2", "path3" ]);

    const expectedLinkConfig: ILinkCreationConfig = {
      force: true,
    };

    /* tslint:disable:typedef */
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

    const linkAction: LinkAction = new LinkAction(expectedLinks, expectedLinkConfig, linkCreatorMock.object);
    await linkAction.execute();

    linkCreatorMock.verifyAll();
  });

  it("throws for empty destination links", () => {
    const expectedTargetPath: string = "testPath";
    const expectedLinks: Map<string, string[]> = new Map<string, string[]>();
    expectedLinks.set(expectedTargetPath, [ ]);
    const linkAction: LinkAction = new LinkAction(expectedLinks, { force: true});

    expect(() => linkAction.validate()).throws(RangeError, expectedTargetPath);
  });

  it("throws for empty target links", () => {
    const expectedLinks: Map<string, string[]> = new Map<string, string[]>();
    const linkAction: LinkAction = new LinkAction(expectedLinks, { force: true });

    expect(() => linkAction.validate()).throws(RangeError, "at least one target");
  });

  it("deserialize", () => {
    const expectedLinks: Map<string, string[]> = new Map<string, string[]>();
    expectedLinks.set("key1", [ "path1" ]);
    expectedLinks.set("key2", [ "path2", "path3" ]);

    const expectedLinkConfig: ILinkCreationConfig = {
      force: true,
    };

    const expectedLinkAction: LinkAction = new LinkAction(expectedLinks, expectedLinkConfig);

    // tslint:disable-next-line:no-multiline-string
    const json: string = `
{
  "force":true,
  "links": {
    "key1": { "paths": [ "path1" ] },
    "key2": { "paths": [ "path2", "path3" ] }
  },
  "type":"link"
}`;

    const actualLinkAction: LinkAction = deserialize(LinkAction, json);
    expect(actualLinkAction).to.deep.equal(expectedLinkAction);
  });

});
