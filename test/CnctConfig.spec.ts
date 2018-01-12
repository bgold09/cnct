// tslint:disable:no-import-side-effect
import { expect } from "chai";
import { deserialize } from "class-transformer";
import "mocha";
import * as TypeMoq from "typemoq";
import { CnctActionBase } from "../src/actions/CnctActionBase";
import { CnctConfig } from "../src/CnctConfig/CnctConfig";
import { ILogger } from "../src/Logger/ILogger";

describe("CnctConfig", () => {

    it("can deserialize actions", () => {
        // tslint:disable-next-line:no-multiline-string
        const json: string = `
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

        const cnctConfig: CnctConfig = deserialize(CnctConfig, json);
        expect(cnctConfig.actionConfigs.length).to.equal(1);
        expect(cnctConfig.actionConfigs[0].constructor.name).to.equal("LinkAction");
    });

    it("validates children configurations are valid", () => {
        /* tslint:disable:typedef */
        const actionMock1 =  TypeMoq.Mock.ofType<CnctActionBase>();
        actionMock1.setup(m => m.validate()).verifiable(TypeMoq.Times.once());
        const actionMock2 =  TypeMoq.Mock.ofType<CnctActionBase>();
        actionMock2.setup(m => m.validate()).verifiable(TypeMoq.Times.once());

        const loggerMock = TypeMoq.Mock.ofType<ILogger>();
        loggerMock.setup(m => m.logVerbose(TypeMoq.It.isAnyString())).verifiable(TypeMoq.Times.exactly(2));
        /* tslint:enable:typedef */

        const cnctConfig: CnctConfig = new CnctConfig([ actionMock1.object, actionMock2.object ], loggerMock.object);
        cnctConfig.validate();

        actionMock1.verifyAll();
        actionMock2.verifyAll();
        loggerMock.verifyAll();
    });

    it("throws if one or more children configurations are invalid", () => {
        /* tslint:disable:typedef */
        const actionMock1 =  TypeMoq.Mock.ofType<CnctActionBase>();
        actionMock1.setup(m => m.validate()).throws(new Error()).verifiable(TypeMoq.Times.once());
        const actionMock2 =  TypeMoq.Mock.ofType<CnctActionBase>();
        actionMock2.setup(m => m.validate()).throws(new Error()).verifiable(TypeMoq.Times.once());
        /* tslint:enable:typedef */

        const cnctConfig: CnctConfig = new CnctConfig([ actionMock1.object, actionMock2.object ]);

        expect(() => cnctConfig.validate()).to.throw(Error);

        actionMock1.verifyAll();
        actionMock2.verifyAll();
    });
});
