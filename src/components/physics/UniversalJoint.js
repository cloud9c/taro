import { Joint } from "./Joint.js";

export class UniversalJoint extends Joint {
	start(data) {
		this.type = "universal";
		super.start(data);
	}
}
