import { DeleteSourceAction } from "./deletesourceaction";
import { Entity } from "./entity";
import { EntityStore } from "./entitystore";
import { LoadSourceAction } from "./loadsourceaction";
import { NullSourceAction } from "./nullsourceaction";
import { SourceAction } from "./sourceaction";
import { UpdateSourceAction } from "./updatesourceaction";

export class SourceActionFactory {
    public static serialize(sourceAction: SourceAction): any {
        const serializedSourceAction: any = {};

        serializedSourceAction["type"] = sourceAction.type;
        serializedSourceAction["entityKey"] = sourceAction.entity.key;
        serializedSourceAction["entityType"] = sourceAction.entity.name;
        serializedSourceAction["entity"] = sourceAction.entity.serialize();
        serializedSourceAction["refKey"] = sourceAction.entity.ref ? sourceAction.entity.ref.key : undefined;

        return serializedSourceAction;
    }

    public static deserialize(serializedSourceAction: any, entity: Entity): SourceAction {
        switch(serializedSourceAction["type"]) {
            case "LoadSourceAction":
                return new LoadSourceAction(entity);
            case "UpdateSourceAction":
                return new UpdateSourceAction(entity);
            case "DeleteSourceAction":
                return new DeleteSourceAction(entity);
        }

        return new NullSourceAction(entity);
    }   
}