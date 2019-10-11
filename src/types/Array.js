import { equals } from 'ramda';
import { TypeError } from '../utils';

const Type = type => ({
    toType: options => value => {
        if (!Array.isArray(value) && (value.includes(',') && options.arrayFormat !== 'none'))
            throw new TypeError('Invalid t.Array');

        const values = Array.isArray(value) ? value : [].concat(value);
        return values.map(value => type.toType(options)(value));
    },
    toString: options => values => values.map(value => type.toString(options)(value)),
    isSame: (a, b) => equals([...a].sort(), [...b].sort()),
});

Type.Sequence = type => ({
    toType: Type(type).toType,
    toString: Type(type).toString,
});

export default Type;
