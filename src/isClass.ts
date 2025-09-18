import type {Cstr} from "./types/Cstr";

export default function isClass(obj: unknown): obj is Cstr {
    const prototype = Object.getOwnPropertyDescriptor(obj, "prototype");
    if( prototype === undefined)
        return false;
    return prototype.writable === false;
}