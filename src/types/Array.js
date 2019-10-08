export default type => ({
    toType: options => values =>
        values.map(value => type.toType(options)(value)),
    toString: options => values =>
        values.map(value => type.toString(options)(value)),
});
