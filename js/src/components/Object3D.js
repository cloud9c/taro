import { Object3D as O3D } from "../lib/three.module.js";
import System from "../System.js";
import Component from "../Component.js";

class Object3D extends Component {
	init(data) {
		Object.assign(this, data);
		System.scene.add(data);
	}
}

export default Object3D;
