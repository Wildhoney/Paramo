import test from 'ava';
import { create, type } from '../../src';

const types = {
    name: type.String,
    isDeveloper: type.Bool,
};

test('It should be able to sanitize boolean types;', t => {
    const userParams = create(types, {});
    t.deepEqual(userParams.parse('name=Adam&isDeveloper=true'), {
        name: 'Adam',
        isDeveloper: true,
    });

    // Values that are not boolean should be ignored.
    t.deepEqual(userParams.parse('name=Adam&isDeveloper=n/a'), {
        name: 'Adam',
    });
});
