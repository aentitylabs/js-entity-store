"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const entityfactory_1 = require("./entityfactory");
const entityproperty_1 = require("./entityproperty");
const nullsource_1 = require("./nullsource");
class Entity {
    constructor(entityStore, name, ref, item) {
        this._properties = {};
        this._isReferenced = false;
        this._source = new nullsource_1.NullSource();
        this._isItem = false;
        this._isCollection = false;
        this._item = {};
        this._entityStore = entityStore;
        this._name = name;
        this._key = name;
        this._item = item;
        this._isCollection = item ? true : false;
        let source;
        if (ref != null && ref != undefined) {
            this._key = ref.key + "=>" + this._key;
            this._isReferenced = true;
            source = ref._source;
        }
        this._ref = ref;
        this._entityStore.register(this, source);
        if (!ref) {
            this._ref = this;
            this._entityStore.load(this);
        }
    }
    set key(value) {
        this._key = value;
    }
    get key() {
        return this._key;
    }
    get name() {
        return this._name;
    }
    get ref() {
        return this._ref;
    }
    get properties() {
        return this._properties;
    }
    get source() {
        return this._source;
    }
    get entityStore() {
        return this._entityStore;
    }
    set source(source) {
        this._source = source;
    }
    get isReferenced() {
        return this._isReferenced;
    }
    set isItem(value) {
        this._isItem = value;
    }
    get isItem() {
        return this._isItem;
    }
    delete() {
        this._entityStore.delete(this);
    }
    get(index) {
        return this.properties[index].value;
    }
    add() {
        const entity = entityfactory_1.EntityFactory.newEntity(this._entityStore, this._item, this);
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
    remove(index) {
        const toRemove = this.get(index);
        this._entityStore.delete(toRemove);
        this._entityStore.load(this);
    }
    serialize() {
        const serializedEntity = {};
        serializedEntity["entity"] = this._name;
        serializedEntity["properties"] = {};
        serializedEntity["ref"] = this._isReferenced;
        for (var key in this._properties) {
            serializedEntity["properties"][key] = this._properties[key].serialize();
        }
        return serializedEntity;
    }
    deserialize(entity) {
        this._name = entity["entity"];
        if (!entity["properties"]) {
            return;
        }
        let i = 0;
        for (let key in entity["properties"]) {
            const entityProperty = new entityproperty_1.EntityProperty(this._entityStore, this);
            entityProperty.deserialize(entity["properties"][key]);
            this._properties[key] = entityProperty;
            if (this._isCollection) {
                const entityItem = entityProperty.value;
                entityItem.key = entityItem.key + "[" + i + "]";
                entityItem.isItem = true;
                this._entityStore.register(entityItem, this.source);
            }
            i++;
        }
    }
}
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map