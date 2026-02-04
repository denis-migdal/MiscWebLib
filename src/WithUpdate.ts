import {IS_INTERACTIVE} from "./IS_INTERACTIVE";
import type { Cstr } from "./types/Cstr";

type Updatable = {
    onUpdate: () => void;
    onInit  : () => void;
};

interface UpdateController {
    setVisibilityTarget(visibility_target: any): void
    update(): void
    requestUpdate(): Promise<void>
}


class CLIUpdateController implements UpdateController {

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

let DefaultUpdateController: Cstr<UpdateController> = CLIUpdateController;

if( IS_INTERACTIVE ) { // prevents errors in CLI

    class BrowserUpdateController implements UpdateController {

        #isVisible = false;
        #isPending = false;

        readonly update_target: Updatable;

        constructor(update_target: Updatable) {
            this.update_target = update_target;
        }

        setVisibilityTarget(visibility_target: any) {
            visibility_target[BrowserUpdateController.UCSym] = this;
            BrowserUpdateController.Observer.observe(visibility_target);
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

        static UCSym = Symbol('UpdateController');

        static Observer = new IntersectionObserver(
                (entries: IntersectionObserverEntry[]) => {

            for(let i = 0; i < entries.length; ++i) {
                const ctrler: BrowserUpdateController
                                = (entries[i].target as any)[BrowserUpdateController.UCSym];
                ctrler.onVisibilityChange( entries[i].isIntersecting );
            }
        }, {root: document.documentElement}); //TODO options to remove it...
    }

    DefaultUpdateController = BrowserUpdateController;
}

type WithUpdateOpts = {
    Controller   : null|Cstr<UpdateController>,
    selfAsTarget: boolean,
    inScreen    : boolean
}

export default function WithUpdate<T extends Cstr = typeof Object>(
    klass    : T = Object as unknown as T,
    {
        Controller    = null,
        selfAsTarget = true,
        inScreen     = true, // use false for elements of "unknown" size.
    }: Partial<WithUpdateOpts> = {}) {

    if( Controller === null)
        Controller = DefaultUpdateController;

    return class Update extends klass {

        #controller = new Controller!(this);

        constructor(...args: any[]) {
            super(...args);

            if( selfAsTarget )
                this.setVisibilityTarget(this);
        }

        protected setVisibilityTarget(target: any) {
            this.#controller.setVisibilityTarget(target);
        }

        requestUpdate() {
            return this.#controller.requestUpdate();
        }

        #isInit: boolean = false;
        init() {
            this.onInit();
            this.#isInit = true;
        }
        protected onInit() {}

        update() { this.#controller.update(); }
        protected onUpdate() {}
    }
}