import { Entity } from "./entity";
import { SourceAction } from "./sourceaction";
export declare class SourceActionFactory {
    static serialize(sourceAction: SourceAction): any;
    static deserialize(serializedSourceAction: any, entity: Entity): SourceAction;
}
