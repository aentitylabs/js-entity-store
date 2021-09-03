import { Source } from "./source";
export declare class NullSource extends Source {
    load(entity: any): any;
    update(entity: any): any;
    delete(entity: any): void;
}
