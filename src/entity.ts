import { EntityFactory } from "./entityfactory";
import { EntityProperty } from "./entityproperty";
import { EntityStore } from "./entitystore";
import { NullSource } from "./nullsource";
import { Source } from "./source";

export class Entity {
    private _entityStore: EntityStore;
    protected _properties: any = {};
    private _name: string;
    private _key: string;
    private _ref: Entity|undefined;
    private _isReferenced: boolean = false;
    private _source: Source = new NullSource();
    private _isItem: boolean = false;
    private _isCollection: boolean = false;
    protected _item: any = {};
    protected _itemPrototype: Entity|undefined;


    public constructor(entityStore: EntityStore, name: string, ref?: Entity, item?: any)
    {
        this._entityStore = entityStore;

        this._name = name;
        this._key = name;
        this._item = item;
        this._isCollection = item ? true : false;

        let source;

        if(ref != null && ref != undefined) {
            this._key = ref.key + "=>" + this._key;
            this._isReferenced = true;
            source = ref._source;
        }

        this._ref = ref;

        this._entityStore.register(this, source);

        if(!ref) {
            this._ref = this;
            this._entityStore.load(this);
        }

        if(this._item) {
            this._itemPrototype = EntityFactory.newEntity(this._entityStore, this._item, this);
        }
    }

    public set key(value: string) {
        this._key = value;
    }

    public get key(): string {
        return this._key;
    }

    public get name(): string {
        return this._name;
    }

    public get ref(): Entity|undefined {
        return this._ref;
    }

    public get properties(): any {
        return this._properties;
    }

    public get source() {
        return this._source;
    }

    public get entityStore() {
        return this._entityStore;
    }

    public set source(source: Source) {
        this._source = source;
    }

    public get isReferenced() {
        return this._isReferenced;
    }

    public get isCollection() {
        return this._isCollection;
    }

    public set isItem(value: boolean) {
        this._isItem = value;
    }

    public get isItem() {
        return this._isItem;
    }

    public get item() {
        return this._item;
    }

    public get itemPrototype() {
        return this._itemPrototype;
    }

    public delete() {
        this._entityStore.delete(this);
    }

    public get(index: number) {
        return this.properties[index].value;
    }

    public add(): Entity {
        const entity = EntityFactory.newEntity(this._entityStore, this._item, this);

        entity.deserialize(this._item);

        const collectionSize = Object.keys(this._properties).length;

        this._properties[collectionSize] = entity;

        entity._key = entity._key + "[" + (collectionSize) + "]";

        entity._isItem = true;

        this.entityStore.register(entity, this._source);

        this._entityStore.update(entity);

        this._entityStore.load(this);

        return entity;
    }

    public remove(index: number) {
        const toRemove = this.get(index);

        this._entityStore.delete(toRemove);

        this._entityStore.load(this);
    }

    public serialize(): any {
        const serializedEntity: any = {};

        serializedEntity["entity"] = this._name;
        serializedEntity["properties"] = {};
        serializedEntity["ref"] = this._isReferenced;

        for(var key in this._properties) {
            serializedEntity["properties"][key] = this._properties[key].serialize();
        }

        return serializedEntity;
    }
    
    public deserialize(entity: any) {
        this._name = entity["entity"];

        if(!entity["properties"]) {
            return;
        }

        let i = 0;

        for(let key in entity["properties"]) {
            const entityProperty = new EntityProperty(this._entityStore, this);

            entityProperty.deserialize(entity["properties"][key]);

            this._properties[key] = entityProperty;

            if(this._isCollection) {
                const entityItem = entityProperty.value;

                entityItem.key = entityItem.key + "[" + i + "]";

                entityItem.isItem = true;

                this._entityStore.register(entityItem, this.source);
            }

            i++;
        }
    }
}
