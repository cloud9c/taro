export default class Component {
    constructor() {}

    health(value) {
        value = value || 20;
        this.value = value;

        return this;
    }
}