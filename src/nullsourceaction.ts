import { Entity } from "./entity";
import { Source } from "./source";
import { SourceAction } from "./sourceaction";

export class NullSourceAction extends SourceAction {
    constructor(entity: Entity) {
        super("NullSourceAction", entity);
    }

    public sync(source: Source): Promise<void> {
        throw new Error("NullSourceAction: method not implemented.");
    }
}