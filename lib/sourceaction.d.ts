import { Entity } from "./entity";
import { Source } from "./source";
export declare abstract class SourceAction {
    private _type;
    private _entity;
    constructor(type: string, entity: Entity);
    abstract sync(source: Source, onSync: any): void;
    get type(): string;
    get entity(): Entity;
    set entity(value: Entity);
    protected validateLoad(serializedEntity: any): void;
    protected validateUpdate(serializedEntity: any): void;
    protected validateDelete(serializedEntity: any): void;
}
