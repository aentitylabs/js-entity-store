import { Source } from "./source";

export class NullSource extends Source {
    public load(entity: any) {
        return entity;
    }
    
    public update(entity: any) {
        return entity;
    }

    public delete(entity: any): void {
        
    }
}
