import test from 'ava';
import { create, type } from '../src';

const types = {
    name: [type.String, 'Adam'],
    age: [type.Int, 33],
    location: [type.String, 'UK'],
};

const options = {};

test('It should be able to handle basic parameters;', t => {
    const userParams = create(types, options);
    t.deepEqual(userParams.parse('name=Adam&age=33'), {
        name: 'Adam',
        age: 33,
    });
});

test('It should be able to handle array parameters;', t => {
    const userParams = create(
        {
            ...types,
            name: type.Array(type.String),
            age: type.Array(type.Int),
            isDeveloper: type.Array(type.Bool),
        },
        { ...options, arrayFormat: 'comma' },
    );

    t.deepEqual(
        userParams.parse('name=Adam,Maria&age=33,28&isDeveloper=true,false'),
        {
            name: ['Adam', 'Maria'],
            age: [33, 28],
            isDeveloper: [true, false],
        },
    );
});

test('It should be able to handle tuple parameters;', t => {
    const userParams = create(
        {
            ...types,
            person: type.Tuple(type.String, type.Int, type.Bool),
        },
        { ...options, arrayFormat: 'comma' },
    );

    t.deepEqual(userParams.parse('person=Adam,33,true'), {
        person: ['Adam', 33, true],
    });
});

test('It should be able to handle boolean/custom boolean parameters;', t => {
    const userParams = create({ ...types, isDeveloper: [type.Bool] }, options);

    t.deepEqual(userParams.parse('name=Adam&isDeveloper=true'), {
        name: 'Adam',
        isDeveloper: true,
    });
    t.deepEqual(userParams.parse('name=Adam&isDeveloper=false'), {
        name: 'Adam',
        isDeveloper: false,
    });

    {
        const userParams = create(
            { ...types, isDeveloper: [type.Bool] },
            { ...options, booleanStrings: ['yup', 'nup'] },
        );
        t.deepEqual(userParams.parse('name=Adam&isDeveloper=yup'), {
            name: 'Adam',
            isDeveloper: true,
        });
        t.deepEqual(userParams.parse('name=Adam&isDeveloper=nup'), {
            name: 'Adam',
            isDeveloper: false,
        });
    }
});

test('It should be able to include/exclude unknown parameters;', t => {
    const userParams = create(types, { ...options, stripRedundant: false });
    t.deepEqual(userParams.parse('name=Adam&age=33&country=UK'), {
        name: 'Adam',
        age: 33,
        country: 'UK',
    });

    {
        const userParams = create(types, { ...options, stripRedundant: true });
        t.deepEqual(userParams.parse('name=Adam&age=33&country=UK'), {
            name: 'Adam',
            age: 33,
        });
    }
});

test('It should be able to include/exclude default parameters;', t => {
    const userParams = create(types, { ...options, includeDefaults: false });
    t.deepEqual(userParams.parse('name=Adam&age=33'), {
        name: 'Adam',
        age: 33,
    });

    {
        const userParams = create(types, { ...options, includeDefaults: true });
        t.deepEqual(userParams.parse('name=Adam&age=33'), {
            name: 'Adam',
            age: 33,
            location: 'UK',
        });
    }
});
