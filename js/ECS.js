class Entity {
    constructor() {
        this.components = {};
        this.id = null;
        const entities = Entity.entities;

        for (let i = 0, len = entities.length; i < len; i++) {
            if (entities[i] === null) {
                entities[i] = this.components;
                this.id = i;
                break;
            }
        }
        if (this.id === null)
            this.id = entities.push(this.components) - 1;
    }

    addComponent(name, data) { // 'transform', {'position': [0, 0, 0], 'rotation': [0, 0, 0], 'scale': [1, 1, 1]}
        this.components[name] = Component[name](this.id, data);
        return this.components[name];
    }

    removeComponent(name) {
        delete Component.components[name][this.id];
        delete this.components[name];
    }
}

Entity.entities = [];

class Component {
    static transform(id, data) {
        this.components.transform[id] = data;
        return this.components.transform[id];
    }
}

componentTypes = Object.getOwnPropertyNames(Component).filter((e) => !['length', 'constructor', 'prototype', 'name'].includes(e));
Component.components = {};
for (let i = 0, len = componentTypes.length; i < len; i++) {
    Component.components[componentTypes[i]] = {};
}

class System {
    static movement() {

    }
}

export {Entity, Components, System};