import { ValueProvider } from "../RSignal";

export default function constant<T>(fn: () => T): ValueProvider<T> {
    return {
        get value() { return fn() }
    }
}