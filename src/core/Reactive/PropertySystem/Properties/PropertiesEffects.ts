import { NULL_OP } from "MWL@2026/core/types";
import { PROPERTIES, Properties } from "./PropertiesImpl";
import { getPropertyIndex } from "./PropertiesProvider";
import { REACTIVE_NODE } from "../ReactiveObject/ReactiveObject";
import { ReactiveNode } from "../ReactiveObject/ReactiveNode";

// PropertiesEffects should not have the responsibility to
// watch the properties.
export class PropertiesEffects<T extends Record<string, any>> {

    readonly properties: Properties<Readonly<T>>;
    readonly nodes: ReactiveNode[];

    protected versions: number[];
    protected changes : boolean[];

    readonly effectsCond      = new Array<number[]>();
    readonly effectsCallbacks = new Array<() => void>();
    afterEffectsCallback = NULL_OP;

    constructor(properties: Properties<Readonly<T>>) {
        this.properties = properties;

        const props = properties[PROPERTIES];
        const length = props.length;

        this.versions = new Array( length );
        // for the initial call.
        this.versions.fill(0);

        this.changes = new Array( length );

        this.nodes = new Array(length);
        for(let i = 0; i < this.nodes.length; ++i)
            this.nodes[i] = props[i][REACTIVE_NODE];
    }

    render() {

        let effectTriggered = false;

        for(let i = 0; i < this.versions.length; ++i) {
            this.changes[i] = this.versions[i] !== this.nodes[i].version;
            this.versions[i] = this.nodes[i].version;
        }

        for(let i = 0; i < this.effectsCond.length; ++i)
            for(let j = 0; j < this.effectsCond[i].length; ++j)
                if( this.changes[this.effectsCond[i][j]] ) {
                    effectTriggered = true;
                    this.effectsCallbacks[i]();
                    break;
                }

        if( effectTriggered )
            this.afterEffectsCallback();

        return effectTriggered;
    }

    add(cond: Extract<keyof T, string>[]
               | Extract<keyof T, string>,
         callback: () => void) {

        this.effectsCallbacks.push(callback);

        let idx;
        if( ! Array.isArray(cond) )
            idx = [ getPropertyIndex(this.properties, cond) ]
        else {
            idx = new Array<number>(cond.length);
            for(let i = 0; i < idx.length; ++i)
                idx[i] = getPropertyIndex(this.properties, cond[i]);
        }

        this.effectsCond.push(idx);
    }

    after(callback: () => void) {
        this.afterEffectsCallback = callback;
    }
}