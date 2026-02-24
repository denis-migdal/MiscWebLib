Event and signals are required as we *need* a way to notify.
Still, we need to respect SRP and encapsulation.

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

It needs 2 events:
- beforeChange: current value isn't clean anymore, new value will soon be provider.
- afterChange: a new value is available.

/!\ The value between beforeChange and afterChange is instable.

We provide an addListener() as a shortcut for .events.change.addListener()

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

Links
=====

Enable to link a signal to another.

High level API (classes):
- new Link()

Low level API (fonctions):
- link(src, dst): {unlink: (newProvider?: ValueProvider<T>) => void}

Properties
==========

It should expose .input/.output as simple object with getters/setters, should also support setter on .input/.output.

It should expose .signals.input / .signals.output.

We *need* to use signals in order to be able to lazy compute the input when requested.