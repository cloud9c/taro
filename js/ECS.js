class Entity {
    constructor() {
        this.components = new Object();
        this.id = null;

        for (let i = 0, len = Entity.entities.length; i < len; i++) {
            if (Entity.entities[i] === null) {
                Entity.entities[i] = this.components;
                this.id = i;
                break;
            }
        }
        if (this.id === null)
            this.id = Entity.entities.push(this.components) - 1;
    }

    static entities = new Array();

    addComponent(type, data) { // EX: 'Transform', {'position': [0, 0, 0], 'rotation': [0, 0, 0], 'scale': [1, 1, 1]}
        Component[type](this.id, type, data);
        this.components[type] = Component.components[type][this.id];
        return this.components[type];
    }

    removeComponent(type) {
        delete Component.components[type][this.id];
        delete this.components[type];
    }
}

class Component {
    constructor() {
        const componentTypes = Object.getOwnPropertyNames(Component).filter((e) => !['length', 'constructor', 'prototype', 'name', 'components', 'setObjectComponent', 'setBooleanComponent'].includes(e));
        for (let i = 0, len = componentTypes.length; i < len; i++) {
            Component.components[componentTypes[i]] = new Object();
        }
    }
 
    static setObjectComponent(id, type, data) {
        this.components[type][id] = data;
    }

    static setBooleanComponent(id, type) {
        this.components[type].push(id)
    }

    static components = new Object();

    static Transform = this.setObjectComponent;
    static RigidBody = this.setObjectComponent;
    static Object3D = (id, type, data) => {
        scene.add(data)
        this.setObjectComponent(id, type, data);
    };
    static collider = this.setBooleanComponent;
}

class System {
    static movement() {

    }
}

new Component();
const x = new Entity();
x.addComponent('Transform', {'position': [0, 0, 0], 'rotation': [0, 0, 0], 'scale': [1, 1, 1]});

export {Entity, Component, System};