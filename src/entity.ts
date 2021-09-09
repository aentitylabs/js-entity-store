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
            this._key = ref.getKey() + "=>" + this._key;
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

    public setKey(value: string) {
        this._key = value;
    }

    public getKey(): string {
        return this._key;
    }

    public setName(value: string) {
        this._name = value;
    }

    public getName(): string {
        return this._name;
    }

    public getRef(): any {
        return this._ref;
    }

    public getProperties(): any {
        return this._properties;
    }

    public getSource() {
        return this._source;
    }

    public getEntityStore() {
        return this._entityStore;
    }

    public setSource(source: Source) {
        this._source = source;
    }

    public isReferenced() {
        return this._isReferenced;
    }

    public isCollection() {
        return this._isCollection;
    }

    public setIsItem(value: boolean) {
        this._isItem = value;
    }

    public isItem() {
        return this._isItem;
    }

    public getItem() {
        return this._item;
    }

    public getItemPrototype(): any {
        return this._itemPrototype;
    }

    public delete() {
        this._entityStore.delete(this);
    }

    public get(index: number) {
        return this._properties[index].value;
    }

    public add(): Entity {
        const entity = EntityFactory.newEntity(this._entityStore, this._item, this);

        entity.deserialize(this.getItem());

        const collectionSize = Object.keys(this.getProperties()).length;

        this.getProperties()[collectionSize] = entity;

        entity.setKey(entity.getKey() + "[" + (collectionSize) + "]");

        entity.setIsItem(true);

        this.getEntityStore().register(entity, this.getSource());

        this.getEntityStore().update(entity);

        this.getEntityStore().load(this);

        return entity;
    }

    public remove(index: number) {
        const toRemove = this.get(index);

        this.getEntityStore().delete(toRemove);

        this.getEntityStore().load(this);
    }

    public serialize(): any {
        const serializedEntity: any = {};

        serializedEntity["entity"] = this.getName();
        serializedEntity["properties"] = {};
        serializedEntity["ref"] = this.isReferenced();

        for(var key in this.getProperties()) {
            serializedEntity["properties"][key] = this.getProperties()[key].serialize();
        }

        return serializedEntity;
    }
    
    public deserialize(entity: any) {
        this.setName(entity["entity"]);

        if(!entity["properties"]) {
            return;
        }

        let i = 0;

        for(let key in entity["properties"]) {
            const entityProperty = new EntityProperty(this.getEntityStore(), this);

            entityProperty.deserialize(entity["properties"][key]);

            this.getProperties()[key] = entityProperty;

            if(this.isCollection()) {
                const entityItem = entityProperty.value;

                entityItem.setKey(entityItem.getKey() + "[" + i + "]");

                entityItem.setIsItem(true);

                this.getEntityStore().register(entityItem, this.getSource());
            }

            i++;
        }
    }
}
