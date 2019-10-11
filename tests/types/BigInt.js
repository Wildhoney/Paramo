import test from 'ava';
import { create, type } from '../../src';

const types = {
    name: type.String,
    age: type.BigInt,
};

test('It should be able to handle BigInt types;', t => {
    const instance = create(types);
    const parsed = instance.parse('name=Adam&age=34');
    t.deepEqual(parsed, { name: 'Adam', age: 34n });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?age=34&name=Adam');
});

test('It should be able to sanitize BigInts when the value is invalid;', t => {
    const instance = create(types);
    const parsed = instance.parse('name=Adam&age=ThirtyFour');
    t.deepEqual(parsed, { name: 'Adam' });
    {
        const parsed = instance.parse('name=Adam&age=34.1');
        t.deepEqual(parsed, { name: 'Adam' });
    }
});
