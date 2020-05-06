import { equals } from 'ramda';
import { TypeError, isInvalidArray } from '../utils';

const Type = (type) => ({
    defaultValue: [],
    toType: (options) => (value) => {
        if (isInvalidArray(value, options)) throw new TypeError('Invalid t.Array');
        const values = Array.isArray(value) ? value : [].concat(value);
        return values.map((value) => type.toType(options)(value));
    },
    toString: (options) => (values) => {
        if (!Array.isArray(values)) throw new TypeError('Invalid t.Array');
        return values.map((value) => type.toString(options)(value));
    },
    isSame: (a, b) => {
        const x = Array.isArray(a) ? [...a].sort() : a;
        const y = Array.isArray(b) ? [...b].sort() : b;
        return equals(x, y);
    },
});

Type.Sequence = (type) => ({
    defaultValue: [],
    toType: Type(type).toType,
    toString: Type(type).toString,
});

export default Type;
