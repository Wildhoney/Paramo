import test from 'ava';
import * as humps from 'humps';
import {
    parse,
    stringify,
    setParser,
    setStringifier,
    type,
    flag,
} from '../src';

const types = {
    name: type.String('Adam'),
    age: type.Int(33),
    telephone: type.String('1234567890'),
};

test('It should be able to parse into a model of their associated types;', t => {
    const model = parse(types, 'name=Adam&age=33&country=UK');
    t.deepEqual(model, { name: 'Adam', age: 33, country: 'UK' });

    const link = stringify(types, { name: 'Adam', age: 33, country: 'UK' });
    t.is(link, '?name=Adam&age=33&country=UK');

    {
        const link = stringify(types, {
            name: 'Adam',
            age: null,
            country: null,
        });
        t.is(link, '?name=Adam');
    }
});

test('It should be able to parse into a model including superfluous params;', t => {
    const model = parse(types, 'name=Adam&age=33&country=UK', flag.STRICT);
    t.deepEqual(model, { name: 'Adam', age: 33 });

    const link = stringify(types, { name: 'Adam', age: 33 });
    t.is(link, '?name=Adam&age=33');

    {
        // Remove a selection of the params and none of the defaults.
        const link = stringify(types, { name: null, age: 33 });
        t.is(link, '?age=33');
    }

    {
        // Remove all of the params and include none of the defaults.
        const link = stringify(types, { name: null, age: null });
        t.is(link, '');
    }
});

test('It should be able to parse into a model including default params;', t => {
    const model = parse(types, 'name=Adam&age=33&country=UK', flag.DEFAULTS);
    t.deepEqual(model, { name: 'Adam', age: 33, telephone: '1234567890' });

    const link = stringify(types, { name: 'Adam' }, flag.DEFAULTS);
    t.is(link, '?name=Adam&age=33&telephone=1234567890');

    {
        // Remove the `age` param but also include any defaults.
        const link = stringify(
            types,
            { name: 'Adam', age: null },
            flag.DEFAULTS,
        );
        t.is(link, '?name=Adam&telephone=1234567890');
    }

    {
        // Remove both of the defined params but leave the defaults.
        const link = stringify(types, { name: null, age: null }, flag.DEFAULTS);
        t.is(link, '?telephone=1234567890');
    }
});

test.serial(
    'It should be able to setup interceptors to handle the key conversions;',
    t => {
        setParser(humps.camelize);
        setStringifier(humps.decamelize);

        const types = {
            isDeveloper: type.Bool(),
        };

        const model = parse(types, 'is_developer=true');
        t.deepEqual(model, { isDeveloper: true });

        const link = stringify(types, { isDeveloper: true });
        t.is(link, '?is_developer=true');

        setParser(a => a);
        setStringifier(a => a);
    },
);
