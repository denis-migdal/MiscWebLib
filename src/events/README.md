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

It needs 2 properties:
- outdated
- value: T|NO_VALUE

Value should be NO_VALUE when no value is provided. This is necessary to avoid:
- throwing exceptions (causes issues when using RSignal as a provider).
- using a .hasValue flag that'd incite to provide a default value for .value.
- using a default value (e.g. null) for .value

It needs 2 events:
- outdated: the current value isn't clean anymore.
- change: a new value is available.

The outdated event must be synchronous in order to properly batch merged signals:
1. The batcher listen the outdated event and become outdated itself.
2. The batcher wait, e.g. a microtask.
3. The batcher then wait all signals to be clean, before becoming clean itself.

WSignal<T>
==========

It needs 1 properties:
- currentProvider: gives the signal value.

It needs an dirty system (with guarded transitions):
- needsRefresh(): announce a futur refresh, set the state as outdate.
- refreshWith(provider: {value: XXX})

- re-entry synchrone INTERDITS (= boucle infinie)
- provideValue(signal, value) function can create a trivial provider (from a pool ?). This should be external to the signal.
- cache should be handled by the provider.
- lazy computation shouldn't be a signal, but a link between 2 signals, with potentially a cache.
- complex values (e.g. dictionaries) should be managed outside of the signal.

Properties
==========

It should expose .input/.output as simple object with getters/setters, should also support setter on .input/.output.

It should expose .signals.input / .signals.output.

We *need* to use signals in order to be able to lazy compute the input when requested.