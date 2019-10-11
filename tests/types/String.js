import test from 'ava';
import { create, type } from '../../src';

const types = {
    name: type.String,
};

test('It should be able to handle String types;', t => {
    const instance = create(types);
    const parsed = instance.parse('name=Adam');
    t.deepEqual(parsed, { name: 'Adam' });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?name=Adam');
});
