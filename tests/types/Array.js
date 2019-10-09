import test from 'ava';
import { create, type } from '../../src';

const types = {
    name: type.String,
    countries: type.Array(type.String),
};

test('It should be able to sanitize array types;', t => {
    const userParams = create(types, { arrayFormat: 'comma' });

    t.deepEqual(userParams.parse('name=Adam&countries=UK,RU'), {
        name: 'Adam',
        countries: ['UK', 'RU'],
    });

    t.deepEqual(userParams.parse('name=Adam&countries=UK'), {
        name: 'Adam',
        countries: ['UK'],
    });

    {
        // Values that are not arrays should be ignored.
        const userParams = create(types, { arrayFormat: 'index' });
        t.deepEqual(userParams.parse('name=Adam&countries=UK,RU'), {
            name: 'Adam',
        });
    }

    {
        // Values that contain invalid primitives should be ignored.
        const userParams = create(
            { ...types, countries: t.Int },
            { arrayFormat: 'comma' },
        );
        t.deepEqual(userParams.parse('name=Adam&countries=n/a'), {
            name: 'Adam',
        });
    }
});

test('It should be able to handle bracket list types;', t => {
    const userParams = create(types, { arrayFormat: 'bracket' });
    t.deepEqual(userParams.parse('name=Adam&countries[]=UK&countries[]=RU'), {
        name: 'Adam',
        countries: ['UK', 'RU'],
    });
    t.deepEqual(userParams.parse('name=Adam&countries[]=UK'), {
        name: 'Adam',
        countries: ['UK'],
    });
});

test('It should be able to handle index list types;', t => {
    const userParams = create(types, { arrayFormat: 'index' });
    t.deepEqual(userParams.parse('name=Adam&countries[0]=UK&countries[1]=RU'), {
        name: 'Adam',
        countries: ['UK', 'RU'],
    });
    t.deepEqual(userParams.parse('name=Adam&countries[0]=UK'), {
        name: 'Adam',
        countries: ['UK'],
    });
});

test('It should be able to handle none list types;', t => {
    const userParams = create(types, { arrayFormat: 'none' });
    t.deepEqual(userParams.parse('name=Adam&countries=UK&countries=RU'), {
        name: 'Adam',
        countries: ['UK', 'RU'],
    });
    t.deepEqual(userParams.parse('name=Adam&countries=UK'), {
        name: 'Adam',
        countries: ['UK'],
    });
});
