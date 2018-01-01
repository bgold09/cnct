import { LinkAction } from "./actions/LinkAction/LinkAction";
import { CnctActionBase } from "./CnctActionBase";

export class ActionTypes {
    // tslint:disable-next-line:no-any
    private static readonly actionTypes = new Map<string, new (...args: any[]) => CnctActionBase>();
    private static initialized: boolean = false;

    // tslint:disable-next-line:no-any
    public static getActionTypes(): Map<string, new (...args: any[]) => CnctActionBase> {
        if (ActionTypes.initialized) {
            return ActionTypes.actionTypes;
        }

        ActionTypes.actionTypes.set(LinkAction.linkActionType, LinkAction);

        return ActionTypes.actionTypes;
    }

}
