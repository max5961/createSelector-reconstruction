export const createSelector = (
    selectors: ((state: any) => any)[],
    combiner: (...args: any[]) => any,
) => {
    const last: { cache: any[]; value: any } = { cache: [], value: undefined };

    return (state: any) => {
        const newCache = selectors.map((selector) => selector(state));

        for (let i = 0; i < newCache.length; ++i) {
            if (newCache[i] !== last.cache[i]) {
                last.cache = newCache;
                last.value = combiner(...last.cache);
            }
        }

        return last.value;
    };
};
