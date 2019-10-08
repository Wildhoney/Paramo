export default {
    toType: () => value => {
        const type = Number(value);
        if (typeof type !== 'number' || Number.isNaN(type))
            throw new Error('Invalid t.Int');
        return type;
    },
    toString: () => String,
};
