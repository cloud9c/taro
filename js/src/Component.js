const Component = {
	components: {
		Animation: [],
		Behavior: [],
		Camera: [],
		Collider: [],
		Object3D: [],
		Rigidbody: [],
		Shape: [],
		Transform: [],
	},
	getComponent(type) {
		return this.components[type.name];
	},
};

export { Component };
