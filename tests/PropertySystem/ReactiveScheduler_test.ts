import "@config";

import { assertEquals } from "std/assert";
import { ReactiveObject } from "MWL@2026/core/Reactive/PropertySystem/ReactiveObject/ReactiveObject.ts";
import { pauseReactions, resumeReactions, triggerReactiveObject } from "MWL@2026/core/Reactive/PropertySystem/ReactiveObject/ReactiveScheduler.ts";
import { listen } from "MWL@2026/exports/Reactive/Observable.ts";
import { addLink } from "MWL@2026/core/Reactive/PropertySystem/Property/sync/links.ts";

Deno.test("Pause (noop)", () => {

    const obj = new ReactiveObject();

    let count = 0;
    listen(obj, () => ++count);

    pauseReactions(obj);
    assertEquals(count, 0);
    resumeReactions(obj);
    assertEquals(count, 0);
});

Deno.test("Pause (multi-trigger)", () => {

    const obj = new ReactiveObject();

    let count = 0;
    listen(obj, () => ++count);

    pauseReactions(obj);

    triggerReactiveObject(obj);
    triggerReactiveObject(obj);

    assertEquals(count, 0);
    resumeReactions(obj);

    assertEquals(count, 1);
});

Deno.test("Pause (many)", () => {

    const obj  = new ReactiveObject();
    const obj2 = new ReactiveObject();

    addLink(obj, obj2);

    let count = 0;
    listen(obj2, () => ++count);

    pauseReactions(obj2, obj);

    triggerReactiveObject(obj2);
    triggerReactiveObject(obj);
    assertEquals(count, 0);

    resumeReactions(obj2, obj);

    assertEquals(count, 1);
});