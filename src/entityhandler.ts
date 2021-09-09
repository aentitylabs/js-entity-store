export class EntityHandler {
    get(target: any, property: any, receiver: any): any {
        if(target.getProperties()[property]) {
            return target.getProperties()[property].value;
        }

        return target[property];
    }

    set(obj: any, property: any, value: any): boolean {
        if(obj.getProperties()[property]) {
            obj.getProperties()[property].value = value;

            obj.getEntityStore().update(obj);

            return true;
        }

        obj[property] = value;

        return true;
    }
}