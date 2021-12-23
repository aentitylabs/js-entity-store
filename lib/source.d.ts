export declare abstract class Source {
    private _data;
    constructor(data?: any);
    protected get data(): any;
    abstract load(entity: any): any;
    abstract update(entity: any): any;
    abstract delete(entity: any): void;
}
