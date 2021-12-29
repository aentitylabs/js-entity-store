import { Entity } from "./entity";
import { Source } from "./source";
import { SourceAction } from "./sourceaction";
export declare class NullSourceAction extends SourceAction {
    constructor(entity: Entity);
    sync(source: Source): Promise<void>;
}
