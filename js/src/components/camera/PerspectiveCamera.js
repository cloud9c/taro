class PerspectiveCamera extends THREE.PerspectiveCamera {
	init(data) {
		if ("fov" in data) this.fov = data.fov;
		if ("near" in data) this.near = data.near;
		if ("far" in data) this.far = data.far;
		this.updateProjectionMatrix();
		this.viewport =
			"viewport" in data ? data.viewport : new ENGINE.Vector4(0, 0, 1, 1);
		this.autoAspect = true;
		if ("aspect" in data) this.aspect = data.aspect;
	}

	get aspect() {
		return this._aspect;
	}

	set aspect(x) {
		this.autoAspect = false;
		this._aspect = x;
	}

	onEnable() {
		this.entity.scene.cameras.push(this);
		this.entity.add(this);
	}

	onDisable() {
		this.entity.scene.cameras.splice(
			ENGINE.Render.cameras.indexOf(this),
			1
		);
		this.entity.remove(this);
	}
}

ENGINE.createComponent("PerspectiveCamera", PerspectiveCamera);
