export default class System {
	constructor(entities) {
		this.entities = entities;
	}

	render() {
		for (var i = 0, len = entities.length; i < len; i++) {
			entity = entities[i];

			if (entity.components.appearance && entity.components.position) {

			}
		}
	}
}