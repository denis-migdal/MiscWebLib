import {REvent, WEvent} from "./Event";

import "../types/asRW"
declare module "../types/asRW" {
    export default function asRW<T>(ro: REvent<T>): REvent<T>&WEvent<T>
}