export declare abstract class Source {
    private _data;
    constructor(data?: any);
    protected get data(): any;
    abstract load(entity: any, onLoad: any): void;
    abstract update(entity: any, onUpdate: any): void;
    abstract delete(entity: any, onDelete: any): void;
}
