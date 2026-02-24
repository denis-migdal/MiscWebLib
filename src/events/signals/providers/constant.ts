import { ValueProvider } from "../RSignal";

export default function constant<T>(value: T): ValueProvider<T> {
    return {
        isConstant  : true,
        isValueKnown: true,
        value
    }
}