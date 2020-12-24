import { Joint } from "./Joint.js";

export class BallJoint extends Joint {
	start(data) {
		this.type = "ball";
		super.start(data);
	}
}
