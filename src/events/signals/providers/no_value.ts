import RSignal from "../RSignal";

export const NO_VALUE = null; //Symbol("NO VALUE");

const NO_VALUE_PROVIDER = {
    value: NO_VALUE
} as const;

export default NO_VALUE_PROVIDER;

export function getValue<T, U>(s: RSignal<T|typeof NO_VALUE>, defaultValue: U) {
    
    const value = s.value;
    
    if( value === NO_VALUE )
        return defaultValue;
    
    return value;
}