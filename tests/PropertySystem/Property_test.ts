import "@config";
import { assertEquals } from "std/assert";

import {Property} from "MWL@2026/core/Reactive/PropertySystem/Property/Property";
import {ValueController} from "MWL@2026/core/Reactive/PropertySystem/Controllers/Value.ts";

import {forward} from "MWL@2026/core/Reactive/PropertySystem/Property/sync/forward";
import {bind} from "MWL@2026/core/Reactive/PropertySystem/Property/sync/bind";
import { listen } from "MWL@2026/exports/Reactive/Observable.ts";

Deno.test("Get", () => {
    const property = new Property(new ValueController(42));

    assertEquals( property.get(), 42 );
});

Deno.test("Set", () => {

    const property = new Property(new ValueController(0));
    property.set(42);

    assertEquals( property.get(), 42 );
});

Deno.test("Forward", () => {

    const A = new Property(new ValueController(1));
    const B = new Property(new ValueController(2));

    forward(A, B);
    
    assertEquals( A.get(), B.get() );

    A.set(3);
    
    assertEquals( B.get(), 3 );

    B.set(4);
    
    assertEquals( B.get(), 4 );
    assertEquals( A.get(), 3 );

    A.set(5);
    
    assertEquals( B.get(), 5 );
});

Deno.test("Bind", () => {

    const A = new Property(new ValueController(1));
    const B = new Property(new ValueController(2));

    bind(A, B);
    
    assertEquals( A.get(), B.get() );

    A.set(3);
    
    assertEquals( A.get(), 3 );
    assertEquals( B.get(), 3 );

    B.set(4);
    
    assertEquals( B.get(), 4 );
    assertEquals( A.get(), 4 );
});


Deno.test("Bind xN", () => {

    const array = new Array<Property<number>>(10);
    for(let i = 0; i < array.length; ++i)
        array[i] = new Property(new ValueController(i));

    for(let i = 1; i < array.length; ++i)
        bind(array[i-1], array[i]);

    const first = array[0];
    const last  = array[array.length -1];
    
    assertEquals( first.get(), last.get() );

    first.set(3);

    assertEquals( first.get(), last.get() );
    
    last.set(4);
    
    assertEquals( first.get(), last.get() );
});

Deno.test("notify", () => {
    
    const property = new Property(new ValueController(1));

    let ok = false;
    listen(property, () => {
        ok = true;
    });

    property.set(2);

    assertEquals(ok, true);
});

Deno.test("notify x2", () => {
    
    const A = new Property(new ValueController(1));
    const B = new Property(new ValueController(2));

    bind(A, B);

    let count = 0;
    listen(A, () => {
        ++count;
    });

    A.set(2);
    B.set(3);

    assertEquals(count, 2);
});

Deno.test("Set x2 =", () => {

    const property = new Property(new ValueController(0));

    let count = 0;
    listen(property, () => ++count);

    property.set(42);
    property.set(42);

    assertEquals(count, 1);
});

Deno.test("Set x2 !=", () => {

    const property = new Property(new ValueController(0));

    let count = 0;
    listen(property, () => ++count);

    property.set(42);
    property.set(43);

    assertEquals(count, 2);
});