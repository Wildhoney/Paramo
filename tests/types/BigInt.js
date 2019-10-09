import test from 'ava';
import { create, type } from '../../src';

const types = {
    name: type.String,
    age: type.BigInt,
};

test('It should be able to sanitize int types;', t => {
    const userParams = create(types, {});
    t.deepEqual(userParams.parse('name=Adam&age=33'), {
        name: 'Adam',
        age: BigInt(33),
    });

    // Values that are not integer should be ignored.
    t.deepEqual(userParams.parse('name=Adam&age=n/a'), { name: 'Adam' });
    t.deepEqual(userParams.parse('name=Adam&age=33.8'), { name: 'Adam' });
});
