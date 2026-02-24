import { ValueProvider } from "../RSignal";

export default function computed<T>(fn: () => T): ValueProvider<T> {
    return {
        isConstant  : false,
        isValueKnown: false,
        get value() { return fn() }
    }
}