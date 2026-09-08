import { NULL_OBJ } from "MWL@2026/exports/types";
import { ViewFactory } from "./View";
import { CoordinatorClass, CoordinatorDAPI, NullCoordinator } from "./Coordinator";

import { extractConfig } from "./extractConfig";
import { WithProperties } from "MWL@2026/exports/Reactive/PropertySystem";
import { TaskList } from "MWL@2026/exports/browser/scheduler";

export type WidgetName = Lowercase<`${string}-${string}`>;

// Sometimes, Coordinator needs to be its own parameter, cf:
// - https://github.com/microsoft/TypeScript/issues/63378
// - https://github.com/microsoft/TypeScript/issues/63377

type Expand<T> = T extends infer O
    ? { [K in keyof O]: O[K] }
    : never;

export type Widget<WidgetAPI,
                   DAPI extends keyof WidgetAPI = never
                > = HTMLElement
                    & {
                        readonly api: Expand<WidgetAPI>,
                        readonly renderer: TaskList
                    }
                    & Pick<WidgetAPI, DAPI>;

export type WidgetCstr<   
                    Config extends Record<string, any>,
                    WidgetAPI                    = WithProperties<Config>,
                    DAPI extends keyof WidgetAPI = CoordinatorDAPI<WidgetAPI>,
                > = { new(config?: Partial<Config>): Widget<WidgetAPI, DAPI> };

export function defineWidget<   
        Config extends Record<string, any>,
        WidgetAPI,
        DAPI extends keyof WidgetAPI,
        ViewModel
    >(
        ...args: [
            name            : WidgetName,
            coordinatorClass: CoordinatorClass<Config, WidgetAPI, DAPI, ViewModel>,
            viewFactory     : ViewFactory<NoInfer<ViewModel>>,
        ]|[
            name            : WidgetName,
            viewFactory     : ViewFactory<NoInfer<ViewModel>>,
        ]
    ): WidgetCstr<Config, WidgetAPI, DAPI> {

    const name       : WidgetName = args[0];
    const viewFactory: ViewFactory<NoInfer<ViewModel>> = args[args.length-1] as any;

    let coordinatorClass: CoordinatorClass<Config, WidgetAPI, DAPI, ViewModel> = NullCoordinator as any;
    if( args.length >= 3)
        coordinatorClass = args[1] as any;

    const ClassName = name.replace(/(?:^|-)([a-z])/g, (_, char) => char.toUpperCase()) + "Widget";

    class Widget extends HTMLElement {

        static override readonly name = ClassName;

        readonly api;
        readonly renderer = new TaskList();

        constructor(config: Partial<Config> = NULL_OBJ) {
            super();

            config = extractConfig(this, config);

            const coordinator = new coordinatorClass(config);

            viewFactory(this, this.renderer, coordinator.viewModel);

            // must be fetched AFTER view initialization.
            this.api = coordinator.widgetAPI;
        }

        // currently the most efficient way to proceed.
        // IntersectionObserver has a frame of latency...
        connectedCallback   () { this.renderer.resume(); }
        disconnectedCallback() { this.renderer.suspend(); }
    }

    const DAPI = coordinatorClass.directAPI;

    for(let i = 0; i < DAPI.length; ++i) {
        const key = DAPI[i];

        Object.defineProperty(Widget.prototype, key, {
            get() { return this.api[key]; }
        })
    }

    customElements.define(name, Widget);

    return Widget as any;
}
