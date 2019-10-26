import test from 'ava';
import moment from 'moment';
import { create, type, option } from '../../src';

test('It should be able to stringify the parameters from a simple model;', t => {
    const types = {
        name: type.String,
        age: type.Int,
        isDeveloper: type.Bool,
    };
    const instance = create(types);
    t.is(instance.stringify({ name: 'Adam', age: 34, isDeveloper: true }), '?name=Adam&age=34&isDeveloper=true');
});

test('It should yield an empty string if there are not stringified parameters;', t => {
    const types = {
        name: type.String,
        age: type.Int,
    };
    const instance = create(types);
    t.is(instance.stringify({ name: null, age: null }), '');
});

test('It should be able to handle the stripping of default parameters;', t => {
    const types = {
        name: type.String,
        age: type.Int,
        isDeveloper: [type.Bool, true],
    };
    const instance = create(types, { stripDefaults: true });
    t.is(instance.stringify({ name: 'Adam', age: 34, isDeveloper: true }), '?name=Adam&age=34');
    {
        const instance = create(types);
        t.is(instance.stringify({ name: 'Adam', age: 34, isDeveloper: false }), '?name=Adam&age=34&isDeveloper=false');
    }
});

test('It should be able to handle the stripping of default parameters for arrays;', t => {
    const types = {
        name: type.String,
        countries: [type.Array(type.String), ['UK', 'RU']],
    };
    const instance = create(types, { arrayFormat: option.arrayFormat.comma, stripDefaults: true });
    t.is(instance.stringify({ name: 'Adam', countries: ['UK'] }), '?name=Adam&countries=UK');
    {
        const instance = create(types, {
            arrayFormat: option.arrayFormat.comma,
            stripDefaults: true,
        });
        t.is(instance.stringify({ name: 'Adam', countries: ['UK', 'RU'] }), '?name=Adam');
    }
    {
        const instance = create(types, {
            arrayFormat: option.arrayFormat.comma,
            stripDefaults: true,
        });
        t.is(instance.stringify({ name: 'Adam', countries: ['RU', 'UK'] }), '?name=Adam');
    }
});

test('It should be able to handle the stripping of default parameters for sequenced arrays;', t => {
    const types = {
        name: type.String,
        countries: [type.Array.Sequence(type.String), ['UK', 'RU']],
    };
    const instance = create(types, { arrayFormat: option.arrayFormat.comma, stripDefaults: true });
    t.is(instance.stringify({ name: 'Adam', countries: ['UK'] }), '?name=Adam&countries=UK');
    {
        const instance = create(types, {
            arrayFormat: option.arrayFormat.comma,
            stripDefaults: true,
        });
        t.is(instance.stringify({ name: 'Adam', countries: ['UK', 'RU'] }), '?name=Adam');
    }
    {
        const instance = create(types, {
            arrayFormat: option.arrayFormat.comma,
            stripDefaults: true,
        });
        t.is(instance.stringify({ name: 'Adam', countries: ['RU', 'UK'] }), '?name=Adam&countries=RU,UK');
    }
});

test('It should be able to handle the stripping of default parameters for tuples;', t => {
    const types = {
        name: type.String,
        profile: [type.Tuple(type.String, type.Int), ['Software Developer', 34]],
    };
    const instance = create(types, { arrayFormat: option.arrayFormat.comma, stripDefaults: true });
    t.is(
        instance.stringify({ name: 'Adam', profile: ['Software Developer', 33] }),
        '?name=Adam&profile=Software%20Developer,33',
    );
    {
        const instance = create(types, {
            arrayFormat: option.arrayFormat.comma,
            stripDefaults: true,
        });
        t.is(instance.stringify({ name: 'Adam', profile: ['Software Developer', 34] }), '?name=Adam');
    }
});

test('It should be able to handle the inclusion of the default parameters;', t => {
    const types = {
        name: type.String,
        age: type.Int,
        city: [type.String, 'London'],
    };

    const instance = create(types);
    t.is(instance.stringify({ name: 'Adam', age: 34 }), '?name=Adam&age=34');
    {
        const instance = create(types, { includeDefaults: true });
        t.is(instance.stringify({ name: 'Adam', age: 34 }), '?name=Adam&age=34&city=London');
    }
    {
        const instance = create(types, { includeDefaults: true });
        t.is(instance.stringify({ name: 'Adam', age: 34, city: null }), '?name=Adam&age=34');
    }
});

test('It should be able to specify the removal of parameters by passing null values;', t => {
    const types = {
        name: type.String,
        age: type.Int,
        city: [type.String, 'London'],
    };

    const instance = create(types);
    t.is(instance.stringify({ name: null, age: 34, city: null }), '?age=34');
});

test('It should be able to handle the removal of redundant URL parameters;', t => {
    const types = {
        name: type.String,
        age: type.Int,
    };
    const instance = create(types);
    t.is(instance.stringify({ name: 'Adam', age: 34, location: 'UK' }), '?name=Adam&age=34&location=UK');
    {
        const instance = create(types, { stripRedundant: true });
        t.is(instance.stringify({ name: 'Adam', age: 34, location: 'UK' }), '?name=Adam&age=34');
    }
});

test('It should be able to handle URL parameters in a different format;', t => {
    const types = {
        name: type.String,
        dateOfBirth: type.Date,
    };
    const instance = create(types, { keyFormat: option.keyFormat.kebab });
    t.is(
        instance.stringify({ name: 'Adam', dateOfBirth: moment('1985-10-10').toDate() }),
        '?name=Adam&date-of-birth=1985-10-10',
    );
    {
        const instance = create(types, { keyFormat: option.keyFormat.snake });
        t.is(
            instance.stringify({ name: 'Adam', dateOfBirth: moment('1985-10-10').toDate() }),
            '?name=Adam&date_of_birth=1985-10-10',
        );
    }
});

test('It should be able to return the typed default value if the value is invalid;', t => {
    const types = {
        name: type.String,
        age: [type.Int, 34],
        isDeveloper: [type.Bool, true],
    };
    const instance = create(types, { includeDefaults: true, booleanStrings: ['yup', 'nup'] });
    t.is(
        instance.stringify({ name: 'Adam', age: 'ThirtyFour', isDeveloper: 'yes' }),
        '?name=Adam&age=34&isDeveloper=yup',
    );
    t.is(instance.stringify({ name: 'Adam', age: null, isDeveloper: 'yes' }), '?name=Adam&isDeveloper=yup');
    t.is(instance.stringify({ name: 'Adam', isDeveloper: 'yes' }), '?name=Adam&isDeveloper=yup&age=34');
});

test('It should be able to handle the stringifying when the values are arrays;', t => {
    const instance = create({
        countries: [type.Array(type.String), []],
    });
    t.is(instance.stringify({}), '');
    t.is(instance.stringify({ countries: [] }), '');
});

test('It should be able to pass the domain for auto joining the parameters to it;', t => {
    const instance = create(
        {
            name: type.String,
            age: type.Int,
        },
        { domain: 'https://www.example.org/' },
    );
    t.is(instance.stringify({ name: 'Adam', age: 33 }), 'https://www.example.org?name=Adam&age=33');
    t.is(instance.stringify({}), 'https://www.example.org');
});
