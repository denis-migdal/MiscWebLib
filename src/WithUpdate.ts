import {IS_INTERACTIVE} from "./IS_INTERACTIVE";
import type { Cstr } from "./types/Cstr";

type Updatable = {
    onUpdate: () => void;
    onInit  : () => void;
};

interface UpdateControler {
    setVisibilityTarget(visibility_target: any): void
    update(): void
    requestUpdate(): Promise<void>
}


class CLIUpdateControler implements UpdateControler {

    readonly update_target: Updatable;

    constructor(update_target: Updatable) {
        this.update_target = update_target;
    }

    #isInit = false;
    update() {
        if( ! this.#isInit ) {
            this.update_target.onInit();
            this.#isInit = true;
        }
        this.update_target.onUpdate();
    }

    // CLI requires explicit .update() calls.
    async requestUpdate() {}

    // no visibility used.
    setVisibilityTarget(visibility_target: never) {}
}

let DefaultUpdateControler: Cstr<UpdateControler> = CLIUpdateControler;

if( IS_INTERACTIVE ) { // prevents errors in CLI

    class BrowserUpdateControler implements UpdateControler {

        #isVisible = false;
        #isPending = false;

        readonly update_target: Updatable;

        constructor(update_target: Updatable) {
            this.update_target = update_target;
        }

        setVisibilityTarget(visibility_target: any) {
            visibility_target[BrowserUpdateControler.UCSym] = this;
            BrowserUpdateControler.Observer.observe(visibility_target);
        }

        #isInit = false;
        #update() {

            if( ! this.#isInit ) {
                this.update_target.onInit();
                this.#isInit = true;
            }

            this.update_target.onUpdate();
            this.#isPending = false;
        }

        update() { // force update.

            if( this.#requestID !== null ) {
                cancelAnimationFrame(this.#requestID);
                this.#requestID = null;
            }

            this.#update();
        }
        async requestUpdate() {

            if( this.#isPending )
                return;
            this.#isPending = true;

            if( ! this.#isVisible )
                return;

            this.#requestID = requestAnimationFrame( this.#afr_callback );
        }

        #requestID: number|null = null;

        #afr_callback = () => {
            this.#requestID = null;
            this.#update();
        }

        onVisibilityChange(visibility: boolean) {

            this.#isVisible = visibility;

            // cancel current AFR
            if( ! visibility && this.#requestID !== null ) {
                cancelAnimationFrame(this.#requestID);
                this.#requestID = null;
            }

            if( visibility && this.#isPending && this.#requestID === null)
                this.#requestID = requestAnimationFrame( this.#afr_callback );
        }

        static UCSym = Symbol('UpdateControler');

        static Observer = new IntersectionObserver(
                (entries: IntersectionObserverEntry[]) => {

            for(let i = 0; i < entries.length; ++i) {
                const ctrler: BrowserUpdateControler
                                = (entries[i].target as any)[BrowserUpdateControler.UCSym];
                ctrler.onVisibilityChange( entries[i].isIntersecting );
            }
        }, {root: document.documentElement}); //TODO options to remove it...
    }

    DefaultUpdateControler = BrowserUpdateControler;
}

type WithUpdateOpts = {
    Controler   : null|Cstr<UpdateControler>,
    selfAsTarget: boolean,
    inScreen    : boolean
}

export default function WithUpdate<T extends Cstr = typeof Object>(
    klass    : T = Object as unknown as T,
    {
        Controler    = null,
        selfAsTarget = true,
        inScreen     = true, // use false for elements of "unknown" size.
    }: Partial<WithUpdateOpts> = {}) {

    if( Controler === null)
        Controler = DefaultUpdateControler;

    return class Update extends klass {

        #controler = new Controler!(this);

        constructor(...args: any[]) {
            super(...args);

            if( selfAsTarget )
                this.setVisibilityTarget(this);
        }

        protected setVisibilityTarget(target: any) {
            this.#controler.setVisibilityTarget(target);
        }

        requestUpdate() {
            return this.#controler.requestUpdate();
        }

        #isInit: boolean = false;
        init() {
            this.onInit();
            this.#isInit = true;
        }
        protected onInit() {}

        update() { this.#controler.update(); }
        protected onUpdate() {}
    }
}