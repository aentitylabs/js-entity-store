export declare abstract class Bridge {
    private _data;
    constructor(data?: any);
    protected get data(): any;
    abstract send(actions: any, onSend: any): void;
    abstract reply(entities: any, actions: any, onReply: any): void;
}
