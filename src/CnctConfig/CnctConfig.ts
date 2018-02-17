import { Expose, plainToClass } from "class-transformer";
import { ActionTypes } from "../actions/ActionTypes";
import { CnctActionBase } from "../actions/CnctActionBase";
import { ConsoleLogger } from "../Logger/ConsoleLogger";
import { ILogger } from "../Logger/ILogger";

export class CnctConfig {

    public constructor(
        public actionConfigs: CnctActionBase[] = [],
        private readonly logger: ILogger = new ConsoleLogger(),
    ) {
    }

    @Expose()
    public set actions(value: CnctActionBase[]) {
        value.forEach((action: CnctActionBase) => {
            if (!action.actionType || (action.actionType === "")) {
                throw new Error();
            }

            /* tslint:disable:typedef */
            const actionTypes = ActionTypes.getActionTypes();
            const actionCtor = actionTypes.get(action.actionType);
            /* tslint:enable:typedef */

            if (!actionCtor) {
                const names: string[] = [];
                actionTypes.forEach(({}: Object, key: string) => {
                    names.push(`'${key}'`);
                });

                const namesString: string = names.join(", ");
                throw new Error(
                    `The action type ${action.actionType} is not recognized. Allowed values are: ${namesString}`);
            }

            const actionClass: CnctActionBase = plainToClass(actionCtor, action);
            this.actionConfigs.push(actionClass);
        });
    }

    public validate(): void {
        const invalidActions: Array<{ index: number; message: string }> = [];

        this.actionConfigs.forEach((action: CnctActionBase, index: number) => {
            try {
                action.validate();
                this.logger.logDebug(`${action.actionType} action validation passed`);
            } catch (e) {
                const error: Error = e as Error;
                invalidActions.push({
                    index,
                    message: error.message,
                });
            }
        });

        if (invalidActions.length > 0) {
            let message: string = "The following actions are improperly configured:";
            invalidActions.forEach((info: { index: number; message: string }) => {
                message += `\n  actions[${info.index}]: ${info.message}`;
            });

            throw new Error(message);
        }
    }

    public execute(): void {
        this.actionConfigs.forEach((action: CnctActionBase) => {
            action.execute();
        });
    }
}
