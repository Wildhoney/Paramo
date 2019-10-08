import test from 'ava';
import { create, type } from '../../src';

const types = {
    name: type.String,
    latestRatings: type.Array(type.Int),
};

test('It should be able to sanitize array types;', t => {
    const userParams = create(types, { arrayFormat: 'comma' });
    t.deepEqual(userParams.parse('name=Adam&latestRatings=5,18,24,9'), {
        name: 'Adam',
        latestRatings: [5, 18, 24, 9],
    });

    {
        // Values that are not arrays should be ignored.
        const userParams = create(types, { arrayFormat: 'index' });
        t.deepEqual(userParams.parse('name=Adam&latestRatings=5,18,24,9'), {
            name: 'Adam',
        });
    }

    {
        // Values that contain invalid primitives should be ignored.
        const userParams = create(types, { arrayFormat: 'comma' });
        t.deepEqual(userParams.parse('name=Adam&latestRatings=n/a'), {
            name: 'Adam',
        });
    }
});
