"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteSourceAction = void 0;
const sourceaction_1 = require("./sourceaction");
class DeleteSourceAction extends sourceaction_1.SourceAction {
    constructor(entity) {
        super("DeleteSourceAction", entity);
    }
    sync(source) {
        const serializedEntity = this.entity.serialize();
        this.validateDelete(serializedEntity);
        source.delete(serializedEntity);
    }
}
exports.DeleteSourceAction = DeleteSourceAction;
//# sourceMappingURL=deletesourceaction.js.map