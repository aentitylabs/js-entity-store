export class EntityHandler {
    get(target: any, property: any, receiver: any): any {
        if(target.properties[property]) {
            return target.properties[property].value;
        }

        return target[property];
    }

    set(obj: any, property: any, value: any): boolean {
        if(obj.properties[property]) {
            obj.properties[property].value = value;

            obj.entityStore.update(obj);

            return true;
        }

        obj[property] = value;

        return true;
    }
}