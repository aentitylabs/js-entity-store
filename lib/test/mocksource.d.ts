import { Entity } from "../entity";
import { Source } from "../source";
export declare class MockSource extends Source {
    private _loadedEntities;
    private _updatedEntities;
    private _deletedEntities;
    private _updatedEntity;
    load(entity: any): any;
    update(entity: any): any;
    delete(entity: any): void;
    set loadedEntities(loadedEntities: any[]);
    get updateEntities(): any[];
    get deletedEntities(): any[];
    set updatedEntity(entity: Entity);
}
