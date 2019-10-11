import { TypeError } from '../utils';

export default {
    toType: () => value => {
        const typedValue = parseInt(value);
        if (Number.isNaN(typedValue)) throw new TypeError('Invalid t.Int');
        return typedValue;
    },
    toString: () => String,
};
