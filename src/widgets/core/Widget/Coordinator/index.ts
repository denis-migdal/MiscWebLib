import { OBSERVABLE } from "MWL@2026/core/Reactive/Observable/contract/internals";
import { isClass } from "MWL@2026/core/types";
import { FCT_ID, NULL_OBJ } from "MWL@2026/exports/types";

type ModelProvider<Config extends Record<string,any>, T extends object>
                        = ((config: Partial<Config>) => T)
                        | {new (config: Partial<Config>): T};

export type CoordinatorClass<
                            Config extends Record<string, any>,
                            WidgetAPI,
                            DAPI extends keyof WidgetAPI,
                            ViewModel
                        >
                    = {
                        new(config?: Partial<Config>): {
                            readonly widgetAPI  : WidgetAPI,
                            readonly viewModel  : ViewModel
                        }
                        readonly directAPI  : readonly DAPI[]
                    };

export type CoordinatorOpts<
                            T extends object,
                            ViewModel = T,
                            WidgetAPI = T,
                        > = {
    viewModel       ?: (presentation: NoInfer<T>) => ViewModel,
    widgetAPI       ?: (presentation: NoInfer<T>) => WidgetAPI
};

// TODO: Will be remove
export type CoordinatorDAPI<T> = Extract<keyof T, "properties"|typeof OBSERVABLE>;

export class NullCoordinator {

    readonly viewModel = NULL_OBJ;
    readonly widgetAPI = NULL_OBJ;

    static readonly directAPI = [];
}

export function LazyCoordinator<
                            Config extends Record<string, any>,
                            T extends object
                        >(modelProvider: ModelProvider<Config, T>) {

    let modelFactory = modelProvider as (cfg: Partial<Config>) => T;
    if( isClass(modelProvider) )
        modelFactory = (...args) => new modelProvider(...args);

    return class LazyCoordinator {

        presentationModel: T|null = null;

        readonly viewModel: (args: Partial<Config>) => T;

        constructor(config: Partial<Config> = NULL_OBJ) {

            this.viewModel = (args: Partial<Config>) => {
                args = Object.assign({}, args, config);
                return this.presentationModel = modelFactory(args);
            };
        }

        get widgetAPI() {
            __ASSERT__(this.presentationModel !== null, "viewModel MUST be called!");
            return this.presentationModel
        }

        //TODO: will be removed.
        // always redirect.
        static readonly directAPI = [
            OBSERVABLE,
            "properties"
        ] as any as readonly never[]; // h4ck
    }
}

// explicit return type annotation required.
export function Coordinator<
                        Config extends Record<string, any>,
                        T extends object,
                        ViewModel = T,
                        WidgetAPI = T
                >(
                    modelProvider: ModelProvider<Config, T>,
                    opts: CoordinatorOpts<T, ViewModel, WidgetAPI> = NULL_OBJ
                ): CoordinatorClass<
                                    Config,
                                    WidgetAPI,
                                    CoordinatorDAPI<WidgetAPI>,
                                    ViewModel> {

    let viewModel = opts.viewModel!;
    if( viewModel === undefined )
        viewModel = FCT_ID as any;

    let widgetAPI = opts.widgetAPI!;
    if( widgetAPI === undefined )
        widgetAPI = FCT_ID as any;

    let modelFactory = modelProvider as (cfg: Partial<Config>) => T;
    if( isClass(modelProvider) )
        modelFactory = (...args) => new modelProvider(...args);

    // we need static informations...
    return class Coordinator {

        readonly presentationModel;

        constructor(config: Partial<Config> = NULL_OBJ) {
            this.presentationModel = modelFactory(config);
        }

        get viewModel() { return viewModel(this.presentationModel) }
        get widgetAPI() { return widgetAPI(this.presentationModel) }

        //TODO: will be removed.
        // always redirect.
        static readonly directAPI = [
            OBSERVABLE,
            "properties"
        ] as any as readonly never[]; // h4ck
    }
}