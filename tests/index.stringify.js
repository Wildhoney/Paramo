import test from 'ava';
import { create, type, option } from '../src';

const types = {
    name: [type.String, 'Adam'],
    age: [type.Int, 33],
    location: [type.String, 'UK'],
};

const options = {};

test('It should be able to handle basic parameters;', t => {
    const userParams = create(types, options);
    t.is(userParams.stringify({ name: 'Adam', age: 33 }), '?name=Adam&age=33');

    {
        const userParams = create(
            { ...types, birthDate: type.Date },
            { ...options, dateFormat: 'yyyy-MM-dd' },
        );
        t.is(
            userParams.stringify({
                name: 'Adam',
                birthDate: new Date(Date.parse('10-10-1985')),
            }),
            '?name=Adam&birthDate=1985-10-10',
        );
    }
});

test('It should be able to handle array parameters;', t => {
    const userParams = create(
        {
            ...types,
            name: type.Array(type.String),
            age: type.Array(type.Int),
            isDeveloper: type.Array(type.Bool),
        },
        { ...options, arrayFormat: option.arrayFormat.comma },
    );

    t.is(
        userParams.stringify({
            name: ['Adam', 'Maria'],
            age: [33, 28],
            isDeveloper: [true, false],
        }),
        '?name=Adam,Maria&age=33,28&isDeveloper=true,false',
    );
});

test('It should be able to handle tuple parameters;', t => {
    const userParams = create(
        {
            ...types,
            person: type.Tuple(type.String, type.Int, type.Bool),
        },
        { ...options, arrayFormat: option.arrayFormat.comma },
    );

    t.is(
        userParams.stringify({
            person: ['Adam', 33, true],
        }),
        '?person=Adam,33,true',
    );
});

test('It should be able to exclude explicit null values from the parameters;', t => {
    const userParams = create(types, options);
    t.is(userParams.stringify({ name: 'Adam', age: null }), '?name=Adam');
});

test('It should be able to handle boolean/custom boolean parameters;', t => {
    const userParams = create({ ...types, isDeveloper: [type.Bool] }, options);

    t.is(
        userParams.stringify({ name: 'Adam', age: 33, isDeveloper: true }),
        '?name=Adam&age=33&isDeveloper=true',
    );
    t.is(
        userParams.stringify({ name: 'Adam', age: 33, isDeveloper: false }),
        '?name=Adam&age=33&isDeveloper=false',
    );

    {
        const userParams = create(
            { ...types, isDeveloper: [type.Bool] },
            { ...options, booleanStrings: ['yup', 'nup'] },
        );
        t.is(
            userParams.stringify({ name: 'Adam', age: 33, isDeveloper: true }),
            '?name=Adam&age=33&isDeveloper=yup',
        );
        t.is(
            userParams.stringify({ name: 'Adam', age: 33, isDeveloper: false }),
            '?name=Adam&age=33&isDeveloper=nup',
        );
    }
});

test('It should be able to handle the transforming of the keys in kebab case;', t => {
    const userParams = create(
        { ...types, isDeveloper: type.Bool },
        { ...options, keyFormat: option.keyFormat.kebab },
    );
    t.is(userParams.stringify({ isDeveloper: true }), '?is-developer=true');
});

test('It should be able to handle the transforming of the keys in snake case;', t => {
    const userParams = create(
        { ...types, isDeveloper: type.Bool },
        { ...options, keyFormat: option.keyFormat.snake },
    );
    t.is(userParams.stringify({ isDeveloper: true }), '?is_developer=true');
});

test('It should be able to handle values that are not represented in the types;', t => {
    const userParams = create(types, options);
    t.is(
        userParams.stringify({ name: 'Adam', country: 'UK' }),
        '?name=Adam&country=UK',
    );

    {
        const userParams = create(types, { ...options, stripRedundant: true });
        t.is(
            userParams.stringify({ name: 'Adam', country: 'UK' }),
            '?name=Adam',
        );
    }
});
