export declare abstract class Bridge {
    abstract send(actions: any, onReply: any): any;
    abstract reply(entities: any): void;
}
