export default (...types) => ({
    toType: options => values => {
        if (!Array.isArray(values)) throw new Error('Invalid type.Tuple');
        return values.map((value, index) =>
            types[index].toType(options)(value),
        );
    },
    toString: options => values =>
        values.map((value, index) => types[index].toString(options)(value)),
});
