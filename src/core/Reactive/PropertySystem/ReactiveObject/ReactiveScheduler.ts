import { canSkipTrigger, trigger } from "MWL@2026/exports/Reactive/Observable";
import { REACTIVE_NODE, ReactiveObject } from "./ReactiveObject";
import { Link } from "./link";
import { incrVersion, ReactiveNode } from "./ReactiveNode";

function isPending(node: ReactiveNode) {
    return node.triggerPending && node.triggerDepth === 0;
}

export class ReactiveScheduler {

    // storing links is necessary to detect and prevent loops.
    readonly stack = new Array<Link>();
    readonly pendingNotifications = new Array<ReactiveObject>();

    trigger(target: ReactiveObject) {

        if( target[REACTIVE_NODE].triggerDepth !== 0 ) {
            target[REACTIVE_NODE].triggerPending = true;
            return;
        }

        this.propagateTrigger(target);

        this.propagateValue(target);
        this.notify();
    }

    triggerPending(...targets: ReactiveObject[]) {

        for(let i = 0; i < targets.length; ++i) {
            if( ! isPending(targets[i][REACTIVE_NODE]) )
                continue; // ignore

            this.propagateTrigger(targets[i]);
        }

        for(let i = 0; i < targets.length; ++i) {
            if( ! isPending(targets[i][REACTIVE_NODE]) )
                continue; // ignore

            targets[i][REACTIVE_NODE].triggerPending = false;
            this.propagateValue(targets[i]);
        }

        this.notify();
    }

    protected propagateTrigger(target: ReactiveObject) {

        const links = target[REACTIVE_NODE].links;
        
        for(let i = links.length - 1; i >= 0; --i) {
            if( links[i].dst[REACTIVE_NODE].triggerDepth++ === 0 )
                this.stack.push(links[i]);
        }

        while(this.stack.length) {

            const curLink = this.stack.pop()!;

            const nextLinks = curLink.dst[REACTIVE_NODE].links;
            for(let i = nextLinks.length - 1; i >= 0; --i) {
                const nextLink = nextLinks[i];
                if(nextLink.dst === curLink.src)
                    continue;

                if( nextLink.dst[REACTIVE_NODE].triggerDepth++ === 0 )
                    this.stack.push(nextLink);
            }
        }
    }

    protected propagateValue(target: ReactiveObject) {

        this.scheduleNotify(target);
        incrVersion(target[REACTIVE_NODE]);

        const links = target[REACTIVE_NODE].links;
        for(let i = links.length - 1; i >= 0; --i) {
            if( --links[i].dst[REACTIVE_NODE].triggerDepth === 0 )
                this.stack.push(links[i]);
        }

        while(this.stack.length) {

            const curLink = this.stack.pop()!;

            curLink.propagate();
            incrVersion(curLink.dst[REACTIVE_NODE]);
            this.scheduleNotify(curLink.dst);

            const nextLinks = curLink.dst[REACTIVE_NODE].links;
            for(let i = nextLinks.length - 1; i >= 0; --i) {
                const nextLink = nextLinks[i];
                if(nextLink.dst === curLink.src)
                    continue;

                if( --nextLink.dst[REACTIVE_NODE].triggerDepth === 0 ) {
                    this.stack.push(nextLink);
                }
            }
        }
    }

    protected scheduleNotify(target: ReactiveObject) {
        if( canSkipTrigger(target) )
            return;
        this.pendingNotifications.push(target);
    }

    protected notify() {

        // re-entry is forbidden.
        for(let i = 0; i < this.pendingNotifications.length; ++i)
            trigger(this.pendingNotifications[i]);

        this.pendingNotifications.length = 0;
    }
}

const reactiveScheduler = new ReactiveScheduler();

export function triggerReactiveObject(target: ReactiveObject) {
    reactiveScheduler.trigger(target);
}

export function pauseReactions(...targets: ReactiveObject[]) {
    for(let i = 0; i < targets.length; ++i)
        ++targets[i][REACTIVE_NODE].triggerDepth;
}

export function resumeReactions(...targets: ReactiveObject[]) {

    for(let i = 0; i < targets.length; ++i)
        --targets[i][REACTIVE_NODE].triggerDepth;

    reactiveScheduler.triggerPending(...targets);
}