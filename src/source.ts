export abstract class Source {
    public abstract load(entity: any): any;
    public abstract update(entity: any): any;
    public abstract delete(entity: any): void;
}
