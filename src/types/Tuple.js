import { TypeError } from '../utils';

export default (...types) => ({
    defaultValue: [],
    toType: options => value => {
        if (!Array.isArray(value) && (value.includes(',') && options.arrayFormat !== 'none'))
            throw new TypeError('Invalid t.Tuple');

        const values = Array.isArray(value) ? value : [].concat(value);
        return values.map((value, index) => types[index].toType(options)(value));
    },
    toString: options => values => {
        if (!Array.isArray(values)) throw new TypeError('Invalid t.Tuple');
        return values.map((value, index) => types[index].toString(options)(value));
    },
});
