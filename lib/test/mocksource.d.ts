import { Entity } from "../entity";
import { Source } from "../source";
export declare class MockSource extends Source {
    private _loadedEntities;
    private _updatedEntities;
    private _deletedEntities;
    private _updatedEntity;
    load(entity: any, onLoad: any): void;
    update(entity: any, onUpdate: any): void;
    delete(entity: any, onDelete: any): void;
    set loadedEntities(loadedEntities: any[]);
    get updateEntities(): any[];
    get deletedEntities(): any[];
    set updatedEntity(entity: Entity);
}
