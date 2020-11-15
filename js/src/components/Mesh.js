export class Mesh {
	init(data) {
		this.ref = data;
	}

	onEnable() {
		this.entity.add(this.ref);
	}

	onDisable() {
		this.entity.remove(this.ref);
	}
}
