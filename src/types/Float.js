import { TypeError } from '../utils';

const Type = {
    toType: () => value => {
        const typedValue = parseFloat(value);
        if (Number.isNaN(typedValue)) throw new TypeError('Invalid t.Float');
        return typedValue;
    },
    toString: () => value => {
        if (typeof value !== 'number' || Number.isInteger(value)) throw new TypeError('Invalid t.Float');
        return String(value);
    },
};

Type.DP = decimalPlaces => ({
    toType: () => value => {
        const typedValue = Type.toType()(value);
        return Type.toType()(typedValue.toFixed(decimalPlaces));
    },
    toString: () => String,
});

export default Type;
