import { Source } from "./source";
export declare class NullSource extends Source {
    load(entity: any, onLoad: any): void;
    update(entity: any, onUpdate: any): void;
    delete(entity: any, onDelete: any): void;
}
