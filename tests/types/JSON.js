import test from 'ava';
import { create, type } from '../../src';

const types = {
    name: type.String,
    profile: type.JSON,
};

test('It should be able to handle JSON types;', (t) => {
    const instance = create(types);
    const model = {
        name: 'Adam',
        profile: {
            age: 34,
            city: 'London',
        },
    };
    const stringified = instance.stringify(model);
    t.snapshot(stringified);
    const parsed = instance.parse(stringified);
    t.deepEqual(parsed, model);
});

test('It should be able to sanitize JSON when the value is invalid;', (t) => {
    const instance = create(types);
    const parsed = instance.parse('name=Adam&profile=34,London');
    t.deepEqual(parsed, { name: 'Adam' });
});
