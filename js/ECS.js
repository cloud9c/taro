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

    addComponent(type, data=null) { // EX: 'Transform', {'position': [0, 0, 0], 'rotation': [0, 0, 0], 'scale': [1, 1, 1]}
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
        const componentTypes = Object.getOwnPropertyNames(Component).filter((e) => !['length', 'constructor', 'prototype', 'name', 'components', 'setDataComponent', 'setBooleanComponent'].includes(e));
        for (let i = 0, len = componentTypes.length; i < len; i++) {
            Component.components[componentTypes[i]] = new Object();
        }
    }
 
    static setDataComponent(id, type, data) {
        this.components[type][id] = data;
    }

    static setSceneComponent(id, type, data) {
        this.setDataComponent(id, type, data);
        scene.add(data);
    }

    static setBooleanComponent(id, type) {
        this.components[type].push(id)
    }

    static components = new Object();

    static AABB = this.setSceneComponent;
    static Camera = this.setSceneComponent;
    static Collider = this.setBooleanComponent;
    static Interactable = this.setDataComponent;
    static Object3D = this.setSceneComponent;
    static PlayerControlled = this.setDataComponent;
    static RigidBody = this.setDataComponent;
    static Transform = this.setDataComponent;
}

class System {
    static movement() {

    }
}

new Component();
const x = new Entity();
x.addComponent('Transform', {'position': [0, 0, 0], 'rotation': [0, 0, 0], 'scale': [1, 1, 1]});
x.addComponent('AABB', {'position': [0, 0, 0], 'rotation': [0, 0, 0], 'scale': [1, 1, 1]});
x.addComponent('PlayerControlled');

export {Entity, Component, System};