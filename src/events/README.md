Event and signals are required as we *need* a way to notify.
Still, we need to respect SRP and encapsulation.

TODO:
0/ Finish TPEngine
1/ Move to Signal library... + update LISS...
2/ FlowEvent => .flow. // -> interface internalSignal ?
    .isPending
    .startFlow() // -> interface InternalFlow ?
    .endFlow()
    .before/.on/.after
3/ Définir les interfaces "core" et séparer les helpers + impl.
4/ WithInput => avoir un InputManager ?
    + WithInput/WithOutput => attention au type...
5/ Move stuff...

X/ Update = Signal<null>() ?
X/ Découpler UI et données/calculs lorsque possible (printer/configurator ?)
X/ En cas de changements : adapter ou v1/v2 avec migration progressive...
    + WithInput/WithOutput : option facultative pour l'impl du signal.

Event
=====

Its features should only be :
- add/remove listener
- trigger

Requires 2 properties :
- target: to know what launched the event.
- name: for debug purpose.

Batching and other features should be performed by its *listener*.
- microtask( () => {})
- macrotask( () => {})
- animationFrame( () => {})
- [TODO] whenVisible( () => {})
- [TODO] whenVisibleFrame( () => {})
- [TODO] ack system

RSignal<T>
==========

It needs 3 properties:
- isChanging
- value: T|NO_VALUE
- currentProvider: gives the signal value.

Value should be NO_VALUE when no value is provided. This is necessary to avoid:
- throwing exceptions (causes issues when using RSignal as a provider).
- using a .hasValue flag that'd incite to provide a default value for .value.
- using a default value (e.g. null) for .value

CurrentProvider is used to optimise signals link operations. It shouldn't have its value changed without the signal being notified.

It needs 3 events:
- beforeChange: current value isn't clean anymore, new value will soon be provider.
- change: internal, used for signal.add/removeListener().
- afterChange: a new value is available.

/!\ The value between beforeChange and afterChange is instable.

The beforeChange event must be synchronous in order to properly batch merged signals:
1. The batcher listen the beforeChange event and set the isChanging flag.
2. The batcher wait, e.g. a microtask.
3. The batcher then wait all signals to be clean, before becoming clean itself.

/!\ beforeChange must ALWAYS be emitted before an afterChange event.

We never merge signals, we merge its event to execute an *action* when the signals are ready (e.g. endChange() a computed provider).

WSignal<T>
==========

It needs an *internal* refresh system (with guarded transitions):
- startChange(): announce a futur change, set the isChanging flag.
- endChange(provider: {value: XXX})

Theses methods should be protected, only to be used by links or setValue().

- re-entry synchrone INTERDITS (= boucle infinie)
- provideValue(signal, value) function can create a trivial provider (from a pool ?). This should be external to the signal.
- cache should be handled by the provider.
- lazy computation shouldn't be a signal, but a link between 2 signals, with potentially a cache.
- complex values (e.g. dictionaries) should be managed outside of the signal.

Helpers
=======



- setValue(s, value): build constant() if necessary.
- setValueProvider(s, provider)

Optimizations:
- if changing: do nothing, value is unstable, will be replaced anyway.
- if current constant + equals or (both known + same value): do nothing.

Links
=====

- links : src => dst
- sync  : src <=> dst
    - sync: count => 0 propagate dirty / 2 propage value
        => except orig.
    - syncEditor
    - syncAdapter (?).
- adapter/view: not relevant for now ?

Enable to link a signal to another.

High level API (classes):
- new Link()

Low level API (fonctions):
- link(src, dst): {unlink: (newProvider?: ValueProvider<T>) => void}

- we need to listen to events.afterChange in order to update the destination(s) *after* the source listener execution.

- unlink/unsync => detach ?


Bug sync:
- when still pending after receiving a value => need to trigger dirty...
- if output from trigger = value provider from sync => reentry.

I/O
===

- Input = printer
- Output = generator
- Input+Output = Transformer (different type/value) or Editor (same type/value).

In order to avoid infinite loops in Editors:
- if value comes from input: inputParsed.currentProvider = outputSignal.currentProvider
    - link inputParsed and outputSignal *after* other links (so that it will be the final override).
    - no async

- for subclassing issues, either:
    - make it final
    - use setValue/setProvider ?
    - have an Internal structure
    - have an intermediate signal ?

Properties
==========

It should expose .input/.output as simple object with getters/setters, should also support setter on .input/.output.

It should expose .signals.input / .signals.output.

We *need* to use signals in order to be able to lazy compute the input when requested.