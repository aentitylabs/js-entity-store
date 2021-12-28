import { Entity } from "./entity";
import { Source } from "./source";

export abstract class SourceAction {
    private _type: string;
    private _entity: Entity;


    constructor(type: string, entity: Entity) {
        this._type = type;
        this._entity = entity;
    }

    public abstract sync(source: Source, onSync: any): void;

    public get type() {
        return this._type;
    }

    public get entity() {
        return this._entity;
    }

    public set entity(value) {
        this._entity = value;
    }

    protected validateLoad(serializedEntity: any) {
        /*$validators = $this->entity->getEntityStore()->getLoadValidators();

        $entityClass = $this->getEntity()->name;

        if(array_key_exists($entityClass, $validators)) {
            $updateValidator = $validators[$entityClass];

            if(!$updateValidator->isValid($serializedEntity)) {
                throw new EntityLoadValidationException($updateValidator->getPropertyErrors());
            }
        }*/
    }

    protected validateUpdate(serializedEntity: any) {
        /*$validators = $this->entity->getEntityStore()->getUpdateValidators();

        $entityClass = $this->getEntity()->name;

        if(array_key_exists($entityClass, $validators)) {
            $updateValidator = $validators[$entityClass];

            if(!$updateValidator->isValid($serializedEntity)) {
                throw new EntityUpdateValidationException($updateValidator->getPropertyErrors());
            }
        }*/
    }

    protected validateDelete(serializedEntity: any) {
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