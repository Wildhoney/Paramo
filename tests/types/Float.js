import test from 'ava';
import { create, type } from '../../src';

const types = {
    name: type.String,
    age: type.Float,
};

test('It should be able to handle Float types;', (t) => {
    const instance = create(types);
    const parsed = instance.parse('name=Adam&age=34.1');
    t.deepEqual(parsed, { name: 'Adam', age: 34.1 });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?age=34.1&name=Adam');
});

test('It should be able to handle Float types with decimal places;', (t) => {
    const instance = create({ ...types, age: type.Float.DP(2) });
    const parsed = instance.parse('name=Adam&age=34.18900');
    t.deepEqual(parsed, { name: 'Adam', age: 34.19 });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?age=34.19&name=Adam');
});

test('It should be able to sanitize BigInts when the value is invalid;', (t) => {
    const instance = create(types);
    const parsed = instance.parse('name=Adam&age=ThirtyFourPointOne');
    t.deepEqual(parsed, { name: 'Adam' });
    t.is(instance.stringify({ name: 'Adam', age: 'ThirtyFourPointOne' }), '?name=Adam');
    t.is(instance.stringify({ name: 'Adam', age: 34 }), '?name=Adam');
});
