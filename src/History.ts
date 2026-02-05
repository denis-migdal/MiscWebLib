/**
 * 
 */
export default class History<T> {

    readonly #states = new Array<T>();
    #stateIDX = -1; // when using prev/next

    prev() {
        if( this.#stateIDX === 0 )
            return false;

        --this.#stateIDX;
        return true;
    }

    next() {
        if( this.#stateIDX === this.#states.length - 1)
            return false;

        ++this.#stateIDX;
        return true;
    }

    reset() {
        this.#states.length =  0;
        this.#stateIDX      = -1;
    }

    push(state: T) {
        this.#states[++this.#stateIDX] = state;
        this.#states.length = this.#stateIDX + 1;
    }

    get currentState() {
        return this.#states[this.#stateIDX];
    }
}