export declare abstract class Bridge {
    private _data;
    constructor(data?: any);
    protected get data(): any;
    abstract send(actions: any, onReply: any): any;
    abstract reply(entities: any): void;
}
