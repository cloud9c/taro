class Component {
	constructor(entity) {
		this.entity = entity;
	}
	static getComponent(type) {
		return this.components[type.name];
	}
}

Component.components = {
	Animation: [],
	Behavior: [],
	Camera: [],
	Collider: [],
	Object3D: [],
	Rigidbody: [],
	Shape: [],
	Transform: [],
};

export default Component;
