import { test, expect } from "vitest";
import { createSelector } from "./index";

type RootState = {
    foo: { a: number; b: number; c: number };
    bar: { d: number; e: { baz: number } };
    qux: { f: number; g: number };
};

const store: RootState = {
    foo: {
        a: 1,
        b: 2,
        c: 3,
    },
    bar: {
        d: 4,
        e: { baz: 5 },
    },
    qux: { f: 6, g: 7 },
};

const selectFoo = createSelector(
    [
        (state: RootState) => state.foo.a,
        (state: RootState) => state.foo.b,
        (state: RootState) => state.foo.c,
    ],
    (a, b, c) => {
        return { a, b, c };
    },
);

const selectBar = createSelector(
    [(state: RootState) => state.bar.d, (state: RootState) => state.bar.e.baz],
    (d, baz) => {
        return {
            d,
            e: { baz },
        };
    },
);

test("selectFoo", () => {
    const foo = selectFoo(store);

    // modify foo while keeping values the same
    store.foo = {
        a: 1,
        b: 2,
        c: 3,
    };

    expect(selectFoo(store)).toBe(foo);

    // modify bar *without* keeping values the same
    store.foo = {
        a: 1,
        b: 2,
        c: 4,
    };

    expect(selectFoo(store)).not.toBe(foo);
    expect(selectFoo(store)).toEqual({
        a: 1,
        b: 2,
        c: 4,
    });
});

test("selectBar", () => {
    const bar = selectBar(store);

    // modify bar while keeping values the same
    store.bar = {
        d: 4,
        e: { baz: 5 },
    };

    expect(selectBar(store)).toBe(bar);

    // modify bar *without* keeping values the same
    store.bar = {
        d: 4,
        e: { baz: 6 },
    };

    expect(selectBar(store)).not.toBe(bar);
    expect(selectBar(store)).toEqual({
        d: 4,
        e: { baz: 6 },
    });
});

test("combining memoized selectors", () => {
    const selectFoobar = createSelector([selectFoo, selectBar], (foo, bar) => {
        return { foo, bar };
    });

    const foobar = selectFoobar(store);

    // modify the store, but don't modify foo or bar
    store.qux = { f: store.qux.f + 1, g: store.qux.g + 1 };

    expect(selectFoobar(store)).toBe(foobar);

    store.foo = { a: 1, b: 2, c: 5 };

    expect(selectFoobar(store)).not.toBe(foobar);

    expect(selectFoobar(store)).toEqual({
        foo: { a: 1, b: 2, c: 5 },
        bar: { d: 4, e: { baz: 6 } },
    });
});
