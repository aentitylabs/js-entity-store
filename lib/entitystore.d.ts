import { Entity } from "./entity";
import { Source } from "./source";
export declare class EntityStore {
    private _sources;
    private _bridges;
    private _entities;
    private _actions;
    get actions(): any;
    addSource(entityName: string, source: any): void;
    addBridge(bridgeName: string, bridge: any): void;
    register(entity: Entity, source?: Source): void;
    sync(onSync?: any, actions?: any): void;
    syncTo(bridge: string, onSync?: any): void;
    syncFrom(bridge: string, receivedActions: any, onDeserialize?: any, onReply?: any): void;
    load(entity: Entity): void;
    update(entity: Entity): void;
    delete(entity: Entity): void;
    private serializeSourceAction;
    private deserializeSourceAction;
    private syncSourceAction;
}
