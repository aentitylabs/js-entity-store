import { DeleteSourceAction } from "./deletesourceaction";
import { Entity } from "./entity";
import { LoadSourceAction } from "./loadsourceaction";
import { Source } from "./source";
import { SourceAction } from "./sourceaction";
import { UpdateSourceAction } from "./updatesourceaction";

export class EntityStore {
    private _sources: any = {};
    private _entities: any = {};
    private _actions: any = {};


    public get actions() {
        return this._actions;
    }

    public addSource(entityName: any, source: any) {
        this._sources[entityName] = source;
    }
    
    public register(entity: Entity, source?: Source): void {
        this._entities[entity.key] = entity;

        if(!source) {
            entity.source = this._sources[entity.name];
        }
        else {
            entity.source = source;
        }
    }

    public sync() {
        while (Object.keys(this._actions).length > 0) {
            const key = Object.keys(this._actions)[0];

            const sourceAction: SourceAction = this._actions[key];

            //TODO: gestire entità con source a null (null pattern!?)

            /*$entityClass = get_class($sourceAction->getEntity());

            if(array_key_exists($entityClass, $this->sources)) {
                $sourceAction->sync($this->sources[get_class($sourceAction->getEntity())]);
            }*/
            sourceAction.sync(sourceAction.entity.source);

            delete this._actions[key];
        }
    }

    public load(entity: Entity): void {
        if(entity.isReferenced && !entity.isItem && entity.ref) {
            return this.load(entity.ref);
        }

        this._actions[entity.key + "::load"] = new LoadSourceAction(entity);
    }

    public update(entity: Entity): void {
        if(entity.isReferenced && !entity.isItem && entity.ref) {
            return this.update(entity.ref);
        }

        this._actions[entity.key + "::update"] = new UpdateSourceAction(entity);
    }

    public delete(entity: Entity): void {
        if(entity.isReferenced && !entity.isItem && entity.ref) {
            return this.delete(entity.ref);
        }

        this._actions[entity.key + "::delete"] = new DeleteSourceAction(entity);
    }
}