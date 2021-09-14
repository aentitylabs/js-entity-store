import { Entity } from "./entity";
import { EntityStore } from "./entitystore";
export declare class EntityFactory {
    static newEntity(entityStore: EntityStore, entity: any, ref?: Entity): any;
    static buildEntitySchemaFromData(entity: Entity, entityData: any): any;
    static buildEntityDataFromSchema(entitySchema: any): any;
}
