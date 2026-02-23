import { Guard } from "./core/types";

// Need to leave as many time as we entered. Used for nesting.
export default class NestedGuard implements Guard {

    get isInside() {
        return this.count !== 0;
    }

    protected count = 0;

    enter() {
        return ++this.count === 1;
    }

    leave() {
        return --this.count === 0;
    }
}