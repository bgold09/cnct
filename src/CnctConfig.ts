import { Expose, plainToClass } from "class-transformer";
import { ActionTypes } from "./ActionTypes";
import { CnctActionBase } from "./CnctActionBase";

export class CnctConfig {

    public constructor(
        public actionConfigs: CnctActionBase[] = [],
    ) {
    }

    @Expose()
    public set actions(value: CnctActionBase[]) {
        value.forEach((action) => {
            if (!action.actionType || (action.actionType === "")) {
                throw new Error();
            }

            const actionTypes = ActionTypes.getActionTypes();
            const actionCtor = actionTypes.get(action.actionType);
            if (!actionCtor) {
                const names: string[] = [];
                actionTypes.forEach(({}, key, {}) => {
                    names.push(`'${key}'`);
                });

                const namesString = names.join(", ");
                throw new Error(
                    `The action type ${action.actionType} is not recognized. Allowed values are: ${namesString}`);
            }

            const actionClass = plainToClass(actionCtor, action);
            this.actionConfigs.push(actionClass as CnctActionBase);
        });
    }

    public execute(): void {
        this.actionConfigs.forEach((action) => {
            action.execute();
        });
    }
}
