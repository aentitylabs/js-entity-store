import { Entity } from "./entity";
import { EntityHandler } from "./entityhandler";
import { EntityStore } from "./entitystore";

export class EntityFactory {
    public static newEntity(entityStore: EntityStore, entity: any, ref?: Entity) {
        let newEntity: Entity|null = null;
        
        if(entity["collectionItem"]) {
            newEntity = new Entity(entityStore, entity["entity"], ref, entity["collectionItem"]);
        }
        else {
            newEntity = new Entity(entityStore, entity["entity"], ref);
        }

        newEntity.deserialize(entity);

        const entityProxy = new Proxy(newEntity, new EntityHandler())

        return entityProxy;
    }
}
