export {
        defineWidget, type Widget, type WidgetCstr
    }  from "MWL@2026/widgets/core/Widget/";
export { View }        from "MWL@2026/widgets/core/Widget/View";
export { Coordinator, LazyCoordinator } from "MWL@2026/widgets/core/Widget/Coordinator";

// FrameScheduler should not know Properties.
// Widget knows FrameScheduler + Properties.
export {DeferredEffects} from "MWL@2026/widgets/core/Widget/View/DeferredEffects";