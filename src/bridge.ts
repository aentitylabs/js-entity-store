export abstract class Bridge {
    public abstract send(actions: any): any;
    public abstract reply(entities: any): void;
}