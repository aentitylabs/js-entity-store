(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jsentitystore"] = factory();
	else
		root["jsentitystore"] = factory();
})(this, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./bridge.ts":
/*!*******************!*\
  !*** ./bridge.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Bridge = void 0;
class Bridge {
    constructor(data) {
        this._data = data;
    }
    get data() {
        return this._data;
    }
}
exports.Bridge = Bridge;


/***/ }),

/***/ "./deletesourceaction.ts":
/*!*******************************!*\
  !*** ./deletesourceaction.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteSourceAction = void 0;
const entityfactory_1 = __webpack_require__(/*! ./entityfactory */ "./entityfactory.ts");
const sourceaction_1 = __webpack_require__(/*! ./sourceaction */ "./sourceaction.ts");
class DeleteSourceAction extends sourceaction_1.SourceAction {
    constructor(entity) {
        super("DeleteSourceAction", entity);
    }
    sync(source, onSync) {
        const serializedEntity = this.entity.serialize();
        const entityData = entityfactory_1.EntityFactory.buildEntityDataFromSchema(serializedEntity);
        this.validateDelete(entityData);
        source.delete(entityData, onSync);
    }
}
exports.DeleteSourceAction = DeleteSourceAction;


/***/ }),

/***/ "./entity.ts":
/*!*******************!*\
  !*** ./entity.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Entity = void 0;
const entityfactory_1 = __webpack_require__(/*! ./entityfactory */ "./entityfactory.ts");
const entityproperty_1 = __webpack_require__(/*! ./entityproperty */ "./entityproperty.ts");
const nullsource_1 = __webpack_require__(/*! ./nullsource */ "./nullsource.ts");
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
            this._key = ref.getKey() + "=>" + this._key;
            this._isReferenced = true;
            source = ref._source;
        }
        this._ref = ref;
        this._entityStore.register(this, source);
        if (!ref) {
            this._ref = this;
            this._entityStore.load(this);
        }
        if (this._item) {
            this._itemPrototype = entityfactory_1.EntityFactory.newEntity(this._entityStore, this._item, this);
        }
    }
    setKey(value) {
        this._key = value;
    }
    getKey() {
        return this._key;
    }
    setName(value) {
        this._name = value;
    }
    getName() {
        return this._name;
    }
    getRef() {
        return this._ref;
    }
    getProperties() {
        return this._properties;
    }
    getSource() {
        return this._source;
    }
    getEntityStore() {
        return this._entityStore;
    }
    setSource(source) {
        this._source = source;
    }
    isReferenced() {
        return this._isReferenced;
    }
    isCollection() {
        return this._isCollection;
    }
    setIsItem(value) {
        this._isItem = value;
    }
    isItem() {
        return this._isItem;
    }
    getItem() {
        return this._item;
    }
    getItemPrototype() {
        return this._itemPrototype;
    }
    delete() {
        this._entityStore.delete(this);
    }
    get(index) {
        return this._properties[index].value;
    }
    add() {
        const entity = entityfactory_1.EntityFactory.newEntity(this._entityStore, this._item, this);
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
    remove(index) {
        const toRemove = this.get(index);
        this.getEntityStore().delete(toRemove);
        this.getEntityStore().load(this);
    }
    serialize() {
        const serializedEntity = {};
        serializedEntity["entity"] = this.getName();
        serializedEntity["properties"] = {};
        serializedEntity["ref"] = this.isReferenced();
        for (var key in this.getProperties()) {
            serializedEntity["properties"][key] = this.getProperties()[key].serialize();
        }
        return serializedEntity;
    }
    deserialize(entity) {
        this.setName(entity["entity"]);
        if (!entity["properties"]) {
            return;
        }
        let i = 0;
        for (let key in entity["properties"]) {
            const entityProperty = new entityproperty_1.EntityProperty(this.getEntityStore(), this);
            entityProperty.deserialize(entity["properties"][key]);
            this.getProperties()[key] = entityProperty;
            if (this.isCollection()) {
                const entityItem = entityProperty.value;
                entityItem.setKey(entityItem.getKey() + "[" + i + "]");
                entityItem.setIsItem(true);
                this.getEntityStore().register(entityItem, this.getSource());
            }
            i++;
        }
    }
}
exports.Entity = Entity;


/***/ }),

/***/ "./entityfactory.ts":
/*!**************************!*\
  !*** ./entityfactory.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityFactory = void 0;
const entity_1 = __webpack_require__(/*! ./entity */ "./entity.ts");
const entityhandler_1 = __webpack_require__(/*! ./entityhandler */ "./entityhandler.ts");
class EntityFactory {
    static newEntity(entityStore, entity, ref) {
        let newEntity = null;
        if (entity["collectionItem"]) {
            newEntity = new entity_1.Entity(entityStore, entity["entity"], ref, entity["collectionItem"]);
        }
        else {
            newEntity = new entity_1.Entity(entityStore, entity["entity"], ref);
        }
        newEntity.deserialize(entity);
        const entityProxy = new Proxy(newEntity, new entityhandler_1.EntityHandler());
        return entityProxy;
    }
    static buildEntitySchemaFromData(entity, entityData) {
        const serializedEntity = {};
        serializedEntity["entity"] = entity.getName();
        serializedEntity["properties"] = {};
        serializedEntity["ref"] = entity.isReferenced();
        for (let key in entityData) {
            if (entity.isCollection() === true) {
                serializedEntity["collectionItem"] = entity.getItem();
                if (entity.getItemPrototype()) {
                    serializedEntity["properties"][key] = EntityFactory.buildEntitySchemaFromData(entity.getItemPrototype(), entityData[key]);
                }
            }
            else if (entity.getProperties()[key].isEntity === true) {
                serializedEntity["properties"][key] = EntityFactory.buildEntitySchemaFromData(entity.getProperties()[key].value, entityData[key]);
            }
            else {
                serializedEntity["properties"][key] = {
                    "value": entityData[key]
                };
            }
        }
        return serializedEntity;
    }
    static buildEntityDataFromSchema(entitySchema) {
        const entityData = {};
        for (let key in entitySchema.properties) {
            if (entitySchema.properties[key]["entity"]) {
                entityData[key] = EntityFactory.buildEntityDataFromSchema(entitySchema.properties[key]);
            }
            else {
                entityData[key] = entitySchema.properties[key]["value"];
            }
        }
        return entityData;
    }
}
exports.EntityFactory = EntityFactory;


/***/ }),

/***/ "./entityhandler.ts":
/*!**************************!*\
  !*** ./entityhandler.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityHandler = void 0;
class EntityHandler {
    get(target, property, receiver) {
        if (target.getProperties()[property]) {
            return target.getProperties()[property].value;
        }
        return target[property];
    }
    set(obj, property, value) {
        if (obj.getProperties()[property]) {
            obj.getProperties()[property].value = value;
            obj.getEntityStore().update(obj);
            return true;
        }
        obj[property] = value;
        return true;
    }
}
exports.EntityHandler = EntityHandler;


/***/ }),

/***/ "./entityproperty.ts":
/*!***************************!*\
  !*** ./entityproperty.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityProperty = void 0;
const entityfactory_1 = __webpack_require__(/*! ./entityfactory */ "./entityfactory.ts");
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


/***/ }),

/***/ "./entitystore.ts":
/*!************************!*\
  !*** ./entitystore.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityStore = void 0;
const deletesourceaction_1 = __webpack_require__(/*! ./deletesourceaction */ "./deletesourceaction.ts");
const entityfactory_1 = __webpack_require__(/*! ./entityfactory */ "./entityfactory.ts");
const loadsourceaction_1 = __webpack_require__(/*! ./loadsourceaction */ "./loadsourceaction.ts");
const nullsource_1 = __webpack_require__(/*! ./nullsource */ "./nullsource.ts");
const sourceactionfactory_1 = __webpack_require__(/*! ./sourceactionfactory */ "./sourceactionfactory.ts");
const updatesourceaction_1 = __webpack_require__(/*! ./updatesourceaction */ "./updatesourceaction.ts");
class EntityStore {
    constructor() {
        this._sources = {};
        this._bridges = {};
        this._entities = {};
        this._actions = {};
    }
    get actions() {
        return this._actions;
    }
    addSource(entityName, source) {
        this._sources[entityName] = source;
    }
    addBridge(bridgeName, bridge) {
        this._bridges[bridgeName] = bridge;
    }
    register(entity, source) {
        this._entities[entity.getKey()] = entity;
        if (!source) {
            let entitySource = this._sources[entity.getName()];
            if (!entitySource) {
                entity.setSource(new nullsource_1.NullSource());
            }
            else {
                entity.setSource(this._sources[entity.getName()]);
            }
        }
        else {
            entity.setSource(source);
        }
    }
    sync(onSync) {
        if (Object.keys(this._actions).length === 0) {
            if (onSync) {
                onSync();
            }
            return;
        }
        const key = Object.keys(this._actions)[0];
        const sourceAction = this._actions[key];
        //TODO: gestire entità con source a null (null pattern!?)
        sourceAction.sync(sourceAction.entity.getSource(), () => {
            delete this._actions[key];
            this.sync(onSync);
        });
    }
    syncTo(bridge, onSync) {
        const serializedActions = {};
        this.serializeSourceAction(serializedActions, 0, () => {
            if (Object.keys(serializedActions).length === 0) {
                if (onSync) {
                    onSync();
                }
                return;
            }
            this._bridges[bridge].send(serializedActions, (entities) => {
                this.syncSourceAction(entities, () => {
                    if (onSync) {
                        onSync();
                    }
                });
            });
        });
    }
    syncFrom(bridge, receivedActions, onDeserialize, onReply) {
        const deserializedActions = {};
        const entities = {};
        this.deserializeSourceAction(deserializedActions, entities, receivedActions, 0, () => {
            if (onDeserialize) {
                onDeserialize();
            }
            this.sync(() => {
                const serializedEntities = {};
                for (const key in entities) {
                    serializedEntities[key] = entities[key].serialize();
                }
                this._bridges[bridge].reply(serializedEntities, () => {
                    if (onReply) {
                        onReply();
                    }
                });
            });
        });
    }
    load(entity) {
        if (entity.isReferenced() && !entity.isItem() && entity.getRef()) {
            return this.load(entity.getRef());
        }
        this._actions[entity.getKey() + "::load"] = new loadsourceaction_1.LoadSourceAction(entity);
    }
    update(entity) {
        if (entity.isReferenced() && !entity.isItem() && entity.getRef()) {
            return this.update(entity.getRef());
        }
        this._actions[entity.getKey() + "::update"] = new updatesourceaction_1.UpdateSourceAction(entity);
    }
    delete(entity) {
        if (entity.isReferenced() && !entity.isItem() && entity.getRef()) {
            return this.delete(entity.getRef());
        }
        this._actions[entity.getKey() + "::delete"] = new deletesourceaction_1.DeleteSourceAction(entity);
    }
    serializeSourceAction(serializedActions, from, onSync) {
        if (from >= Object.keys(this._actions).length) {
            if (onSync) {
                onSync();
            }
            return;
        }
        const key = Object.keys(this._actions)[from];
        const action = this._actions[key];
        action.sync(action.entity.getSource(), () => {
            serializedActions[key] = sourceactionfactory_1.SourceActionFactory.serialize(action);
            this.serializeSourceAction(serializedActions, from + 1, onSync);
        });
    }
    deserializeSourceAction(deserializedActions, entities, actions, from, onSync) {
        if (from >= Object.keys(actions).length) {
            if (onSync) {
                onSync();
            }
            return;
        }
        const key = Object.keys(actions)[from];
        const action = actions[key];
        if (!this._entities[action["entityKey"]]) {
            this._entities[action["entityKey"]] = entityfactory_1.EntityFactory.newEntity(this, action["entity"], this._entities[action["refKey"]]);
        }
        const entity = this._entities[action["entityKey"]];
        entity.deserialize(action["entity"]);
        deserializedActions[key] = sourceactionfactory_1.SourceActionFactory.deserialize(action, entity);
        const entityClass = deserializedActions[key].entity.getName();
        if (this._sources[entityClass]) {
            deserializedActions[key].sync(this._sources[entityClass], () => {
                entities[entityClass] = deserializedActions[key].entity;
                this.deserializeSourceAction(deserializedActions, entities, actions, from + 1, onSync);
            });
            return;
        }
        this.deserializeSourceAction(deserializedActions, entities, actions, from + 1, onSync);
    }
    syncSourceAction(entities, onSync) {
        if (Object.keys(this._actions).length === 0) {
            if (onSync) {
                onSync();
            }
            return;
        }
        const key = Object.keys(this._actions)[0];
        const sourceAction = this._actions[key];
        const entityClass = sourceAction.entity.getName();
        if (entities[entityClass]) {
            sourceAction.entity.deserialize(entities[entityClass]);
            if (this._sources[entityClass]) {
                sourceAction.sync(this._sources[entityClass], () => {
                    delete this._actions[key];
                    this.syncSourceAction(entities, onSync);
                });
                return;
            }
        }
        delete this._actions[key];
        this.syncSourceAction(entities, onSync);
    }
}
exports.EntityStore = EntityStore;


/***/ }),

/***/ "./loadsourceaction.ts":
/*!*****************************!*\
  !*** ./loadsourceaction.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadSourceAction = void 0;
const entityfactory_1 = __webpack_require__(/*! ./entityfactory */ "./entityfactory.ts");
const sourceaction_1 = __webpack_require__(/*! ./sourceaction */ "./sourceaction.ts");
class LoadSourceAction extends sourceaction_1.SourceAction {
    constructor(entity) {
        super("LoadSourceAction", entity);
    }
    sync(source, onSync) {
        const serializedEntity = this.entity.serialize();
        const entityData = entityfactory_1.EntityFactory.buildEntityDataFromSchema(serializedEntity);
        source.load(entityData, (loadedEntity) => {
            this.validateLoad(loadedEntity);
            const entitySchema = entityfactory_1.EntityFactory.buildEntitySchemaFromData(this.entity, loadedEntity);
            this.entity.deserialize(entitySchema);
            onSync();
        });
    }
}
exports.LoadSourceAction = LoadSourceAction;


/***/ }),

/***/ "./nullsource.ts":
/*!***********************!*\
  !*** ./nullsource.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NullSource = void 0;
const source_1 = __webpack_require__(/*! ./source */ "./source.ts");
class NullSource extends source_1.Source {
    load(entity, onLoad) {
        onLoad(entity);
    }
    update(entity, onUpdate) {
        onUpdate(entity);
    }
    delete(entity, onDelete) {
        onDelete();
    }
}
exports.NullSource = NullSource;


/***/ }),

/***/ "./nullsourceaction.ts":
/*!*****************************!*\
  !*** ./nullsourceaction.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NullSourceAction = void 0;
const sourceaction_1 = __webpack_require__(/*! ./sourceaction */ "./sourceaction.ts");
class NullSourceAction extends sourceaction_1.SourceAction {
    constructor(entity) {
        super("NullSourceAction", entity);
    }
    sync(source) {
        throw new Error("NullSourceAction: method not implemented.");
    }
}
exports.NullSourceAction = NullSourceAction;


/***/ }),

/***/ "./source.ts":
/*!*******************!*\
  !*** ./source.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Source = void 0;
class Source {
    constructor(data) {
        this._data = data;
    }
    get data() {
        return this._data;
    }
}
exports.Source = Source;


/***/ }),

/***/ "./sourceaction.ts":
/*!*************************!*\
  !*** ./sourceaction.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SourceAction = void 0;
class SourceAction {
    constructor(type, entity) {
        this._type = type;
        this._entity = entity;
    }
    get type() {
        return this._type;
    }
    get entity() {
        return this._entity;
    }
    set entity(value) {
        this._entity = value;
    }
    validateLoad(serializedEntity) {
        /*$validators = $this->entity->getEntityStore()->getLoadValidators();

        $entityClass = $this->getEntity()->name;

        if(array_key_exists($entityClass, $validators)) {
            $updateValidator = $validators[$entityClass];

            if(!$updateValidator->isValid($serializedEntity)) {
                throw new EntityLoadValidationException($updateValidator->getPropertyErrors());
            }
        }*/
    }
    validateUpdate(serializedEntity) {
        /*$validators = $this->entity->getEntityStore()->getUpdateValidators();

        $entityClass = $this->getEntity()->name;

        if(array_key_exists($entityClass, $validators)) {
            $updateValidator = $validators[$entityClass];

            if(!$updateValidator->isValid($serializedEntity)) {
                throw new EntityUpdateValidationException($updateValidator->getPropertyErrors());
            }
        }*/
    }
    validateDelete(serializedEntity) {
        /*$validators = $this->entity->getEntityStore()->getDeleteValidators();

        $entityClass = $this->getEntity()->name;

        if(array_key_exists($entityClass, $validators)) {
            $updateValidator = $validators[$entityClass];

            if(!$updateValidator->isValid($serializedEntity)) {
                throw new EntityDeleteValidationException($updateValidator->getPropertyErrors());
            }
        }*/
    }
}
exports.SourceAction = SourceAction;


/***/ }),

/***/ "./sourceactionfactory.ts":
/*!********************************!*\
  !*** ./sourceactionfactory.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SourceActionFactory = void 0;
const deletesourceaction_1 = __webpack_require__(/*! ./deletesourceaction */ "./deletesourceaction.ts");
const loadsourceaction_1 = __webpack_require__(/*! ./loadsourceaction */ "./loadsourceaction.ts");
const nullsourceaction_1 = __webpack_require__(/*! ./nullsourceaction */ "./nullsourceaction.ts");
const updatesourceaction_1 = __webpack_require__(/*! ./updatesourceaction */ "./updatesourceaction.ts");
class SourceActionFactory {
    static serialize(sourceAction) {
        const serializedSourceAction = {};
        serializedSourceAction["type"] = sourceAction.type;
        serializedSourceAction["entityKey"] = sourceAction.entity.getKey();
        serializedSourceAction["entityType"] = sourceAction.entity.getName();
        serializedSourceAction["entity"] = sourceAction.entity.serialize();
        serializedSourceAction["refKey"] = sourceAction.entity.getRef() ? sourceAction.entity.getRef().getKey() : undefined;
        return serializedSourceAction;
    }
    static deserialize(serializedSourceAction, entity) {
        switch (serializedSourceAction["type"]) {
            case "LoadSourceAction":
                return new loadsourceaction_1.LoadSourceAction(entity);
            case "UpdateSourceAction":
                return new updatesourceaction_1.UpdateSourceAction(entity);
            case "DeleteSourceAction":
                return new deletesourceaction_1.DeleteSourceAction(entity);
        }
        return new nullsourceaction_1.NullSourceAction(entity);
    }
}
exports.SourceActionFactory = SourceActionFactory;


/***/ }),

/***/ "./updatesourceaction.ts":
/*!*******************************!*\
  !*** ./updatesourceaction.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateSourceAction = void 0;
const entityfactory_1 = __webpack_require__(/*! ./entityfactory */ "./entityfactory.ts");
const sourceaction_1 = __webpack_require__(/*! ./sourceaction */ "./sourceaction.ts");
class UpdateSourceAction extends sourceaction_1.SourceAction {
    constructor(entity) {
        super("UpdateSourceAction", entity);
    }
    sync(source, onSync) {
        const serializedEntity = this.entity.serialize();
        const entityData = entityfactory_1.EntityFactory.buildEntityDataFromSchema(serializedEntity);
        this.validateUpdate(entityData);
        source.update(entityData, (updatedEntity) => {
            const entitySchema = entityfactory_1.EntityFactory.buildEntitySchemaFromData(this.entity, updatedEntity);
            this.entity.deserialize(entitySchema);
            onSync();
        });
    }
}
exports.UpdateSourceAction = UpdateSourceAction;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*****************!*\
  !*** ./main.ts ***!
  \*****************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Bridge = exports.Source = exports.Entity = exports.EntityFactory = exports.EntityStore = void 0;
const entitystore_1 = __webpack_require__(/*! ./entitystore */ "./entitystore.ts");
Object.defineProperty(exports, "EntityStore", ({ enumerable: true, get: function () { return entitystore_1.EntityStore; } }));
const entityfactory_1 = __webpack_require__(/*! ./entityfactory */ "./entityfactory.ts");
Object.defineProperty(exports, "EntityFactory", ({ enumerable: true, get: function () { return entityfactory_1.EntityFactory; } }));
const entity_1 = __webpack_require__(/*! ./entity */ "./entity.ts");
Object.defineProperty(exports, "Entity", ({ enumerable: true, get: function () { return entity_1.Entity; } }));
const source_1 = __webpack_require__(/*! ./source */ "./source.ts");
Object.defineProperty(exports, "Source", ({ enumerable: true, get: function () { return source_1.Source; } }));
const bridge_1 = __webpack_require__(/*! ./bridge */ "./bridge.ts");
Object.defineProperty(exports, "Bridge", ({ enumerable: true, get: function () { return bridge_1.Bridge; } }));

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=entitystore.js.map