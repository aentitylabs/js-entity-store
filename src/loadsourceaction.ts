import { Entity } from "./entity";
import { EntityFactory } from "./entityfactory";
import { Source } from "./source";
import { SourceAction } from "./sourceaction";

export class LoadSourceAction extends SourceAction {
    constructor(entity: Entity) {
        super("LoadSourceAction", entity);
    }

    public sync(source: Source, onSync: any): void {
        const serializedEntity: any = this.entity.serialize();

        const entityData = EntityFactory.buildEntityDataFromSchema(serializedEntity);
            
        source.load(entityData, (loadedEntity: any) => {
            this.validateLoad(loadedEntity);

            const entitySchema = EntityFactory.buildEntitySchemaFromData(this.entity, loadedEntity);
    
            this.entity.deserialize(entitySchema); 

            onSync();
        });
    }
}