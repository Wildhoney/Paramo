import test from 'ava';
import { create, type } from '../../src';

const types = {
    name: type.String,
    age: type.Int,
};

test('It should be able to handle Int types;', (t) => {
    const instance = create(types);
    const parsed = instance.parse('name=Adam&age=34');
    t.deepEqual(parsed, { name: 'Adam', age: 34 });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?age=34&name=Adam');
});

test('It should be able to round floats for the Int type;', (t) => {
    const instance = create(types);
    const parsed = instance.parse('name=Adam&age=34.1');
    t.deepEqual(parsed, { name: 'Adam', age: 34 });
});

test('It should be able to sanitize Ints when the value is invalid;', (t) => {
    const instance = create(types);
    const parsed = instance.parse('name=Adam&age=ThirtyFour');
    t.deepEqual(parsed, { name: 'Adam' });
    t.is(instance.stringify({ name: 'Adam', age: 'ThirtyFour' }), '?name=Adam');
    t.is(instance.stringify({ name: 'Adam', age: 34.1 }), '?name=Adam');
});
