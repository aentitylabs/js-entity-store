import { Source } from "./source";

export class NullSource extends Source {
    public load(entity: any, onLoad: any): void {
        onLoad(entity);
    }
    
    public update(entity: any, onUpdate: any): void {
        onUpdate(entity);
    }

    public delete(entity: any, onDelete: any): void {
        onDelete();
    }
}
