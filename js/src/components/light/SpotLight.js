import { SpotLight as SL } from "../../lib/three.js";

export class SpotLight extends SL {
	start(data) {
		if ("color" in data) this.color.setHex(data.color);
		if ("intensity" in data) this.intensity = data.intensity;
		if ("distance" in data) this.distance = data.distance;
		if ("angle" in data) this.angle = data.angle;
		if ("penumbra" in data) this.penumbra = data.penumbra;
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
