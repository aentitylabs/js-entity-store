import { Entity } from "./entity";
import { EntityStore } from "./entitystore";
export declare class EntityProperty {
    private _entityStore;
    private _ref;
    private _isEntity;
    private _value;
    constructor(entityStore: EntityStore, ref?: Entity);
    get isEntity(): boolean;
    get value(): any;
    set value(value: any);
    serialize(): any;
    deserialize(entityProperty: any): void;
}
