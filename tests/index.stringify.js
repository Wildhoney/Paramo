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
    t.is(userParams.stringify({ name: 'Adam', age: 33 }), '?name=Adam&age=33');
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
