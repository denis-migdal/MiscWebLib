import type {Cstr} from "./types/Cstr";

export default function is_class(obj: unknown): obj is Cstr {
    const prototype = Object.getOwnPropertyDescriptor(obj, "prototype");
    if( prototype === undefined)
        return false;
    return prototype.writable === false;
}