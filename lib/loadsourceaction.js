"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadSourceAction = void 0;
const sourceaction_1 = require("./sourceaction");
class LoadSourceAction extends sourceaction_1.SourceAction {
    constructor(entity) {
        super("LoadSourceAction", entity);
    }
    sync(source) {
        const serializedEntity = this.entity.serialize();
        const serializedLoadedEntity = source.load(serializedEntity);
        this.validateLoad(serializedLoadedEntity);
        this.entity.deserialize(serializedLoadedEntity);
    }
}
exports.LoadSourceAction = LoadSourceAction;
//# sourceMappingURL=loadsourceaction.js.map