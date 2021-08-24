import { Entity } from "../entity";
import { Source } from "../source";

export class MockSource extends Source {
    private _loadedEntities: any[] = [];
    private _updatedEntities: any[] = [];
    private _deletedEntities: any[] = [];
    private _updatedEntity: Entity|null = null;


    public load(entity: any): any {
        const loadedEntity = this._loadedEntities.shift();

        if(!loadedEntity) {
            return entity;
        }

        return loadedEntity;
    }

    public update(entity: any): any {
        this._updatedEntities.push(entity);

        //TODO: eliminare l'if e settare sempre nel test...
        if(!this._updatedEntity) {
            return entity;
        }

        return this._updatedEntity;
    }

    public delete(entity: any): void {
        this.deletedEntities.push(entity);
    }

    public set loadedEntities(loadedEntities: any[]) {
        this._loadedEntities = loadedEntities;
    }

    public get updateEntities() {
        return this._updatedEntities;
    }

    public get deletedEntities() {
        return this._deletedEntities;
    }

    public set updatedEntity(entity: Entity) {
        this._updatedEntity = entity;
    }
}
