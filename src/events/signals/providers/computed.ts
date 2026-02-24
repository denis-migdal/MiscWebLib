import { ValueProvider } from "../RSignal";

export default function computed<T>(fn: () => T): ValueProvider<T> {
    return {
        get value() { return fn() }
    }
}