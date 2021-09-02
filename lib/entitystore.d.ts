import { Bridge } from "./bridge";
import { Entity } from "./entity";
import { Source } from "./source";
export declare class EntityStore {
    private _sources;
    private _entities;
    private _actions;
    get actions(): any;
    addSource(entityName: any, source: any): void;
    register(entity: Entity, source?: Source): void;
    sync(): void;
    syncTo(bridge: Bridge): void;
    syncFrom(bridge: Bridge, receivedActions: any): void;
    load(entity: Entity): void;
    update(entity: Entity): void;
    delete(entity: Entity): void;
}
