import { Entity } from "./entity";
import { EntityStore } from "./entitystore";
export declare class EntityFactory {
    static newEntity(entityStore: EntityStore, entity: any, ref?: Entity): any;
}
