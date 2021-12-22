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
    sync(): void;
    syncTo(bridge: string): Promise<void>;
    syncFrom(bridge: string, receivedActions: any, onSync: any): void;
    load(entity: Entity): void;
    update(entity: Entity): void;
    delete(entity: Entity): void;
}
