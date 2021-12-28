export abstract class Bridge {
    private _data: any;


    public constructor(data?: any) {
        this._data = data;
    }

    protected get data() {
        return this._data;
    }

    public abstract send(actions: any, onSend: any): any;
    public abstract reply(entities: any, onReply: any): void;
}