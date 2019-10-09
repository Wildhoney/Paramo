export default type => ({
    toType: options => values => {
        if (!Array.isArray(values)) throw new Error('Invalid type.Array');
        return values.map(value => type.toType(options)(value));
    },
    toString: options => values =>
        values.map(value => type.toString(options)(value)),
});
