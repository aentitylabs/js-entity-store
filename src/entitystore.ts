import { Bridge } from "./bridge";
import { DeleteSourceAction } from "./deletesourceaction";
import { Entity } from "./entity";
import { EntityFactory } from "./entityfactory";
import { LoadSourceAction } from "./loadsourceaction";
import { NullSource } from "./nullsource";
import { Source } from "./source";
import { SourceAction } from "./sourceaction";
import { SourceActionFactory } from "./sourceactionfactory";
import { UpdateSourceAction } from "./updatesourceaction";

export class EntityStore {
    private _sources: any = {};
    private _entities: any = {};
    private _actions: any = {};


    public get actions() {
        return this._actions;
    }

    public addSource(entityName: any, source: any) {
        this._sources[entityName] = source;
    }
    
    public register(entity: Entity, source?: Source): void {
        this._entities[entity.getKey()] = entity;

        if(!source) {
            let entitySource = this._sources[entity.getName()];
            
            if(!entitySource) {
                entity.setSource(new NullSource());
            }
            else {
                entity.setSource(this._sources[entity.getName()]);
            }
        }
        else {
            entity.setSource(source);
        }
    }

    public sync() {
        while (Object.keys(this._actions).length > 0) {
            const key = Object.keys(this._actions)[0];

            const sourceAction: SourceAction = this._actions[key];

            //TODO: gestire entità con source a null (null pattern!?)

            /*$entityClass = get_class($sourceAction->getEntity());

            if(array_key_exists($entityClass, $this->sources)) {
                $sourceAction->sync($this->sources[get_class($sourceAction->getEntity())]);
            }*/
            sourceAction.sync(sourceAction.entity.getSource());

            delete this._actions[key];
        }
    }

    public syncTo(bridge: Bridge): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const serializedActions: any = {};

            for(const key in this._actions) {
                const action: SourceAction = this._actions[key];
                //$entityClass = get_class($action->getEntity());
    
                //if(array_key_exists($entityClass, $this->sources)) {
                    action.sync(action.entity.getSource());
                //}
    
                serializedActions[key] = SourceActionFactory.serialize(action);
            }

            if(Object.keys(serializedActions).length === 0) {
                return resolve();
            }
    
            bridge.send(serializedActions, (entities: any) => {
                while (Object.keys(this._actions).length > 0) {
                    const key = Object.keys(this._actions)[0];
        
                    const sourceAction: SourceAction = this._actions[key];
        
                    const entityClass = sourceAction.entity.getName();
        
                    if(entities[entityClass]) {
                        sourceAction.entity.deserialize(entities[entityClass]);
        
                        if(this._sources[entityClass]) {
                            sourceAction.sync(this._sources[entityClass]);
                        }
                    }
        
                    delete this._actions[key];
                }

                resolve();
            });
        });
    }

    public syncFrom(bridge: Bridge, receivedActions: any, onSync: any) {
        const deserializedActions: any = {};
        const entities: any = {};

        for(const key in receivedActions) {
            const action: any = receivedActions[key];

            if(!this._entities[action["entityKey"]]) {
                this._entities[action["entityKey"]] = EntityFactory.newEntity(this, action["entity"], this._entities[action["refKey"]]);
            }

            const entity = this._entities[action["entityKey"]];

            entity.deserialize(action["entity"]);

            deserializedActions[key] = SourceActionFactory.deserialize(action, entity);

            const entityClass = deserializedActions[key].entity.getName();

            if(this._sources[entityClass]) {
                deserializedActions[key].sync(this._sources[entityClass]);

                entities[entityClass] = deserializedActions[key].entity;
            }
        }

        onSync();

        this.sync();

        const serializedEntities: any = {};

        for(const key in entities) {
            serializedEntities[key] = entities[key].serialize();
        }

        bridge.reply(serializedEntities);
    }

    public load(entity: Entity): void {
        if(entity.isReferenced() && !entity.isItem() && entity.getRef()) {
            return this.load(entity.getRef());
        }

        this._actions[entity.getKey() + "::load"] = new LoadSourceAction(entity);
    }

    public update(entity: Entity): void {
        if(entity.isReferenced() && !entity.isItem() && entity.getRef()) {
            return this.update(entity.getRef());
        }

        this._actions[entity.getKey() + "::update"] = new UpdateSourceAction(entity);
    }

    public delete(entity: Entity): void {
        if(entity.isReferenced() && !entity.isItem() && entity.getRef()) {
            return this.delete(entity.getRef());
        }

        this._actions[entity.getKey() + "::delete"] = new DeleteSourceAction(entity);
    }
}