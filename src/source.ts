export abstract class Source {
    private _data: any;


    public constructor(data?: any) {
        this._data = data;
    }

    protected get data() {
        return this._data;
    }
    
    public abstract load(entity: any, onLoad: any): void;
    public abstract update(entity: any, onUpdate: any): void;
    public abstract delete(entity: any, onDelete: any): void;
}
