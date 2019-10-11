import test from 'ava';
import { create, type, option } from '../../src';

const types = {
    name: type.String,
    profile: [type.Tuple(type.String, type.Int, type.Bool), ['Software Developer', 34, true]],
};

test('It should be able to handle comma separated tuples;', t => {
    const instance = create(types, {
        arrayFormat: option.arrayFormat.comma,
        booleanStrings: ['yar', 'naw'],
    });
    const parsed = instance.parse('name=Adam&profile=Software%20Developer,34,yar');
    t.deepEqual(parsed, { name: 'Adam', profile: ['Software Developer', 34, true] });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?name=Adam&profile=Software%20Developer,34,yar');
});

test('It should be able to sanitize tuples when its values are invalid;', t => {
    const instance = create(types, { arrayFormat: option.arrayFormat.comma });
    const parsed = instance.parse('name=Adam&profile=Software Developer,ThirtyFour,True');
    t.deepEqual(parsed, { name: 'Adam' });
});
