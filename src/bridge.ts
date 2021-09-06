export abstract class Bridge {
    public abstract send(actions: any, onReply: any): any;
    public abstract reply(entities: any): void;
}