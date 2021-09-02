"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityProperty = void 0;
const entityfactory_1 = require("./entityfactory");
class EntityProperty {
    constructor(entityStore, ref) {
        this._isEntity = false;
        this._entityStore = entityStore;
        this._ref = ref;
    }
    get isEntity() {
        return this._isEntity;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
    serialize() {
        if (this._isEntity === true) {
            return this._value.serialize();
        }
        return {
            "value": this._value
        };
    }
    deserialize(entityProperty) {
        if (entityProperty["entity"]) {
            const ref = entityProperty["ref"] === true ? this._ref : undefined;
            this._value = entityfactory_1.EntityFactory.newEntity(this._entityStore, entityProperty, ref);
            this._isEntity = true;
            this._value.deserialize(entityProperty);
            return;
        }
        this._value = entityProperty["value"];
    }
}
exports.EntityProperty = EntityProperty;
//# sourceMappingURL=entityproperty.js.map