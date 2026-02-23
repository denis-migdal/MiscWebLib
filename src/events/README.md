Event and signals are required as we *need* a way to notify.
Still, we need to respect SRP and encapsulation.

TODO: signals
- re-entry synchrone INTERDITS (= boucle infinie)
- en dehors listener soit
    - utiliser une fonction pour une valeur par défaut
    - flush(signal, () => {} ) / flushMany()
    - utiliser un cache dans le listener (last known value)
    - .value => calculer valeur potentiellement intermédiaire.
        => mettre à jour .currentProvider qu'au dernier validate.
- dirty => outdated
    - markOutdated() / -> needsRefresh() / invalidate()
    - refreshWith()
- listener fallback() [=> détecter l'abs de value ???]
    - getValue(s, fallback)
    - hasValue(s)
- NOVALUE_PROVIDER => NO_VALUE (symbol).
    - .value ne peut pas throw => lui-même provider possible.
- avoid hasValue() => compute the value...

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
- dirty
- value: T, throws exception if dirty is true.

It needs 2 events:
- dirty: the current value isn't clean anymore.
- change: a new value is available.

The dirty event must be synchronous in order to properly batch merged signals:
1. The batcher listen the dirty event and become dirty itself.
2. The batcher wait, e.g. a microtask.
3. The batcher then wait all signals to be clean, before becoming clean itself.

WSignal<T>
==========

It needs 1 properties:
- currentProvider: gives the signal value.

It needs an dirty system (with re-entry):
- markDirty(): set the state as dirty.
- refreshWith(provider: {value: XXX})

- provideValue(signal, value) function can create a trivial provider (from a pool ?). This should be external to the signal.
- cache should be handled by the provider.
- signal should not know what is the default value/how to reset().
- lazy computation shouldn't be a signal, but a link between 2 signals, with potentially a cache.
- complex values (e.g. dictionaries) should be managed outside of the signal.

Properties
==========

It should expose .input/.output as simple object with getters/setters, should also support setter on .input/.output.

It should expose .signals.input / .signals.output.

We *need* to use signals in order to be able to lazy compute the input when requested.