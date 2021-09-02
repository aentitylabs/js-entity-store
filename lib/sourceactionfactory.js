"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceActionFactory = void 0;
const deletesourceaction_1 = require("./deletesourceaction");
const loadsourceaction_1 = require("./loadsourceaction");
const nullsourceaction_1 = require("./nullsourceaction");
const updatesourceaction_1 = require("./updatesourceaction");
class SourceActionFactory {
    static serialize(sourceAction) {
        const serializedSourceAction = {};
        serializedSourceAction["type"] = sourceAction.type;
        serializedSourceAction["entityKey"] = sourceAction.entity.key;
        serializedSourceAction["entityType"] = sourceAction.entity.name;
        serializedSourceAction["entity"] = sourceAction.entity.serialize();
        serializedSourceAction["refKey"] = sourceAction.entity.ref ? sourceAction.entity.ref.key : undefined;
        return serializedSourceAction;
    }
    static deserialize(serializedSourceAction, entity) {
        switch (serializedSourceAction["type"]) {
            case "LoadSourceAction":
                return new loadsourceaction_1.LoadSourceAction(entity);
            case "UpdateSourceAction":
                return new updatesourceaction_1.UpdateSourceAction(entity);
            case "DeleteSourceAction":
                return new deletesourceaction_1.DeleteSourceAction(entity);
        }
        return new nullsourceaction_1.NullSourceAction(entity);
    }
}
exports.SourceActionFactory = SourceActionFactory;
//# sourceMappingURL=sourceactionfactory.js.map