import test from 'ava';
import { create, type, Type } from '../../src';

const Location = new Type();

Location.setParse(({ value, raise }) => {
    if (!value.includes(',')) raise('Invalid t.Location');
    return value.split(' ').map((a) => a.split(',').map(Number));
});

Location.setStringify(({ value, raise }) => {
    try {
        return value.map(([a, b]) => `${a},${b}`).join(' ');
    } catch {
        raise('Invalid t.Location');
    }
});

const types = {
    name: type.String,
    location: Location,
};

test('It should be able to handle custom types;', (t) => {
    const instance = create(types);
    const model = {
        name: 'Adam',
        location: [
            [1, 2],
            [3, 4],
            [5, 6],
        ],
    };
    const stringified = instance.stringify(model);
    t.snapshot(stringified);
    const parsed = instance.parse(stringified);
    t.deepEqual(parsed, model);
});

test('It should be able to sanitize custom types when the value is invalid;', (t) => {
    const instance = create(types);
    const stringified = instance.stringify({ name: 'Adam', location: [] });
    t.is(stringified, '?name=Adam');
    const parsed = instance.parse('?name=Adam&location=1');
    t.deepEqual(parsed, { name: 'Adam' });
});

test('It should be able to apply the defaults for custom types;', (t) => {
    const instance = create({ ...types, location: [Location, [[1, 2]]] }, { includeDefaults: true });
    const stringified = instance.stringify({ name: 'Adam', location: false });
    t.snapshot(stringified);
    const parsed = instance.parse(stringified);
    t.deepEqual(parsed, { name: 'Adam', location: [[1, 2]] });
});

test('It should be able to skip applying defaults for custom types if default is invalid;', (t) => {
    const instance = create({ ...types, location: [Location, 'an invalid default'] }, { includeDefaults: true });
    const stringified = instance.stringify({ name: 'Adam', location: false });
    t.is(stringified, '?name=Adam');
});
