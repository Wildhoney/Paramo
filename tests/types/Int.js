import test from 'ava';
import { create, type } from '../../src';

const types = {
    name: [type.String, 'Adam'],
    age: [type.Int, 33],
};

test('It should be able to sanitize integer parameters;', t => {
    const userParams = create(types, {});
    t.deepEqual(userParams.parse('name=Adam&age=33'), {
        name: 'Adam',
        age: 33,
    });

    // Values that are not integer should be ignored.
    t.deepEqual(userParams.parse('name=Adam&age=n/a'), { name: 'Adam' });
});
