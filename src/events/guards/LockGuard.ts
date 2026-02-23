import { mutable } from "../../types/mutable";
import { Guard } from "./core/types";

// Leave directly, used to prevent re-entry.
export default class LockGuard implements Guard {

    readonly isInside: boolean = false;

    enter() {
        if( this.isInside )
            return false;

        mutable(this).isInside = true;
        return true; 
    }

    leave() {
        mutable(this).isInside = false;
        return true; 
    }
}