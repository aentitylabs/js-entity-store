import { Entity } from "./entity";
import { EntityFactory } from "./entityfactory";
import { Source } from "./source";
import { SourceAction } from "./sourceaction";

export class UpdateSourceAction extends SourceAction {
    constructor(entity: Entity) {
        super("UpdateSourceAction", entity);
    }

    public sync(source: Source): void {
        const serializedEntity = this.entity.serialize();

        const entityData = EntityFactory.buildEntityDataFromSchema(serializedEntity);

        this.validateUpdate(entityData);

        const updatedEntity = source.update(entityData);

        const entitySchema = EntityFactory.buildEntitySchemaFromData(this.entity, updatedEntity);

        this.entity.deserialize(entitySchema);
    }
}