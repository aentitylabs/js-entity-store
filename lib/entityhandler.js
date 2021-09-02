"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityHandler = void 0;
class EntityHandler {
    get(target, property, receiver) {
        if (target.properties[property]) {
            return target.properties[property].value;
        }
        return target[property];
    }
    set(obj, property, value) {
        if (obj.properties[property]) {
            obj.properties[property].value = value;
            obj.entityStore.update(obj);
            return true;
        }
        obj[property] = value;
        return true;
    }
}
exports.EntityHandler = EntityHandler;
//# sourceMappingURL=entityhandler.js.map