import { Source } from "./source";
export declare class NullSource extends Source {
    load(entity: any): void;
    update(entity: any): void;
    delete(entity: any): void;
}
