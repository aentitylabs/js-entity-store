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
    private _bridges: any = {};
    private _entities: any = {};
    private _actions: any = {};


    public get actions() {
        return this._actions;
    }

    public addSource(entityName: string, source: any) {
        this._sources[entityName] = source;
    }

    public addBridge(bridgeName: string, bridge: any) {
        this._bridges[bridgeName] = bridge;
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

    public sync(onSync?: any): void {
        if(Object.keys(this._actions).length === 0) {
            if(onSync) {
                onSync();
            }

            return;
        }

        const key = Object.keys(this._actions)[0];

        const sourceAction: SourceAction = this._actions[key];

        //TODO: gestire entità con source a null (null pattern!?)

        sourceAction.sync(sourceAction.entity.getSource(), () => {
            delete this._actions[key];

            this.sync(onSync);
        });
    }

    public syncTo(bridge: string, onSync?: any): void {
        const serializedActions: any = {};

        this.serializeSourceAction(serializedActions, 0, () => {
            if(Object.keys(serializedActions).length === 0) {
                if(onSync) {
                    onSync();
                }

                return;
            }
    
            this._bridges[bridge].send(serializedActions, (entities: any) => {
                this.syncSourceAction(entities, () => {
                    if(onSync) {
                        onSync();
                    }
                });
            });
        });
    }

    public syncFrom(bridge: string, receivedActions: any, onDeserialize?: any, onReply?: any) {
        const deserializedActions: any = {};
        const entities: any = {};

        this.deserializeSourceAction(deserializedActions, entities, receivedActions, 0, () => {
            if(onDeserialize) {
                onDeserialize();
            }

            this.sync(() => {
                const serializedEntities: any = {};
    
                for(const key in entities) {
                    serializedEntities[key] = entities[key].serialize();
                }
        
                this._bridges[bridge].reply(serializedEntities, () => {
                    if(onReply) {
                        onReply();
                    }
                });
            });
        });
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

    private serializeSourceAction(serializedActions: any, from: number, onSync: any) {
        if(from >= Object.keys(this._actions).length) {
            if(onSync) {
                onSync();
            }

            return;
        }

        const key = Object.keys(this._actions)[from];

        const action: SourceAction = this._actions[key];

        action.sync(action.entity.getSource(), () => {
            serializedActions[key] = SourceActionFactory.serialize(action);

            this.serializeSourceAction(serializedActions, from + 1, onSync);
        });
    }

    private deserializeSourceAction(deserializedActions: any, entities: any, actions: any, from: number, onSync: any) {
        if(from >= Object.keys(actions).length) {
            if(onSync) {
                onSync();
            }

            return;
        }

        const key = Object.keys(actions)[from];

        const action: any = actions[key];

        if(!this._entities[action["entityKey"]]) {
            this._entities[action["entityKey"]] = EntityFactory.newEntity(this, action["entity"], this._entities[action["refKey"]]);
        }

        const entity: Entity = this._entities[action["entityKey"]];

        entity.deserialize(action["entity"]);

        deserializedActions[key] = SourceActionFactory.deserialize(action, entity);

        const entityClass = deserializedActions[key].entity.getName();

        if(this._sources[entityClass]) {
            deserializedActions[key].sync(this._sources[entityClass], () => {
                entities[entityClass] = deserializedActions[key].entity;

                this.deserializeSourceAction(deserializedActions, entities, actions, from + 1, onSync);
            });

            return;
        }

        this.deserializeSourceAction(deserializedActions, entities, actions, from + 1, onSync);
    }

    private syncSourceAction(entities: any, onSync?: any) {
        if(Object.keys(this._actions).length === 0) {
            if(onSync) {
                onSync();
            }

            return;
        }

        const key = Object.keys(this._actions)[0];

        const sourceAction: SourceAction = this._actions[key];

        const entityClass = sourceAction.entity.getName();
            
        if(entities[entityClass]) {
            sourceAction.entity.deserialize(entities[entityClass]);

            if(this._sources[entityClass]) {
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