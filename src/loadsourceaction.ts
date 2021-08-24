import { Entity } from "./entity";
import { Source } from "./source";
import { SourceAction } from "./sourceaction";

export class LoadSourceAction extends SourceAction {
    constructor(entity: Entity) {
        super("LoadSourceAction", entity);
    }

    public sync(source: Source): void {
        const serializedEntity: any = this.entity.serialize();
            
        const serializedLoadedEntity = source.load(serializedEntity);

        this.validateLoad(serializedLoadedEntity);

        this.entity.deserialize(serializedLoadedEntity);
    }
}