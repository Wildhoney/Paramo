import test from 'ava';
import moment from 'moment';
import { create, type, option } from '../../src';

test('It should be able to parse the parameters from a simple URL string;', t => {
    const types = {
        name: type.String,
        age: type.Int,
        isDeveloper: type.Bool,
    };
    const instance = create(types);
    t.deepEqual(instance.parse('name=Adam&age=34&isDeveloper=true'), {
        name: 'Adam',
        age: 34,
        isDeveloper: true,
    });
});

test("It should be able to re-throw the error if it isn't related to types;", t => {
    const types = {
        name: () => {},
    };
    const instance = create(types);
    t.throws(() => instance.parse('name=Adam'), 'typer.toType is not a function');
});

test('It should be able to handle the inclusion of the default parameters;', t => {
    const types = {
        name: type.String,
        age: type.Int,
        city: [type.String, 'London'],
    };
    const instance = create(types, { includeDefaults: true });
    t.deepEqual(instance.parse('name=Adam'), {
        name: 'Adam',
        age: null,
        city: 'London',
    });
    t.deepEqual(instance.parse('name=Adam&age=34'), {
        name: 'Adam',
        age: 34,
        city: 'London',
    });
});

test('It should be able to handle the removal of redundant URL parameters;', t => {
    const types = {
        name: type.String,
        age: type.Int,
    };
    const instance = create(types);
    t.deepEqual(instance.parse('name=Adam&age=34&location=UK'), {
        name: 'Adam',
        age: 34,
        location: 'UK',
    });
    {
        const instance = create(types, { stripRedundant: true });
        t.deepEqual(instance.parse('name=Adam&age=34&location=UK'), {
            name: 'Adam',
            age: 34,
        });
    }
});

test('It should be able to handle URL parameters in a different format;', t => {
    const types = {
        name: type.String,
        dateOfBirth: type.Date,
    };
    const instance = create(types, { keyFormat: option.keyFormat.kebab });
    t.deepEqual(instance.parse('name=Adam&date-of-birth=1985-10-10'), {
        name: 'Adam',
        dateOfBirth: moment('1985-10-10').toDate(),
    });
    {
        const instance = create(types, { keyFormat: option.keyFormat.snake });
        t.deepEqual(instance.parse('name=Adam&date_of_birth=1985-10-10'), {
            name: 'Adam',
            dateOfBirth: moment('1985-10-10').toDate(),
        });
    }
});
