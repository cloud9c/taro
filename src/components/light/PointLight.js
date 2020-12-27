import { PointLight as PL } from "../../lib/three.js";

export class PointLight extends PL {
	start(data) {
		if ("color" in data) this.color.setHex(data.color);
		if ("intensity" in data) this.intensity = data.intensity;
		if ("distance" in data) this.distance = data.distance;
		if ("decay" in data) this.decay = data.decay;

		this.addEventListener("enable", this.onEnable);
		this.addEventListener("disable", this.onDisable);
	}

	onEnable() {
		this.entity.add(this);
	}

	onDisable() {
		this.entity.remove(this);
	}
}
