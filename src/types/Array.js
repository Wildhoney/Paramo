export default type => ({
    toType: options => value => {
        if (!Array.isArray(value) && value.includes(','))
            throw new Error('Invalid t.Array');
        const values = Array.isArray(value) ? value : [].concat(value);
        return values.map(value => type.toType(options)(value));
    },
    toString: options => values =>
        values.map(value => type.toString(options)(value)),
});
