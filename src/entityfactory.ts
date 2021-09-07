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

    public static buildEntitySchemaFromData(entity: Entity, entityData: any): any {
        const serializedEntity: any = {};

        serializedEntity["entity"] = entity.name;
        serializedEntity["properties"] = {};
        serializedEntity["ref"] = entity.isReferenced;

        for(let key in entityData) {
            if(entity.isCollection === true) {
                serializedEntity["collectionItem"] = entity.item;

                if(entity.itemPrototype) {
                    serializedEntity["properties"][key] = EntityFactory.buildEntitySchemaFromData(entity.itemPrototype, entityData[key]);
                }
            }
            else if(entity.properties[key].isEntity === true) {
                serializedEntity["properties"][key] = EntityFactory.buildEntitySchemaFromData(entity.properties[key].value, entityData[key]);
            }
            else {
                serializedEntity["properties"][key] = {
                    "value": entityData[key]
                };
            }
        }

        return serializedEntity;
    }

    public static buildEntityDataFromSchema(entitySchema: any): any {
        const entityData: any = {};

        for(let key in entitySchema.properties) {
            if(entitySchema.properties[key]["entity"]) {
                entityData[key] = EntityFactory.buildEntityDataFromSchema(entitySchema.properties[key]);
            }
            else {
                entityData[key] = entitySchema.properties[key]["value"];
            }
        }

        return entityData;
    }
}
