class Mesh {
	init(data) {
		this.ref = data;
	}

	onEnable() {
		console.log(this.ref, this.entity);
		this.entity.add(this.ref);
	}

	onDisable() {
		this.entity.remove(this.ref);
	}
}

ENGINE.createComponent("Mesh", Mesh);
