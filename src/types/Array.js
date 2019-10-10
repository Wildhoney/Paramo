import { equals } from 'ramda';

const Type = type => ({
    toType: options => value => {
        if (
            !Array.isArray(value) &&
            (value.includes(',') && options.arrayFormat !== 'none')
        )
            throw new Error('Invalid t.Array');

        const values = Array.isArray(value) ? value : [].concat(value);
        return values.map(value => type.toType(options)(value));
    },
    toString: options => values =>
        values.map(value => type.toString(options)(value)),
    isSame: (a, b) => equals([...a].sort(), [...b].sort()),
});

Type.Sequence = type => ({
    toType: Type(type).toType,
    toString: Type(type).toString,
    isSame: equals,
});

export default Type;
