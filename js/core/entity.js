import Component from './component.js';

class Entity {
    constructor() {
        this.components = new Object();
        this.id = (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16);

        Entity.entities[this.id] = this.components;
    }

    static entities = new Object();

    addComponent(type, data = null) {
        Component[type](this.id, type, data);
        this.components[type] = Component.components[type][this.id];
        return this;
    }

    removeComponent(type) {
        delete Component.components[type][this.id];
        delete this.components[type];
        return this;
    }
}

export default Entity;