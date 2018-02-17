import { CnctActionBase } from "./CnctActionBase";
import { LinkAction } from "./LinkAction/LinkAction";

// tslint:disable-next-line:no-stateless-class no-unnecessary-class
export class ActionTypes {
    // tslint:disable-next-line:no-any typedef
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
