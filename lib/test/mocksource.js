"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockSource = void 0;
const source_1 = require("../source");
class MockSource extends source_1.Source {
    constructor() {
        super(...arguments);
        this._loadedEntities = [];
        this._updatedEntities = [];
        this._deletedEntities = [];
        this._updatedEntity = null;
    }
    load(entity) {
        const loadedEntity = this._loadedEntities.shift();
        if (!loadedEntity) {
            return entity;
        }
        return loadedEntity;
    }
    update(entity) {
        this._updatedEntities.push(entity);
        //TODO: eliminare l'if e settare sempre nel test...
        if (!this._updatedEntity) {
            return entity;
        }
        return this._updatedEntity;
    }
    delete(entity) {
        this.deletedEntities.push(entity);
    }
    set loadedEntities(loadedEntities) {
        this._loadedEntities = loadedEntities;
    }
    get updateEntities() {
        return this._updatedEntities;
    }
    get deletedEntities() {
        return this._deletedEntities;
    }
    set updatedEntity(entity) {
        this._updatedEntity = entity;
    }
}
exports.MockSource = MockSource;
//# sourceMappingURL=mocksource.js.map