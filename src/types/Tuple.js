export default (...types) => ({
    toType: options => values =>
        values.map((value, index) => types[index].toType(options)(value)),
    toString: options => values =>
        values.map((value, index) => types[index].toString(options)(value)),
});
