export interface IAction {
    actionType: string;

    execute(): void;
    validate(): void;
}
