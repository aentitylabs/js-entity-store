"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSourceAction = void 0;
const sourceaction_1 = require("./sourceaction");
class UpdateSourceAction extends sourceaction_1.SourceAction {
    constructor(entity) {
        super("UpdateSourceAction", entity);
    }
    sync(source) {
        const serializedEntity = this.entity.serialize();
        this.validateUpdate(serializedEntity);
        const serializedLoadedEntity = source.update(serializedEntity);
        this.entity.deserialize(serializedLoadedEntity);
    }
}
exports.UpdateSourceAction = UpdateSourceAction;
//# sourceMappingURL=updatesourceaction.js.map