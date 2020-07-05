class Entity {
    constructor() {
        this.components = new Object();
        this.id = (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16);

        Entity.entities[this.id] = this.components;
    }

    static entities = new Object();

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

function setDataComponent(id, type, data) {
    Component.components[type][id] = data;
}

function setSceneComponent(id, type, data) {
    setDataComponent(id, type, data);
    scene.add(data);
}

function setBooleanComponent(id, type) {
    Component.components[type].push(id)
}

const Component = {
    init: () => {
        const components = Component.components;
        const componentTypes = Object.keys(Component);
        componentTypes.splice(componentTypes.indexOf('components'), 1);

        for (let i = 0, len = componentTypes.length; i < len; i++) {
            if (Component[componentTypes[i]].name === 'setBooleanComponent') {
                components[componentTypes[i]] = new Array();
            } else {
                components[componentTypes[i]] = new Object();
            }
        }
    },

    components: new Object(),

    AABB: setSceneComponent,
    Animate: setDataComponent,
    Camera: setSceneComponent,
    Collider: setBooleanComponent,
    Interactable: setDataComponent,
    Object3D: setSceneComponent,
    PlayerControlled: setDataComponent,
    RigidBody: setDataComponent,
    Transform: setDataComponent
}

const System = {
    movement: {
        init: () => {

        },
        update: () => {

        }
    }
}

// Component.init();
// const x = new Entity();
// x.addComponent('Transform', {'position': [0, 0, 0], 'rotation': [0, 0, 0], 'scale': [1, 1, 1]});
// x.addComponent('AABB', {'position': [0, 0, 0], 'rotation': [0, 0, 0], 'scale': [1, 1, 1]});
// x.addComponent('PlayerControlled');

export {Entity, Component, System};