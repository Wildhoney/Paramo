const Float = {
    toType: () => value => {
        const typedValue = parseFloat(value);
        if (Number.isNaN(typedValue)) throw new Error('Invalid t.Float');
        return typedValue;
    },
    toString: () => String,
};

Float.DP = decimalPlaces => ({
    toType: () => value => {
        const typedValue = Float.toType()(value);
        return typedValue.toFixed(decimalPlaces);
    },
    toString: () => value => Float.toString()(value),
});

export default Float;
