import test from 'ava';
import { create, type } from '../../src';

const types = {
    name: type.String,
    isDeveloper: type.Bool,
};

test('It should be able to handle Bool types;', t => {
    const instance = create(types);
    const parsed = instance.parse('name=Adam&isDeveloper=true');
    t.deepEqual(parsed, { name: 'Adam', isDeveloper: true });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?isDeveloper=true&name=Adam');
});

test('It should be able to handle custom Bool types;', t => {
    const instance = create(types, { booleanStrings: ['yar', 'naw'] });
    const parsed = instance.parse('name=Adam&isDeveloper=yar');
    t.deepEqual(parsed, { name: 'Adam', isDeveloper: true });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?isDeveloper=yar&name=Adam');
});

test('It should be able to sanitize Bools when the value is invalid;', t => {
    const instance = create(types);
    const parsed = instance.parse('name=Adam&isDeveloper=yup');
    t.deepEqual(parsed, { name: 'Adam' });
    t.is(instance.stringify({ name: 'Adam', isDeveloper: 'True' }), '?name=Adam');
});
