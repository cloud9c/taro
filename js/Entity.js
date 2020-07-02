export default class Entity {
    constructor() {
        entities.push(this);
        this.components = {};
    }

    addComponent(component) {
        this.components[component.name] = component;
        return this;
    };

    removeComponent(component) {
        delete this.components[component];
        return this;
    };

    static entities = [];
};