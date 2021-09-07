import { Entity } from "./entity";
import { EntityFactory } from "./entityfactory";
import { Source } from "./source";
import { SourceAction } from "./sourceaction";

export class DeleteSourceAction extends SourceAction {
    constructor(entity: Entity) {
        super("DeleteSourceAction", entity);
    }

    public sync(source: Source): void {
        const serializedEntity = this.entity.serialize();

        const entityData = EntityFactory.buildEntityDataFromSchema(serializedEntity);

        this.validateDelete(entityData);

        source.delete(entityData);
    }
}