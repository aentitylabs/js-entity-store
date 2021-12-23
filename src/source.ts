export abstract class Source {
    private _data: any;


    public constructor(data?: any) {
        this._data = data;
    }

    protected get data() {
        return this._data;
    }
    
    public abstract load(entity: any): any;
    public abstract update(entity: any): any;
    public abstract delete(entity: any): void;
}
