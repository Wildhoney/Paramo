import test from 'ava';
import { create, type } from '../../src';

const types = {
    name: type.String,
    age: type.Float,
};

test('It should be able to sanitize float types;', t => {
    const userParams = create(types, {});
    t.deepEqual(userParams.parse('name=Adam&age=33.8'), {
        name: 'Adam',
        age: 33.8,
    });

    // Values that are not float should be ignored.
    t.deepEqual(userParams.parse('name=Adam&age=n/a'), { name: 'Adam' });
});

test.only('It should be able to sanitize float types with decimal places;', t => {
    const userParams = create({ ...types, age: type.Float.DP(2) }, {});
    t.deepEqual(userParams.parse('name=Adam&age=33.8'), {
        name: 'Adam',
        age: '33.80',
    });

    // Values that are not float should be ignored.
    t.deepEqual(userParams.parse('name=Adam&age=n/a'), { name: 'Adam' });
});
