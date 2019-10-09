export default {
    toType: () => value => {
        const typedValue = parseFloat(value);
        if (Number.isNaN(typedValue)) throw new Error('Invalid t.Float');
        return typedValue;
    },
    toString: () => String,
};
