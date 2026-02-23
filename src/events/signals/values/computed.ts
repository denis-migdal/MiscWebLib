import { ValueProvider } from "../Signal";

export default function constant<T>(fn: () => T): ValueProvider<T> {
    return {
        get value() { return fn() }
    }
}