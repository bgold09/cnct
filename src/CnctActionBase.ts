export abstract class CnctActionBase {
    protected constructor(
        public readonly actionType: string) {
    }

    public abstract execute(): void;
    public abstract validate(): void;
}
