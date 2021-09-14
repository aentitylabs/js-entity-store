import { Entity } from "./entity";
import { Source } from "./source";
import { SourceAction } from "./sourceaction";
export declare class LoadSourceAction extends SourceAction {
    constructor(entity: Entity);
    sync(source: Source): void;
}
