const Type = {
    toType: () => value => {
        const typedValue = parseFloat(value);
        if (Number.isNaN(typedValue)) throw new Error('Invalid t.Float');
        return typedValue;
    },
    toString: () => String,
};

Type.DP = decimalPlaces => ({
    toType: () => value => {
        const typedValue = Type.toType()(value);
        return typedValue.toFixed(decimalPlaces);
    },
    toString: () => value => Type.toString()(value),
});

export default Type;
