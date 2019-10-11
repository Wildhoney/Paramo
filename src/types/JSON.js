import { TypeError } from '../utils';

export default {
    toType: () => value => {
        try {
            return JSON.parse(value);
        } catch {
            throw new TypeError('Invalid t.JSON');
        }
    },
    toString: () => JSON.stringify,
};
