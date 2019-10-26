import { equals } from 'ramda';
import { TypeError } from '../utils';

const Type = type => ({
    toType: options => value => {
        if (!Array.isArray(value) && (value.includes(',') && options.arrayFormat !== 'none'))
            throw new TypeError('Invalid t.Array');

        const values = Array.isArray(value) ? value : [].concat(value);
        return values.map(value => type.toType(options)(value));
    },
    toString: options => values => {
        if (!Array.isArray(values)) throw new TypeError('Invalid t.Array');
        return values.map(value => type.toString(options)(value));
    },
    defaultValue: [],
    isSame: (a, b) => {
        if (Boolean(!Array.isArray(a)) ^ Boolean(!Array.isArray(b))) return false;
        return equals([...a].sort(), [...b].sort());
    },
});

Type.Sequence = type => ({
    toType: Type(type).toType,
    toString: Type(type).toString,
    defaultValue: [],
});

export default Type;
