import { TypeError } from '../utils';

export default {
    toType: () => (value) => {
        try {
            return BigInt(value);
        } catch {
            throw new TypeError('Invalid t.BigInt');
        }
    },
    toString: () => (value) => {
        if (!(Object(value) instanceof BigInt)) throw new TypeError('Invalid t.BigInt');
        return String(value);
    },
};
