class BoxCollider extends Collider {
	init(data) {
		data.type = "box";
		super.setRef();
		super.setShape(data);
	}
}

export { Collider };
