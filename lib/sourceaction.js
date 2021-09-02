"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceAction = void 0;
class SourceAction {
    constructor(type, entity) {
        this._type = type;
        this._entity = entity;
    }
    get type() {
        return this._type;
    }
    get entity() {
        return this._entity;
    }
    set entity(value) {
        this._entity = value;
    }
    validateLoad(serializedEntity) {
        /*$validators = $this->entity->getEntityStore()->getLoadValidators();

        $entityClass = $this->getEntity()->name;

        if(array_key_exists($entityClass, $validators)) {
            $updateValidator = $validators[$entityClass];

            if(!$updateValidator->isValid($serializedEntity)) {
                throw new EntityLoadValidationException($updateValidator->getPropertyErrors());
            }
        }*/
    }
    validateUpdate(serializedEntity) {
        /*$validators = $this->entity->getEntityStore()->getUpdateValidators();

        $entityClass = $this->getEntity()->name;

        if(array_key_exists($entityClass, $validators)) {
            $updateValidator = $validators[$entityClass];

            if(!$updateValidator->isValid($serializedEntity)) {
                throw new EntityUpdateValidationException($updateValidator->getPropertyErrors());
            }
        }*/
    }
    validateDelete(serializedEntity) {
        /*$validators = $this->entity->getEntityStore()->getDeleteValidators();

        $entityClass = $this->getEntity()->name;

        if(array_key_exists($entityClass, $validators)) {
            $updateValidator = $validators[$entityClass];

            if(!$updateValidator->isValid($serializedEntity)) {
                throw new EntityDeleteValidationException($updateValidator->getPropertyErrors());
            }
        }*/
    }
}
exports.SourceAction = SourceAction;
//# sourceMappingURL=sourceaction.js.map