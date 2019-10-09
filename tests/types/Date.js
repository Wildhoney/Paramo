import test from 'ava';
import { create, type } from '../../src';

const types = {
    name: type.String,
    birthDate: type.Date,
};

test('It should be able to sanitize date types;', t => {
    const userParams = create(types, {});
    t.deepEqual(userParams.parse('name=Adam&birthDate=10-10-1985'), {
        name: 'Adam',
        birthDate: new Date('10-10-1985'),
    });

    // Values that are not date should be ignored.
    t.deepEqual(userParams.parse('name=Adam&birthDate=n/a'), { name: 'Adam' });
});
