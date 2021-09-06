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
        this._entities[entity.key] = entity;

        if(!source) {
            let entitySource = this._sources[entity.name];
            
            if(!entitySource) {
                entity.source = new NullSource();    
            }
            else {
                entity.source = this._sources[entity.name];
            }
        }
        else {
            entity.source = source;
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
            sourceAction.sync(sourceAction.entity.source);

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
                    action.sync(action.entity.source);
                //}
    
                serializedActions[key] = SourceActionFactory.serialize(action);
            }
    
            bridge.send(serializedActions, (entities: any) => {
                while (Object.keys(this._actions).length > 0) {
                    const key = Object.keys(this._actions)[0];
        
                    const sourceAction: SourceAction = this._actions[key];
        
                    const entityClass = sourceAction.entity.name;
        
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

            const entityClass = deserializedActions[key].entity.name;

            if(this._sources[entityClass]) {
                if(this._sources[entityClass]) {
                    deserializedActions[key].sync(this._sources[entityClass]);
                }

                entities[entityClass] = deserializedActions[key].entity.serialize();
            }
        }

        this.sync();

        onSync();

        bridge.reply(entities);
    }

    public load(entity: Entity): void {
        if(entity.isReferenced && !entity.isItem && entity.ref) {
            return this.load(entity.ref);
        }

        this._actions[entity.key + "::load"] = new LoadSourceAction(entity);
    }

    public update(entity: Entity): void {
        if(entity.isReferenced && !entity.isItem && entity.ref) {
            return this.update(entity.ref);
        }

        this._actions[entity.key + "::update"] = new UpdateSourceAction(entity);
    }

    public delete(entity: Entity): void {
        if(entity.isReferenced && !entity.isItem && entity.ref) {
            return this.delete(entity.ref);
        }

        this._actions[entity.key + "::delete"] = new DeleteSourceAction(entity);
    }
}