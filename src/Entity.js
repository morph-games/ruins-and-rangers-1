export default class Entity {
	constructor(x = 0) {
		this.x = x;
	}

	get isEntity() {
		return true;
	}
}
