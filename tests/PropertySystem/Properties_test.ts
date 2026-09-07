import "@config";
import { assertEquals } from "std/assert";

import {Properties} from "MWL@2026/core/Reactive/PropertySystem/Properties/Properties.ts";

import {updateProperties} from "MWL@2026/core/Reactive/PropertySystem/Properties/PropertiesProvider.ts";

import { listen } from "MWL@2026/exports/Reactive/Observable.ts";
import { Value } from "MWL@2026/core/Reactive/PropertySystem/Controllers/Value.ts";
import { View } from "MWL@2026/core/Reactive/PropertySystem/Controllers/View.ts";
import { Constant } from "MWL@2026/core/Reactive/PropertySystem/Controllers/Constant.ts";

Deno.test("Get", () => {
    const properties = Properties({foo: Value(42)});
    //properties.foo = 43;

    assertEquals( properties.foo, 42 );
});

Deno.test("Update", () => {

    const properties = Properties({
        foo: Value(42),
        faa: Value(42),
        fuu: Constant(42)
    });

    let count = 0;

    listen(properties, () => {
        ++count;
    });

    updateProperties(properties, {foo: 34, faa: 34});

    assertEquals(count, 1);
});

Deno.test("View", () => {

    const properties = Properties({
        foo: Value(42),
        faa: View("foo", (value: number) => { return value*2 })
    });

    assertEquals( properties.faa, 84 );
});

Deno.test("JSON", () => {

    const properties = Properties({
        foo: Value(42),
        faa: View("foo", (value: number) => { return value*2 })
    });

    assertEquals( JSON.stringify(properties), '{"foo":42,"faa":84}' );
})