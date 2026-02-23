import constant from "./providers/constant";
import NO_VALUE_PROVIDER, { NO_VALUE } from "./providers/no_value";
import { ValueProvider } from "./RSignal";
import Signal from "./Signal";

export function createNullableSignal<T>(value: T|typeof NO_VALUE = NO_VALUE) {

    let provider: ValueProvider<T|typeof NO_VALUE>;
    if( value === NO_VALUE )
        provider = NO_VALUE_PROVIDER;
    else
        provider = constant(value);

    return new Signal<T|typeof NO_VALUE>( provider );
}


export function createSignal<T>(value: T) {
    return new Signal<T>( constant(value) );
}