export {
    ObservableObject, ObservableProxy, type Observable,
    canSkipTrigger, trigger, triggerDrain, clear,
    listen, observe, isListening, unlisten, unobserve,
    createOwnedHook,
} from "MWL@2026/core/Reactive/Observable";