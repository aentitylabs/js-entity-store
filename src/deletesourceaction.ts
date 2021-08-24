import { Entity } from "./entity";
import { Source } from "./source";
import { SourceAction } from "./sourceaction";

export class DeleteSourceAction extends SourceAction {
    constructor(entity: Entity) {
        super("DeleteSourceAction", entity);
    }

    public sync(source: Source): void {
        const serializedEntity = this.entity.serialize();

        this.validateDelete(serializedEntity);

        source.delete(serializedEntity);
    }
}