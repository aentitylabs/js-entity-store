import { Entity } from "./entity";
import { Source } from "./source";
import { SourceAction } from "./sourceaction";

export class UpdateSourceAction extends SourceAction {
    constructor(entity: Entity) {
        super("UpdateSourceAction", entity);
    }

    public sync(source: Source): void {
        const serializedEntity = this.entity.serialize();

        this.validateUpdate(serializedEntity);

        const serializedLoadedEntity = source.update(serializedEntity);

        this.entity.deserialize(serializedLoadedEntity);
    }
}