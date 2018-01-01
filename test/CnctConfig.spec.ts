import { expect } from "chai";
import { deserialize } from "class-transformer";
import "mocha";
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

});
