import test from 'ava';
import { create, type, option } from '../../src';

const types = {
    name: type.String,
    languages: type.Array(type.String),
};

test('It should be able to sanitize tuple types;', t => {
    const userParams = create(types, { arrayFormat: option.arrayFormat.comma });
    t.deepEqual(
        userParams.parse('name=Adam&languages=English,Russian,Spanish'),
        {
            name: 'Adam',
            languages: ['English', 'Russian', 'Spanish'],
        },
    );

    {
        // Values that are not tuples should be ignored.
        const userParams = create(types, {
            arrayFormat: option.arrayFormat.index,
        });
        t.deepEqual(
            userParams.parse('name=Adam&languages=English,Russian,Spanish'),
            {
                name: 'Adam',
            },
        );
    }
});
