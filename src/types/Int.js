import { TypeError } from '../utils';

export default {
    toType: () => value => {
        const typedValue = parseInt(value);
        if (Number.isNaN(typedValue)) throw new TypeError('Invalid t.Int');
        return typedValue;
    },
    toString: () => value => {
        if (typeof value !== 'number' || !Number.isInteger(value)) throw new TypeError('Invalid t.Int');
        return String(value);
    },
};
