export default {
    toType: () => value => {
        const typedValue = parseInt(value);
        if (Number.isNaN(typedValue)) throw new Error('Invalid t.Int');
        return typedValue;
    },
    toString: () => String,
};
