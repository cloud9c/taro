export class Component {
    constructor() {}

    Health(value) {
        value = value || 20;
        this.value = value;

        return this;
    }
}