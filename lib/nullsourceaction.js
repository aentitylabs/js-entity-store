"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullSourceAction = void 0;
const sourceaction_1 = require("./sourceaction");
class NullSourceAction extends sourceaction_1.SourceAction {
    constructor(entity) {
        super("NullSourceAction", entity);
    }
    sync(source) {
        throw new Error("NullSourceAction: method not implemented.");
    }
}
exports.NullSourceAction = NullSourceAction;
//# sourceMappingURL=nullsourceaction.js.map