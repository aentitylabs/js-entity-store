"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityFactory = void 0;
const entity_1 = require("./entity");
const entityhandler_1 = require("./entityhandler");
class EntityFactory {
    static newEntity(entityStore, entity, ref) {
        let newEntity = null;
        if (entity["collectionItem"]) {
            newEntity = new entity_1.Entity(entityStore, entity["entity"], ref, entity["collectionItem"]);
        }
        else {
            newEntity = new entity_1.Entity(entityStore, entity["entity"], ref);
        }
        newEntity.deserialize(entity);
        const entityProxy = new Proxy(newEntity, new entityhandler_1.EntityHandler());
        return entityProxy;
    }
}
exports.EntityFactory = EntityFactory;
//# sourceMappingURL=entityfactory.js.map