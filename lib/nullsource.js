"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullSource = void 0;
const source_1 = require("./source");
class NullSource extends source_1.Source {
    load(entity) {
    }
    update(entity) {
    }
    delete(entity) {
    }
}
exports.NullSource = NullSource;
//# sourceMappingURL=nullsource.js.map