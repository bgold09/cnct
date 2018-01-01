import { expect } from "chai";
import { deserialize } from "class-transformer";
import "mocha";
import * as TypeMoq from "typemoq";
import { CnctActionBase } from "../src/CnctActionBase";
import { CnctConfig } from "../src/CnctConfig";

describe("CnctConfig", () => {

    it("can deserialize actions", () => {
        const json = `
{
  "actions": [
    {
      "actionType": "link",
      "links": {
        "file1": {
          "force": true,
          "paths": [
            "somePath"
          ]
        }
      }
    }
  ]
}`;

        const cnctConfig = deserialize(CnctConfig, json);
        expect(cnctConfig.actionConfigs.length).to.equal(1);
        expect(cnctConfig.actionConfigs[0].constructor.name).to.equal("LinkAction");
    });

    it("validates children configurations are valid", () => {
        const actionMock1 =  TypeMoq.Mock.ofType<CnctActionBase>();
        actionMock1.setup(m => m.validate()).verifiable(TypeMoq.Times.once());
        const actionMock2 =  TypeMoq.Mock.ofType<CnctActionBase>();
        actionMock2.setup(m => m.validate()).verifiable(TypeMoq.Times.once());

        const cnctConfig = new CnctConfig([ actionMock1.object, actionMock2.object ]);
        cnctConfig.validate();

        actionMock1.verifyAll();
        actionMock2.verifyAll();
    });

    it("throws if one or more children configurations are invalid", () => {
        const actionMock1 =  TypeMoq.Mock.ofType<CnctActionBase>();
        actionMock1.setup(m => m.validate()).throws(new Error()).verifiable(TypeMoq.Times.once());
        const actionMock2 =  TypeMoq.Mock.ofType<CnctActionBase>();
        actionMock2.setup(m => m.validate()).throws(new Error()).verifiable(TypeMoq.Times.once());

        const cnctConfig = new CnctConfig([ actionMock1.object, actionMock2.object ]);
        const testFunc = () => {
            cnctConfig.validate();
        };

        expect(testFunc).to.throw(Error);

        actionMock1.verifyAll();
        actionMock2.verifyAll();
    });
});
