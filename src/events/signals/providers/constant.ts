import { ValueProvider } from "../Signal";

export default function constant<T>(value: T): ValueProvider<T> {
    return {
        value
    }
}