import { createOwnedHook } from "MWL@2026/core/Reactive/Observable";
import {Task} from "./Task";

import {trigger, listen, unlisten} from "MWL@2026/exports/Reactive/Observable";

//TODO: move to types ?
type Public<T> = { [K in keyof T]: T[K]; };

export class TaskList implements Public<Task> {

    private readonly globalTask: Task;
    private readonly executionHook = createOwnedHook(this);

    constructor() {
        this.globalTask = new Task( () => trigger(this.executionHook) );
    }
    schedule  (): void { this.globalTask.schedule(); }
    cancel    (): void { this.globalTask.cancel(); }
    suspend   (): void { this.globalTask.suspend(); }
    resume    (): void { this.globalTask.resume(); }
    executeNow(): void { this.globalTask.executeNow(); }

    add   (task: () => void) { listen  (this.executionHook, task) }
    remove(task: () => void) { unlisten(this.executionHook, task) }
}