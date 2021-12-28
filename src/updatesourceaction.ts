import { Entity } from "./entity";
import { EntityFactory } from "./entityfactory";
import { Source } from "./source";
import { SourceAction } from "./sourceaction";

export class UpdateSourceAction extends SourceAction {
    constructor(entity: Entity) {
        super("UpdateSourceAction", entity);
    }

    public sync(source: Source, onSync: any): void {
        const serializedEntity = this.entity.serialize();

        const entityData = EntityFactory.buildEntityDataFromSchema(serializedEntity);

        this.validateUpdate(entityData);

        source.update(entityData, (updatedEntity: any) => {
            const entitySchema = EntityFactory.buildEntitySchemaFromData(this.entity, updatedEntity);

            this.entity.deserialize(entitySchema);

            onSync();
        });
    }
}