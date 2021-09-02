"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityStore = void 0;
const deletesourceaction_1 = require("./deletesourceaction");
const entityfactory_1 = require("./entityfactory");
const loadsourceaction_1 = require("./loadsourceaction");
const sourceactionfactory_1 = require("./sourceactionfactory");
const updatesourceaction_1 = require("./updatesourceaction");
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
//# sourceMappingURL=entitystore.js.map