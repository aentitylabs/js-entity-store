var EntityStore;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./deletesourceaction.ts":
/*!*******************************!*\
  !*** ./deletesourceaction.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteSourceAction = void 0;
const sourceaction_1 = __webpack_require__(/*! ./sourceaction */ "./sourceaction.ts");
class DeleteSourceAction extends sourceaction_1.SourceAction {
    constructor(entity) {
        super("DeleteSourceAction", entity);
    }
    sync(source) {
        const serializedEntity = this.entity.serialize();
        this.validateDelete(serializedEntity);
        source.delete(serializedEntity);
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
        if (target.properties[property]) {
            return target.properties[property].value;
        }
        return target[property];
    }
    set(obj, property, value) {
        if (obj.properties[property]) {
            obj.properties[property].value = value;
            obj.entityStore.update(obj);
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

/***/ "./loadsourceaction.ts":
/*!*****************************!*\
  !*** ./loadsourceaction.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadSourceAction = void 0;
const sourceaction_1 = __webpack_require__(/*! ./sourceaction */ "./sourceaction.ts");
class LoadSourceAction extends sourceaction_1.SourceAction {
    constructor(entity) {
        super("LoadSourceAction", entity);
    }
    sync(source) {
        const serializedEntity = this.entity.serialize();
        const serializedLoadedEntity = source.load(serializedEntity);
        this.validateLoad(serializedLoadedEntity);
        this.entity.deserialize(serializedLoadedEntity);
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
    load(entity) {
    }
    update(entity) {
    }
    delete(entity) {
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
        serializedSourceAction["entityKey"] = sourceAction.entity.key;
        serializedSourceAction["entityType"] = sourceAction.entity.name;
        serializedSourceAction["entity"] = sourceAction.entity.serialize();
        serializedSourceAction["refKey"] = sourceAction.entity.ref ? sourceAction.entity.ref.key : undefined;
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
const sourceaction_1 = __webpack_require__(/*! ./sourceaction */ "./sourceaction.ts");
class UpdateSourceAction extends sourceaction_1.SourceAction {
    constructor(entity) {
        super("UpdateSourceAction", entity);
    }
    sync(source) {
        const serializedEntity = this.entity.serialize();
        this.validateUpdate(serializedEntity);
        const serializedLoadedEntity = source.update(serializedEntity);
        this.entity.deserialize(serializedLoadedEntity);
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
/*!************************!*\
  !*** ./entitystore.ts ***!
  \************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityStore = void 0;
const deletesourceaction_1 = __webpack_require__(/*! ./deletesourceaction */ "./deletesourceaction.ts");
const entityfactory_1 = __webpack_require__(/*! ./entityfactory */ "./entityfactory.ts");
const loadsourceaction_1 = __webpack_require__(/*! ./loadsourceaction */ "./loadsourceaction.ts");
const sourceactionfactory_1 = __webpack_require__(/*! ./sourceactionfactory */ "./sourceactionfactory.ts");
const updatesourceaction_1 = __webpack_require__(/*! ./updatesourceaction */ "./updatesourceaction.ts");
class EntityStore {
    constructor() {
        this._sources = {};
        this._entities = {};
        this._actions = {};
    }
    get actions() {
        return this._actions;
    }
    addSource(entityName, source) {
        this._sources[entityName] = source;
    }
    register(entity, source) {
        this._entities[entity.key] = entity;
        if (!source) {
            entity.source = this._sources[entity.name];
        }
        else {
            entity.source = source;
        }
    }
    sync() {
        while (Object.keys(this._actions).length > 0) {
            const key = Object.keys(this._actions)[0];
            const sourceAction = this._actions[key];
            //TODO: gestire entità con source a null (null pattern!?)
            /*$entityClass = get_class($sourceAction->getEntity());

            if(array_key_exists($entityClass, $this->sources)) {
                $sourceAction->sync($this->sources[get_class($sourceAction->getEntity())]);
            }*/
            sourceAction.sync(sourceAction.entity.source);
            delete this._actions[key];
        }
    }
    syncTo(bridge) {
        const serializedActions = {};
        for (const key in this._actions) {
            const action = this._actions[key];
            //$entityClass = get_class($action->getEntity());
            //if(array_key_exists($entityClass, $this->sources)) {
            action.sync(action.entity.source);
            //}
            serializedActions[key] = sourceactionfactory_1.SourceActionFactory.serialize(action);
        }
        const entities = bridge.send(serializedActions);
        while (Object.keys(this._actions).length > 0) {
            const key = Object.keys(this._actions)[0];
            const sourceAction = this._actions[key];
            const entityClass = sourceAction.entity.name;
            if (entities[entityClass]) {
                sourceAction.entity.deserialize(entities[entityClass]);
                sourceAction.sync(this._sources[entityClass]);
            }
            delete this._actions[key];
        }
    }
    syncFrom(bridge, receivedActions) {
        const deserializedActions = {};
        const entities = {};
        for (const key in receivedActions) {
            const action = receivedActions[key];
            if (!this._entities[action["entityKey"]]) {
                this._entities[action["entityKey"]] = entityfactory_1.EntityFactory.newEntity(this, action["entity"], this._entities[action["refKey"]]);
            }
            const entity = this._entities[action["entityKey"]];
            entity.deserialize(action["entity"]);
            deserializedActions[key] = sourceactionfactory_1.SourceActionFactory.deserialize(action, entity);
            const entityClass = deserializedActions[key].entity.name;
            if (this._sources[entityClass]) {
                deserializedActions[key].sync(this._sources[entityClass]);
                entities[entityClass] = deserializedActions[key].entity.serialize();
            }
        }
        this.sync();
        bridge.reply(entities);
    }
    load(entity) {
        if (entity.isReferenced && !entity.isItem && entity.ref) {
            return this.load(entity.ref);
        }
        this._actions[entity.key + "::load"] = new loadsourceaction_1.LoadSourceAction(entity);
    }
    update(entity) {
        if (entity.isReferenced && !entity.isItem && entity.ref) {
            return this.update(entity.ref);
        }
        this._actions[entity.key + "::update"] = new updatesourceaction_1.UpdateSourceAction(entity);
    }
    delete(entity) {
        if (entity.isReferenced && !entity.isItem && entity.ref) {
            return this.delete(entity.ref);
        }
        this._actions[entity.key + "::delete"] = new deletesourceaction_1.DeleteSourceAction(entity);
    }
}
exports.EntityStore = EntityStore;

})();

EntityStore = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SSxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ3BELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDaEM7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRU0sTUFBTSxDQUFDLE1BQWM7UUFDeEIsSUFBRyxNQUFNLENBQUMsWUFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ3BELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEM7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsSUFBSSx1Q0FBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRU0sTUFBTSxDQUFDLE1BQWM7UUFDeEIsSUFBRyxNQUFNLENBQUMsWUFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ3BELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEM7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsSUFBSSx1Q0FBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1RSxDQUFDO0NBQ0o7QUFuSUQsa0NBbUlDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vRW50aXR5U3RvcmUvQzpcXHdvcmtcXGFlbnRpdHlcXHdvcmtzcGFjZVxcanMtZW50aXR5LXN0b3JlXFxzcmNcXGRlbGV0ZXNvdXJjZWFjdGlvbi50cyIsIndlYnBhY2s6Ly9FbnRpdHlTdG9yZS9DOlxcd29ya1xcYWVudGl0eVxcd29ya3NwYWNlXFxqcy1lbnRpdHktc3RvcmVcXHNyY1xcZW50aXR5LnRzIiwid2VicGFjazovL0VudGl0eVN0b3JlL0M6XFx3b3JrXFxhZW50aXR5XFx3b3Jrc3BhY2VcXGpzLWVudGl0eS1zdG9yZVxcc3JjXFxlbnRpdHlmYWN0b3J5LnRzIiwid2VicGFjazovL0VudGl0eVN0b3JlL0M6XFx3b3JrXFxhZW50aXR5XFx3b3Jrc3BhY2VcXGpzLWVudGl0eS1zdG9yZVxcc3JjXFxlbnRpdHloYW5kbGVyLnRzIiwid2VicGFjazovL0VudGl0eVN0b3JlL0M6XFx3b3JrXFxhZW50aXR5XFx3b3Jrc3BhY2VcXGpzLWVudGl0eS1zdG9yZVxcc3JjXFxlbnRpdHlwcm9wZXJ0eS50cyIsIndlYnBhY2s6Ly9FbnRpdHlTdG9yZS9DOlxcd29ya1xcYWVudGl0eVxcd29ya3NwYWNlXFxqcy1lbnRpdHktc3RvcmVcXHNyY1xcbG9hZHNvdXJjZWFjdGlvbi50cyIsIndlYnBhY2s6Ly9FbnRpdHlTdG9yZS9DOlxcd29ya1xcYWVudGl0eVxcd29ya3NwYWNlXFxqcy1lbnRpdHktc3RvcmVcXHNyY1xcbnVsbHNvdXJjZS50cyIsIndlYnBhY2s6Ly9FbnRpdHlTdG9yZS9DOlxcd29ya1xcYWVudGl0eVxcd29ya3NwYWNlXFxqcy1lbnRpdHktc3RvcmVcXHNyY1xcbnVsbHNvdXJjZWFjdGlvbi50cyIsIndlYnBhY2s6Ly9FbnRpdHlTdG9yZS9DOlxcd29ya1xcYWVudGl0eVxcd29ya3NwYWNlXFxqcy1lbnRpdHktc3RvcmVcXHNyY1xcc291cmNlLnRzIiwid2VicGFjazovL0VudGl0eVN0b3JlL0M6XFx3b3JrXFxhZW50aXR5XFx3b3Jrc3BhY2VcXGpzLWVudGl0eS1zdG9yZVxcc3JjXFxzb3VyY2VhY3Rpb24udHMiLCJ3ZWJwYWNrOi8vRW50aXR5U3RvcmUvQzpcXHdvcmtcXGFlbnRpdHlcXHdvcmtzcGFjZVxcanMtZW50aXR5LXN0b3JlXFxzcmNcXHNvdXJjZWFjdGlvbmZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vRW50aXR5U3RvcmUvQzpcXHdvcmtcXGFlbnRpdHlcXHdvcmtzcGFjZVxcanMtZW50aXR5LXN0b3JlXFxzcmNcXHVwZGF0ZXNvdXJjZWFjdGlvbi50cyIsIndlYnBhY2s6Ly9FbnRpdHlTdG9yZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9FbnRpdHlTdG9yZS9DOlxcd29ya1xcYWVudGl0eVxcd29ya3NwYWNlXFxqcy1lbnRpdHktc3RvcmVcXHNyY1xcZW50aXR5c3RvcmUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4vZW50aXR5XCI7XHJcbmltcG9ydCB7IFNvdXJjZSB9IGZyb20gXCIuL3NvdXJjZVwiO1xyXG5pbXBvcnQgeyBTb3VyY2VBY3Rpb24gfSBmcm9tIFwiLi9zb3VyY2VhY3Rpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEZWxldGVTb3VyY2VBY3Rpb24gZXh0ZW5kcyBTb3VyY2VBY3Rpb24ge1xyXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFbnRpdHkpIHtcclxuICAgICAgICBzdXBlcihcIkRlbGV0ZVNvdXJjZUFjdGlvblwiLCBlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzeW5jKHNvdXJjZTogU291cmNlKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3Qgc2VyaWFsaXplZEVudGl0eSA9IHRoaXMuZW50aXR5LnNlcmlhbGl6ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnZhbGlkYXRlRGVsZXRlKHNlcmlhbGl6ZWRFbnRpdHkpO1xyXG5cclxuICAgICAgICBzb3VyY2UuZGVsZXRlKHNlcmlhbGl6ZWRFbnRpdHkpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRW50aXR5RmFjdG9yeSB9IGZyb20gXCIuL2VudGl0eWZhY3RvcnlcIjtcclxuaW1wb3J0IHsgRW50aXR5UHJvcGVydHkgfSBmcm9tIFwiLi9lbnRpdHlwcm9wZXJ0eVwiO1xyXG5pbXBvcnQgeyBFbnRpdHlTdG9yZSB9IGZyb20gXCIuL2VudGl0eXN0b3JlXCI7XHJcbmltcG9ydCB7IE51bGxTb3VyY2UgfSBmcm9tIFwiLi9udWxsc291cmNlXCI7XHJcbmltcG9ydCB7IFNvdXJjZSB9IGZyb20gXCIuL3NvdXJjZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVudGl0eSB7XHJcbiAgICBwcml2YXRlIF9lbnRpdHlTdG9yZTogRW50aXR5U3RvcmU7XHJcbiAgICBwcm90ZWN0ZWQgX3Byb3BlcnRpZXM6IGFueSA9IHt9O1xyXG4gICAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfa2V5OiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9yZWY6IEVudGl0eXx1bmRlZmluZWQ7XHJcbiAgICBwcml2YXRlIF9pc1JlZmVyZW5jZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgX3NvdXJjZTogU291cmNlID0gbmV3IE51bGxTb3VyY2UoKTtcclxuICAgIHByaXZhdGUgX2lzSXRlbTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfaXNDb2xsZWN0aW9uOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcm90ZWN0ZWQgX2l0ZW06IGFueSA9IHt9O1xyXG5cclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZW50aXR5U3RvcmU6IEVudGl0eVN0b3JlLCBuYW1lOiBzdHJpbmcsIHJlZj86IEVudGl0eSwgaXRlbT86IGFueSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9lbnRpdHlTdG9yZSA9IGVudGl0eVN0b3JlO1xyXG5cclxuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLl9rZXkgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuX2l0ZW0gPSBpdGVtO1xyXG4gICAgICAgIHRoaXMuX2lzQ29sbGVjdGlvbiA9IGl0ZW0gPyB0cnVlIDogZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBzb3VyY2U7XHJcblxyXG4gICAgICAgIGlmKHJlZiAhPSBudWxsICYmIHJlZiAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fa2V5ID0gcmVmLmtleSArIFwiPT5cIiArIHRoaXMuX2tleTtcclxuICAgICAgICAgICAgdGhpcy5faXNSZWZlcmVuY2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgc291cmNlID0gcmVmLl9zb3VyY2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9yZWYgPSByZWY7XHJcblxyXG4gICAgICAgIHRoaXMuX2VudGl0eVN0b3JlLnJlZ2lzdGVyKHRoaXMsIHNvdXJjZSk7XHJcblxyXG4gICAgICAgIGlmKCFyZWYpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5fZW50aXR5U3RvcmUubG9hZCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBrZXkodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2tleSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQga2V5KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2tleTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHJlZigpOiBFbnRpdHl8dW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVmO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcHJvcGVydGllcygpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBlbnRpdHlTdG9yZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW50aXR5U3RvcmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBzb3VyY2Uoc291cmNlOiBTb3VyY2UpIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBpc1JlZmVyZW5jZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzUmVmZXJlbmNlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGlzSXRlbSh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX2lzSXRlbSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNJdGVtKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0l0ZW07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZSgpIHtcclxuICAgICAgICB0aGlzLl9lbnRpdHlTdG9yZS5kZWxldGUodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcGVydGllc1tpbmRleF0udmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZCgpOiBFbnRpdHkge1xyXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IEVudGl0eUZhY3RvcnkubmV3RW50aXR5KHRoaXMuX2VudGl0eVN0b3JlLCB0aGlzLl9pdGVtLCB0aGlzKTtcclxuXHJcbiAgICAgICAgZW50aXR5LmRlc2VyaWFsaXplKHRoaXMuX2l0ZW0pO1xyXG5cclxuICAgICAgICBjb25zdCBjb2xsZWN0aW9uU2l6ZSA9IE9iamVjdC5rZXlzKHRoaXMuX3Byb3BlcnRpZXMpLmxlbmd0aDtcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcGVydGllc1tjb2xsZWN0aW9uU2l6ZV0gPSBlbnRpdHk7XHJcblxyXG4gICAgICAgIGVudGl0eS5fa2V5ID0gZW50aXR5Ll9rZXkgKyBcIltcIiArIChjb2xsZWN0aW9uU2l6ZSkgKyBcIl1cIjtcclxuXHJcbiAgICAgICAgZW50aXR5Ll9pc0l0ZW0gPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLmVudGl0eVN0b3JlLnJlZ2lzdGVyKGVudGl0eSwgdGhpcy5fc291cmNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZW50aXR5U3RvcmUudXBkYXRlKGVudGl0eSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2VudGl0eVN0b3JlLmxvYWQodGhpcyk7XHJcblxyXG4gICAgICAgIHJldHVybiBlbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZShpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgdG9SZW1vdmUgPSB0aGlzLmdldChpbmRleCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2VudGl0eVN0b3JlLmRlbGV0ZSh0b1JlbW92ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2VudGl0eVN0b3JlLmxvYWQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlcmlhbGl6ZSgpOiBhbnkge1xyXG4gICAgICAgIGNvbnN0IHNlcmlhbGl6ZWRFbnRpdHk6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICBzZXJpYWxpemVkRW50aXR5W1wiZW50aXR5XCJdID0gdGhpcy5fbmFtZTtcclxuICAgICAgICBzZXJpYWxpemVkRW50aXR5W1wicHJvcGVydGllc1wiXSA9IHt9O1xyXG4gICAgICAgIHNlcmlhbGl6ZWRFbnRpdHlbXCJyZWZcIl0gPSB0aGlzLl9pc1JlZmVyZW5jZWQ7XHJcblxyXG4gICAgICAgIGZvcih2YXIga2V5IGluIHRoaXMuX3Byb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgc2VyaWFsaXplZEVudGl0eVtcInByb3BlcnRpZXNcIl1ba2V5XSA9IHRoaXMuX3Byb3BlcnRpZXNba2V5XS5zZXJpYWxpemUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzZXJpYWxpemVkRW50aXR5O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZGVzZXJpYWxpemUoZW50aXR5OiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9uYW1lID0gZW50aXR5W1wiZW50aXR5XCJdO1xyXG5cclxuICAgICAgICBpZighZW50aXR5W1wicHJvcGVydGllc1wiXSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaSA9IDA7XHJcblxyXG4gICAgICAgIGZvcihsZXQga2V5IGluIGVudGl0eVtcInByb3BlcnRpZXNcIl0pIHtcclxuICAgICAgICAgICAgY29uc3QgZW50aXR5UHJvcGVydHkgPSBuZXcgRW50aXR5UHJvcGVydHkodGhpcy5fZW50aXR5U3RvcmUsIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgZW50aXR5UHJvcGVydHkuZGVzZXJpYWxpemUoZW50aXR5W1wicHJvcGVydGllc1wiXVtrZXldKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3Byb3BlcnRpZXNba2V5XSA9IGVudGl0eVByb3BlcnR5O1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5faXNDb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbnRpdHlJdGVtID0gZW50aXR5UHJvcGVydHkudmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgZW50aXR5SXRlbS5rZXkgPSBlbnRpdHlJdGVtLmtleSArIFwiW1wiICsgaSArIFwiXVwiO1xyXG5cclxuICAgICAgICAgICAgICAgIGVudGl0eUl0ZW0uaXNJdGVtID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbnRpdHlTdG9yZS5yZWdpc3RlcihlbnRpdHlJdGVtLCB0aGlzLnNvdXJjZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4vZW50aXR5XCI7XHJcbmltcG9ydCB7IEVudGl0eUhhbmRsZXIgfSBmcm9tIFwiLi9lbnRpdHloYW5kbGVyXCI7XHJcbmltcG9ydCB7IEVudGl0eVN0b3JlIH0gZnJvbSBcIi4vZW50aXR5c3RvcmVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFbnRpdHlGYWN0b3J5IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgbmV3RW50aXR5KGVudGl0eVN0b3JlOiBFbnRpdHlTdG9yZSwgZW50aXR5OiBhbnksIHJlZj86IEVudGl0eSkge1xyXG4gICAgICAgIGxldCBuZXdFbnRpdHk6IEVudGl0eXxudWxsID0gbnVsbDtcclxuICAgICAgICBcclxuICAgICAgICBpZihlbnRpdHlbXCJjb2xsZWN0aW9uSXRlbVwiXSkge1xyXG4gICAgICAgICAgICBuZXdFbnRpdHkgPSBuZXcgRW50aXR5KGVudGl0eVN0b3JlLCBlbnRpdHlbXCJlbnRpdHlcIl0sIHJlZiwgZW50aXR5W1wiY29sbGVjdGlvbkl0ZW1cIl0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbmV3RW50aXR5ID0gbmV3IEVudGl0eShlbnRpdHlTdG9yZSwgZW50aXR5W1wiZW50aXR5XCJdLCByZWYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbmV3RW50aXR5LmRlc2VyaWFsaXplKGVudGl0eSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGVudGl0eVByb3h5ID0gbmV3IFByb3h5KG5ld0VudGl0eSwgbmV3IEVudGl0eUhhbmRsZXIoKSlcclxuXHJcbiAgICAgICAgcmV0dXJuIGVudGl0eVByb3h5O1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBFbnRpdHlIYW5kbGVyIHtcclxuICAgIGdldCh0YXJnZXQ6IGFueSwgcHJvcGVydHk6IGFueSwgcmVjZWl2ZXI6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYodGFyZ2V0LnByb3BlcnRpZXNbcHJvcGVydHldKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQucHJvcGVydGllc1twcm9wZXJ0eV0udmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BlcnR5XTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQob2JqOiBhbnksIHByb3BlcnR5OiBhbnksIHZhbHVlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZihvYmoucHJvcGVydGllc1twcm9wZXJ0eV0pIHtcclxuICAgICAgICAgICAgb2JqLnByb3BlcnRpZXNbcHJvcGVydHldLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICBvYmouZW50aXR5U3RvcmUudXBkYXRlKG9iaik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9ialtwcm9wZXJ0eV0gPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi9lbnRpdHlcIjtcclxuaW1wb3J0IHsgRW50aXR5RmFjdG9yeSB9IGZyb20gXCIuL2VudGl0eWZhY3RvcnlcIjtcclxuaW1wb3J0IHsgRW50aXR5U3RvcmUgfSBmcm9tIFwiLi9lbnRpdHlzdG9yZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVudGl0eVByb3BlcnR5IHtcclxuICAgIHByaXZhdGUgX2VudGl0eVN0b3JlOiBFbnRpdHlTdG9yZTtcclxuICAgIHByaXZhdGUgX3JlZjogRW50aXR5fHVuZGVmaW5lZDtcclxuICAgIHByaXZhdGUgX2lzRW50aXR5OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF92YWx1ZTogYW55O1xyXG5cclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZW50aXR5U3RvcmU6IEVudGl0eVN0b3JlLCByZWY/OiBFbnRpdHkpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fZW50aXR5U3RvcmUgPSBlbnRpdHlTdG9yZTtcclxuICAgICAgICB0aGlzLl9yZWYgPSByZWY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBpc0VudGl0eSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNFbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB2YWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlcmlhbGl6ZSgpOiBhbnkge1xyXG4gICAgICAgIGlmKHRoaXMuX2lzRW50aXR5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZS5zZXJpYWxpemUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwidmFsdWVcIjogdGhpcy5fdmFsdWVcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZGVzZXJpYWxpemUoZW50aXR5UHJvcGVydHk6IGFueSkge1xyXG4gICAgICAgIGlmKGVudGl0eVByb3BlcnR5W1wiZW50aXR5XCJdKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlZjogRW50aXR5fHVuZGVmaW5lZCA9IGVudGl0eVByb3BlcnR5W1wicmVmXCJdID09PSB0cnVlID8gdGhpcy5fcmVmIDogdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBFbnRpdHlGYWN0b3J5Lm5ld0VudGl0eSh0aGlzLl9lbnRpdHlTdG9yZSwgZW50aXR5UHJvcGVydHksIHJlZik7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzRW50aXR5ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlLmRlc2VyaWFsaXplKGVudGl0eVByb3BlcnR5KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3ZhbHVlID0gZW50aXR5UHJvcGVydHlbXCJ2YWx1ZVwiXTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEVudGl0eSB9IGZyb20gXCIuL2VudGl0eVwiO1xyXG5pbXBvcnQgeyBTb3VyY2UgfSBmcm9tIFwiLi9zb3VyY2VcIjtcclxuaW1wb3J0IHsgU291cmNlQWN0aW9uIH0gZnJvbSBcIi4vc291cmNlYWN0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZFNvdXJjZUFjdGlvbiBleHRlbmRzIFNvdXJjZUFjdGlvbiB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEVudGl0eSkge1xyXG4gICAgICAgIHN1cGVyKFwiTG9hZFNvdXJjZUFjdGlvblwiLCBlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzeW5jKHNvdXJjZTogU291cmNlKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3Qgc2VyaWFsaXplZEVudGl0eTogYW55ID0gdGhpcy5lbnRpdHkuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHNlcmlhbGl6ZWRMb2FkZWRFbnRpdHkgPSBzb3VyY2UubG9hZChzZXJpYWxpemVkRW50aXR5KTtcclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZUxvYWQoc2VyaWFsaXplZExvYWRlZEVudGl0eSk7XHJcblxyXG4gICAgICAgIHRoaXMuZW50aXR5LmRlc2VyaWFsaXplKHNlcmlhbGl6ZWRMb2FkZWRFbnRpdHkpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgU291cmNlIH0gZnJvbSBcIi4vc291cmNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTnVsbFNvdXJjZSBleHRlbmRzIFNvdXJjZSB7XHJcbiAgICBwdWJsaWMgbG9hZChlbnRpdHk6IGFueSkge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgdXBkYXRlKGVudGl0eTogYW55KSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZShlbnRpdHk6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEVudGl0eSB9IGZyb20gXCIuL2VudGl0eVwiO1xyXG5pbXBvcnQgeyBTb3VyY2UgfSBmcm9tIFwiLi9zb3VyY2VcIjtcclxuaW1wb3J0IHsgU291cmNlQWN0aW9uIH0gZnJvbSBcIi4vc291cmNlYWN0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTnVsbFNvdXJjZUFjdGlvbiBleHRlbmRzIFNvdXJjZUFjdGlvbiB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEVudGl0eSkge1xyXG4gICAgICAgIHN1cGVyKFwiTnVsbFNvdXJjZUFjdGlvblwiLCBlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzeW5jKHNvdXJjZTogU291cmNlKTogdm9pZCB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTnVsbFNvdXJjZUFjdGlvbjogbWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgU291cmNlIHtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBsb2FkKGVudGl0eTogYW55KTogYW55O1xyXG4gICAgcHVibGljIGFic3RyYWN0IHVwZGF0ZShlbnRpdHk6IGFueSk6IGFueTtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBkZWxldGUoZW50aXR5OiBhbnkpOiB2b2lkO1xyXG59XHJcbiIsImltcG9ydCB7IEVudGl0eSB9IGZyb20gXCIuL2VudGl0eVwiO1xyXG5pbXBvcnQgeyBTb3VyY2UgfSBmcm9tIFwiLi9zb3VyY2VcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTb3VyY2VBY3Rpb24ge1xyXG4gICAgcHJpdmF0ZSBfdHlwZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfZW50aXR5OiBFbnRpdHk7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgZW50aXR5OiBFbnRpdHkpIHtcclxuICAgICAgICB0aGlzLl90eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLl9lbnRpdHkgPSBlbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IHN5bmMoc291cmNlOiBTb3VyY2UpOiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgdHlwZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGVudGl0eSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW50aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgZW50aXR5KHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fZW50aXR5ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHZhbGlkYXRlTG9hZChzZXJpYWxpemVkRW50aXR5OiBhbnkpIHtcclxuICAgICAgICAvKiR2YWxpZGF0b3JzID0gJHRoaXMtPmVudGl0eS0+Z2V0RW50aXR5U3RvcmUoKS0+Z2V0TG9hZFZhbGlkYXRvcnMoKTtcclxuXHJcbiAgICAgICAgJGVudGl0eUNsYXNzID0gJHRoaXMtPmdldEVudGl0eSgpLT5uYW1lO1xyXG5cclxuICAgICAgICBpZihhcnJheV9rZXlfZXhpc3RzKCRlbnRpdHlDbGFzcywgJHZhbGlkYXRvcnMpKSB7XHJcbiAgICAgICAgICAgICR1cGRhdGVWYWxpZGF0b3IgPSAkdmFsaWRhdG9yc1skZW50aXR5Q2xhc3NdO1xyXG5cclxuICAgICAgICAgICAgaWYoISR1cGRhdGVWYWxpZGF0b3ItPmlzVmFsaWQoJHNlcmlhbGl6ZWRFbnRpdHkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRW50aXR5TG9hZFZhbGlkYXRpb25FeGNlcHRpb24oJHVwZGF0ZVZhbGlkYXRvci0+Z2V0UHJvcGVydHlFcnJvcnMoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9Ki9cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdmFsaWRhdGVVcGRhdGUoc2VyaWFsaXplZEVudGl0eTogYW55KSB7XHJcbiAgICAgICAgLyokdmFsaWRhdG9ycyA9ICR0aGlzLT5lbnRpdHktPmdldEVudGl0eVN0b3JlKCktPmdldFVwZGF0ZVZhbGlkYXRvcnMoKTtcclxuXHJcbiAgICAgICAgJGVudGl0eUNsYXNzID0gJHRoaXMtPmdldEVudGl0eSgpLT5uYW1lO1xyXG5cclxuICAgICAgICBpZihhcnJheV9rZXlfZXhpc3RzKCRlbnRpdHlDbGFzcywgJHZhbGlkYXRvcnMpKSB7XHJcbiAgICAgICAgICAgICR1cGRhdGVWYWxpZGF0b3IgPSAkdmFsaWRhdG9yc1skZW50aXR5Q2xhc3NdO1xyXG5cclxuICAgICAgICAgICAgaWYoISR1cGRhdGVWYWxpZGF0b3ItPmlzVmFsaWQoJHNlcmlhbGl6ZWRFbnRpdHkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRW50aXR5VXBkYXRlVmFsaWRhdGlvbkV4Y2VwdGlvbigkdXBkYXRlVmFsaWRhdG9yLT5nZXRQcm9wZXJ0eUVycm9ycygpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0qL1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCB2YWxpZGF0ZURlbGV0ZShzZXJpYWxpemVkRW50aXR5OiBhbnkpIHtcclxuICAgICAgICAvKiR2YWxpZGF0b3JzID0gJHRoaXMtPmVudGl0eS0+Z2V0RW50aXR5U3RvcmUoKS0+Z2V0RGVsZXRlVmFsaWRhdG9ycygpO1xyXG5cclxuICAgICAgICAkZW50aXR5Q2xhc3MgPSAkdGhpcy0+Z2V0RW50aXR5KCktPm5hbWU7XHJcblxyXG4gICAgICAgIGlmKGFycmF5X2tleV9leGlzdHMoJGVudGl0eUNsYXNzLCAkdmFsaWRhdG9ycykpIHtcclxuICAgICAgICAgICAgJHVwZGF0ZVZhbGlkYXRvciA9ICR2YWxpZGF0b3JzWyRlbnRpdHlDbGFzc107XHJcblxyXG4gICAgICAgICAgICBpZighJHVwZGF0ZVZhbGlkYXRvci0+aXNWYWxpZCgkc2VyaWFsaXplZEVudGl0eSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFbnRpdHlEZWxldGVWYWxpZGF0aW9uRXhjZXB0aW9uKCR1cGRhdGVWYWxpZGF0b3ItPmdldFByb3BlcnR5RXJyb3JzKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSovXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBEZWxldGVTb3VyY2VBY3Rpb24gfSBmcm9tIFwiLi9kZWxldGVzb3VyY2VhY3Rpb25cIjtcclxuaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4vZW50aXR5XCI7XHJcbmltcG9ydCB7IEVudGl0eVN0b3JlIH0gZnJvbSBcIi4vZW50aXR5c3RvcmVcIjtcclxuaW1wb3J0IHsgTG9hZFNvdXJjZUFjdGlvbiB9IGZyb20gXCIuL2xvYWRzb3VyY2VhY3Rpb25cIjtcclxuaW1wb3J0IHsgTnVsbFNvdXJjZUFjdGlvbiB9IGZyb20gXCIuL251bGxzb3VyY2VhY3Rpb25cIjtcclxuaW1wb3J0IHsgU291cmNlQWN0aW9uIH0gZnJvbSBcIi4vc291cmNlYWN0aW9uXCI7XHJcbmltcG9ydCB7IFVwZGF0ZVNvdXJjZUFjdGlvbiB9IGZyb20gXCIuL3VwZGF0ZXNvdXJjZWFjdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNvdXJjZUFjdGlvbkZhY3Rvcnkge1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXJpYWxpemUoc291cmNlQWN0aW9uOiBTb3VyY2VBY3Rpb24pOiBhbnkge1xyXG4gICAgICAgIGNvbnN0IHNlcmlhbGl6ZWRTb3VyY2VBY3Rpb246IGFueSA9IHt9O1xyXG5cclxuICAgICAgICBzZXJpYWxpemVkU291cmNlQWN0aW9uW1widHlwZVwiXSA9IHNvdXJjZUFjdGlvbi50eXBlO1xyXG4gICAgICAgIHNlcmlhbGl6ZWRTb3VyY2VBY3Rpb25bXCJlbnRpdHlLZXlcIl0gPSBzb3VyY2VBY3Rpb24uZW50aXR5LmtleTtcclxuICAgICAgICBzZXJpYWxpemVkU291cmNlQWN0aW9uW1wiZW50aXR5VHlwZVwiXSA9IHNvdXJjZUFjdGlvbi5lbnRpdHkubmFtZTtcclxuICAgICAgICBzZXJpYWxpemVkU291cmNlQWN0aW9uW1wiZW50aXR5XCJdID0gc291cmNlQWN0aW9uLmVudGl0eS5zZXJpYWxpemUoKTtcclxuICAgICAgICBzZXJpYWxpemVkU291cmNlQWN0aW9uW1wicmVmS2V5XCJdID0gc291cmNlQWN0aW9uLmVudGl0eS5yZWYgPyBzb3VyY2VBY3Rpb24uZW50aXR5LnJlZi5rZXkgOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHJldHVybiBzZXJpYWxpemVkU291cmNlQWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGVzZXJpYWxpemUoc2VyaWFsaXplZFNvdXJjZUFjdGlvbjogYW55LCBlbnRpdHk6IEVudGl0eSk6IFNvdXJjZUFjdGlvbiB7XHJcbiAgICAgICAgc3dpdGNoKHNlcmlhbGl6ZWRTb3VyY2VBY3Rpb25bXCJ0eXBlXCJdKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJMb2FkU291cmNlQWN0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IExvYWRTb3VyY2VBY3Rpb24oZW50aXR5KTtcclxuICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZVNvdXJjZUFjdGlvblwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBVcGRhdGVTb3VyY2VBY3Rpb24oZW50aXR5KTtcclxuICAgICAgICAgICAgY2FzZSBcIkRlbGV0ZVNvdXJjZUFjdGlvblwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEZWxldGVTb3VyY2VBY3Rpb24oZW50aXR5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgTnVsbFNvdXJjZUFjdGlvbihlbnRpdHkpO1xyXG4gICAgfSAgIFxyXG59IiwiaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4vZW50aXR5XCI7XHJcbmltcG9ydCB7IFNvdXJjZSB9IGZyb20gXCIuL3NvdXJjZVwiO1xyXG5pbXBvcnQgeyBTb3VyY2VBY3Rpb24gfSBmcm9tIFwiLi9zb3VyY2VhY3Rpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVcGRhdGVTb3VyY2VBY3Rpb24gZXh0ZW5kcyBTb3VyY2VBY3Rpb24ge1xyXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFbnRpdHkpIHtcclxuICAgICAgICBzdXBlcihcIlVwZGF0ZVNvdXJjZUFjdGlvblwiLCBlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzeW5jKHNvdXJjZTogU291cmNlKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3Qgc2VyaWFsaXplZEVudGl0eSA9IHRoaXMuZW50aXR5LnNlcmlhbGl6ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnZhbGlkYXRlVXBkYXRlKHNlcmlhbGl6ZWRFbnRpdHkpO1xyXG5cclxuICAgICAgICBjb25zdCBzZXJpYWxpemVkTG9hZGVkRW50aXR5ID0gc291cmNlLnVwZGF0ZShzZXJpYWxpemVkRW50aXR5KTtcclxuXHJcbiAgICAgICAgdGhpcy5lbnRpdHkuZGVzZXJpYWxpemUoc2VyaWFsaXplZExvYWRlZEVudGl0eSk7XHJcbiAgICB9XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgQnJpZGdlIH0gZnJvbSBcIi4vYnJpZGdlXCI7XHJcbmltcG9ydCB7IERlbGV0ZVNvdXJjZUFjdGlvbiB9IGZyb20gXCIuL2RlbGV0ZXNvdXJjZWFjdGlvblwiO1xyXG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi9lbnRpdHlcIjtcclxuaW1wb3J0IHsgRW50aXR5RmFjdG9yeSB9IGZyb20gXCIuL2VudGl0eWZhY3RvcnlcIjtcclxuaW1wb3J0IHsgTG9hZFNvdXJjZUFjdGlvbiB9IGZyb20gXCIuL2xvYWRzb3VyY2VhY3Rpb25cIjtcclxuaW1wb3J0IHsgU291cmNlIH0gZnJvbSBcIi4vc291cmNlXCI7XHJcbmltcG9ydCB7IFNvdXJjZUFjdGlvbiB9IGZyb20gXCIuL3NvdXJjZWFjdGlvblwiO1xyXG5pbXBvcnQgeyBTb3VyY2VBY3Rpb25GYWN0b3J5IH0gZnJvbSBcIi4vc291cmNlYWN0aW9uZmFjdG9yeVwiO1xyXG5pbXBvcnQgeyBVcGRhdGVTb3VyY2VBY3Rpb24gfSBmcm9tIFwiLi91cGRhdGVzb3VyY2VhY3Rpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFbnRpdHlTdG9yZSB7XHJcbiAgICBwcml2YXRlIF9zb3VyY2VzOiBhbnkgPSB7fTtcclxuICAgIHByaXZhdGUgX2VudGl0aWVzOiBhbnkgPSB7fTtcclxuICAgIHByaXZhdGUgX2FjdGlvbnM6IGFueSA9IHt9O1xyXG5cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFjdGlvbnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFNvdXJjZShlbnRpdHlOYW1lOiBhbnksIHNvdXJjZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlc1tlbnRpdHlOYW1lXSA9IHNvdXJjZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHJlZ2lzdGVyKGVudGl0eTogRW50aXR5LCBzb3VyY2U/OiBTb3VyY2UpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9lbnRpdGllc1tlbnRpdHkua2V5XSA9IGVudGl0eTtcclxuXHJcbiAgICAgICAgaWYoIXNvdXJjZSkge1xyXG4gICAgICAgICAgICBlbnRpdHkuc291cmNlID0gdGhpcy5fc291cmNlc1tlbnRpdHkubmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBlbnRpdHkuc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3luYygpIHtcclxuICAgICAgICB3aGlsZSAoT2JqZWN0LmtleXModGhpcy5fYWN0aW9ucykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBPYmplY3Qua2V5cyh0aGlzLl9hY3Rpb25zKVswXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZUFjdGlvbjogU291cmNlQWN0aW9uID0gdGhpcy5fYWN0aW9uc1trZXldO1xyXG5cclxuICAgICAgICAgICAgLy9UT0RPOiBnZXN0aXJlIGVudGl0w6AgY29uIHNvdXJjZSBhIG51bGwgKG51bGwgcGF0dGVybiE/KVxyXG5cclxuICAgICAgICAgICAgLyokZW50aXR5Q2xhc3MgPSBnZXRfY2xhc3MoJHNvdXJjZUFjdGlvbi0+Z2V0RW50aXR5KCkpO1xyXG5cclxuICAgICAgICAgICAgaWYoYXJyYXlfa2V5X2V4aXN0cygkZW50aXR5Q2xhc3MsICR0aGlzLT5zb3VyY2VzKSkge1xyXG4gICAgICAgICAgICAgICAgJHNvdXJjZUFjdGlvbi0+c3luYygkdGhpcy0+c291cmNlc1tnZXRfY2xhc3MoJHNvdXJjZUFjdGlvbi0+Z2V0RW50aXR5KCkpXSk7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICBzb3VyY2VBY3Rpb24uc3luYyhzb3VyY2VBY3Rpb24uZW50aXR5LnNvdXJjZSk7XHJcblxyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fYWN0aW9uc1trZXldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3luY1RvKGJyaWRnZTogQnJpZGdlKSB7XHJcbiAgICAgICAgY29uc3Qgc2VyaWFsaXplZEFjdGlvbnM6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICBmb3IoY29uc3Qga2V5IGluIHRoaXMuX2FjdGlvbnMpIHtcclxuICAgICAgICAgICAgY29uc3QgYWN0aW9uOiBTb3VyY2VBY3Rpb24gPSB0aGlzLl9hY3Rpb25zW2tleV07XHJcbiAgICAgICAgICAgIC8vJGVudGl0eUNsYXNzID0gZ2V0X2NsYXNzKCRhY3Rpb24tPmdldEVudGl0eSgpKTtcclxuXHJcbiAgICAgICAgICAgIC8vaWYoYXJyYXlfa2V5X2V4aXN0cygkZW50aXR5Q2xhc3MsICR0aGlzLT5zb3VyY2VzKSkge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uLnN5bmMoYWN0aW9uLmVudGl0eS5zb3VyY2UpO1xyXG4gICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgIHNlcmlhbGl6ZWRBY3Rpb25zW2tleV0gPSBTb3VyY2VBY3Rpb25GYWN0b3J5LnNlcmlhbGl6ZShhY3Rpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZW50aXRpZXMgPSBicmlkZ2Uuc2VuZChzZXJpYWxpemVkQWN0aW9ucyk7XHJcblxyXG4gICAgICAgIHdoaWxlIChPYmplY3Qua2V5cyh0aGlzLl9hY3Rpb25zKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IE9iamVjdC5rZXlzKHRoaXMuX2FjdGlvbnMpWzBdO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc291cmNlQWN0aW9uOiBTb3VyY2VBY3Rpb24gPSB0aGlzLl9hY3Rpb25zW2tleV07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBlbnRpdHlDbGFzcyA9IHNvdXJjZUFjdGlvbi5lbnRpdHkubmFtZTtcclxuXHJcbiAgICAgICAgICAgIGlmKGVudGl0aWVzW2VudGl0eUNsYXNzXSkge1xyXG4gICAgICAgICAgICAgICAgc291cmNlQWN0aW9uLmVudGl0eS5kZXNlcmlhbGl6ZShlbnRpdGllc1tlbnRpdHlDbGFzc10pO1xyXG5cclxuICAgICAgICAgICAgICAgIHNvdXJjZUFjdGlvbi5zeW5jKHRoaXMuX3NvdXJjZXNbZW50aXR5Q2xhc3NdKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2FjdGlvbnNba2V5XTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN5bmNGcm9tKGJyaWRnZTogQnJpZGdlLCByZWNlaXZlZEFjdGlvbnM6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IGRlc2VyaWFsaXplZEFjdGlvbnM6IGFueSA9IHt9O1xyXG4gICAgICAgIGNvbnN0IGVudGl0aWVzOiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yKGNvbnN0IGtleSBpbiByZWNlaXZlZEFjdGlvbnMpIHtcclxuICAgICAgICAgICAgY29uc3QgYWN0aW9uOiBhbnkgPSByZWNlaXZlZEFjdGlvbnNba2V5XTtcclxuXHJcbiAgICAgICAgICAgIGlmKCF0aGlzLl9lbnRpdGllc1thY3Rpb25bXCJlbnRpdHlLZXlcIl1dKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbnRpdGllc1thY3Rpb25bXCJlbnRpdHlLZXlcIl1dID0gRW50aXR5RmFjdG9yeS5uZXdFbnRpdHkodGhpcywgYWN0aW9uW1wiZW50aXR5XCJdLCB0aGlzLl9lbnRpdGllc1thY3Rpb25bXCJyZWZLZXlcIl1dKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5fZW50aXRpZXNbYWN0aW9uW1wiZW50aXR5S2V5XCJdXTtcclxuXHJcbiAgICAgICAgICAgIGVudGl0eS5kZXNlcmlhbGl6ZShhY3Rpb25bXCJlbnRpdHlcIl0pO1xyXG5cclxuICAgICAgICAgICAgZGVzZXJpYWxpemVkQWN0aW9uc1trZXldID0gU291cmNlQWN0aW9uRmFjdG9yeS5kZXNlcmlhbGl6ZShhY3Rpb24sIGVudGl0eSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBlbnRpdHlDbGFzcyA9IGRlc2VyaWFsaXplZEFjdGlvbnNba2V5XS5lbnRpdHkubmFtZTtcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuX3NvdXJjZXNbZW50aXR5Q2xhc3NdKSB7XHJcbiAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZWRBY3Rpb25zW2tleV0uc3luYyh0aGlzLl9zb3VyY2VzW2VudGl0eUNsYXNzXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZW50aXRpZXNbZW50aXR5Q2xhc3NdID0gZGVzZXJpYWxpemVkQWN0aW9uc1trZXldLmVudGl0eS5zZXJpYWxpemUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zeW5jKCk7XHJcblxyXG4gICAgICAgIGJyaWRnZS5yZXBseShlbnRpdGllcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvYWQoZW50aXR5OiBFbnRpdHkpOiB2b2lkIHtcclxuICAgICAgICBpZihlbnRpdHkuaXNSZWZlcmVuY2VkICYmICFlbnRpdHkuaXNJdGVtICYmIGVudGl0eS5yZWYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9hZChlbnRpdHkucmVmKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2FjdGlvbnNbZW50aXR5LmtleSArIFwiOjpsb2FkXCJdID0gbmV3IExvYWRTb3VyY2VBY3Rpb24oZW50aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGVudGl0eTogRW50aXR5KTogdm9pZCB7XHJcbiAgICAgICAgaWYoZW50aXR5LmlzUmVmZXJlbmNlZCAmJiAhZW50aXR5LmlzSXRlbSAmJiBlbnRpdHkucmVmKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZShlbnRpdHkucmVmKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2FjdGlvbnNbZW50aXR5LmtleSArIFwiOjp1cGRhdGVcIl0gPSBuZXcgVXBkYXRlU291cmNlQWN0aW9uKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZShlbnRpdHk6IEVudGl0eSk6IHZvaWQge1xyXG4gICAgICAgIGlmKGVudGl0eS5pc1JlZmVyZW5jZWQgJiYgIWVudGl0eS5pc0l0ZW0gJiYgZW50aXR5LnJlZikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWxldGUoZW50aXR5LnJlZik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9hY3Rpb25zW2VudGl0eS5rZXkgKyBcIjo6ZGVsZXRlXCJdID0gbmV3IERlbGV0ZVNvdXJjZUFjdGlvbihlbnRpdHkpO1xyXG4gICAgfVxyXG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9