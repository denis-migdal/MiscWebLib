import GuardedState from "./GuardedState";
import { createOwnedHook, isListening, listen, triggerDrain, unlisten } from "MWL@2026/exports/Reactive/Observable";

type FrameTask = () => void;

class FrameSchedulerCore {

    private readonly callback: FrameTask;
    constructor(callback: FrameTask) {
        this.callback = callback;
    }

    schedule() {
        this.Scheduled.enter();
    }

    // avoid recrating it at upon each enter.
    private readonly rAF_callback = () => this.Scheduled.leave();

    private readonly Scheduled = new GuardedState(
        () => requestAnimationFrame( this.rAF_callback ),
        () => this.callback(),
    )
}

export class FrameScheduler {

    private readonly executionHook = createOwnedHook(this);

    private readonly core  = new FrameSchedulerCore( () => {
        triggerDrain(this.executionHook)
    });

    isTaskScheduled( task: FrameTask ) {
        return isListening(this.executionHook, task);
    }

    scheduleTask( task: FrameTask ) {
        listen(this.executionHook, task);
        this.core.schedule();
    }

    cancelScheduledTask(task: FrameTask) {
        unlisten(this.executionHook, task);
    }
}

export const frameScheduler = new FrameScheduler();