Reconstructing a simplified version of how
[createSelector](https://github.com/reduxjs/reselect) for Redux might work.

```typescript
export const createSelector = (
    selectors: ((state: any) => any)[],
    combiner: (...args: any[]) => any,
) => {
    const cache: { args: any[]; value: any } = { args: [], value: undefined };

    return (state: any) => {
        const newArgs = selectors.map((selector) => selector(state));

        for (let i = 0; i < newArgs.length; ++i) {
            if (newArgs[i] !== cache.args[i]) {
                cache.args = newArgs;
                cache.value = combiner(...cache.args);
            }
        }

        return cache.value;
    };
};
```
