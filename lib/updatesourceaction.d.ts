import { Entity } from "./entity";
import { Source } from "./source";
import { SourceAction } from "./sourceaction";
export declare class UpdateSourceAction extends SourceAction {
    constructor(entity: Entity);
    sync(source: Source, onSync: any): void;
}
