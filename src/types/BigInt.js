export default {
    toType: () => value => {
        try {
            return BigInt(value);
        } catch {
            throw new Error('Invalid t.BigInt');
        }
    },
    toString: () => String,
};
