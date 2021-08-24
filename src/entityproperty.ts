import { Entity } from "./entity";
import { EntityFactory } from "./entityfactory";
import { EntityStore } from "./entitystore";

export class EntityProperty {
    private _entityStore: EntityStore;
    private _ref: Entity|undefined;
    private _isEntity: boolean = false;
    private _value: any;


    public constructor(entityStore: EntityStore, ref?: Entity)
    {
        this._entityStore = entityStore;
        this._ref = ref;
    }

    public get isEntity() {
        return this._isEntity;
    }

    public get value() {
        return this._value;
    }

    public set value(value) {
        this._value = value;
    }

    public serialize(): any {
        if(this._isEntity === true) {
            return this._value.serialize();
        }

        return {
            "value": this._value
        };
    }
    
    public deserialize(entityProperty: any) {
        if(entityProperty["entity"]) {
            const ref: Entity|undefined = entityProperty["ref"] === true ? this._ref : undefined;

            this._value = EntityFactory.newEntity(this._entityStore, entityProperty, ref);
            this._isEntity = true;

            this._value.deserialize(entityProperty);

            return;
        }

        this._value = entityProperty["value"];
    }
}