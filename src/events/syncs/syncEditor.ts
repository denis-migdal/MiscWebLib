import { REvent } from "../Event";
import RSignal    from "../signals/RSignal";
import Signal     from "../signals/Signal";

import LockGuard  from "../guards/LockGuard";

export type Editor<T extends Readonly<Record<string,any>>> = {
    inputSignal :  Signal<Partial<T>>
    outputSignal: RSignal<T>
}

export function createSignalFromEditor<T extends Readonly<Record<string,any>>>(
                                            editor: Editor<T>
                                        ) {
    const signal = new Signal(editor.outputSignal.currentProvider);

    syncEditor(editor, signal);

    return signal;
}

export default function syncEditor<T extends Readonly<Record<string,any>>> (
                                    editor: Editor<T>,
                                    signal: Signal<Partial<T>>
                                ) {

    const guard = new LockGuard();

    function startChange(ev: REvent<unknown>) {

        if( ! guard.enter() ) return;

        // notify the other.
        if( ev.target === signal )
            Signal.startChange(editor.inputSignal);
        else
            Signal.startChange(signal);

        guard.leave();
    }

    function endChange(ev: REvent<unknown>) {

        if( ! guard.enter() ) return;

        // notify the other.
        if( ev.target === signal )
            Signal.endChange(editor.inputSignal, signal.currentProvider);
        else
            Signal.endChange(signal, editor.outputSignal.currentProvider);

        guard.leave();
    }

    // becomes pending...
    signal             .events.beforeChange.addListener( startChange );
    editor.outputSignal.events.beforeChange.addListener( startChange );

    // has a value...
    signal             .events.afterChange.addListener( endChange );
    editor.outputSignal.events.afterChange.addListener( endChange );

}