import { TypeError } from '../utils';

export default {
    toType: () => value => {
        try {
            return BigInt(value);
        } catch {
            throw new TypeError('Invalid t.BigInt');
        }
    },
    toString: () => String,
};
