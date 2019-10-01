import test from 'ava';
import * as humps from 'humps';
import * as paramo from '../src';

const types = {
    name: paramo.type.String('Adam'),
    age: paramo.type.Int(33),
    telephone: paramo.type.String('1234567890'),
};

test('It should be able to parse into a model of their associated types;', t => {
    const model = paramo.model(types, 'name=Adam&age=33&country=UK');
    t.deepEqual(model, { name: 'Adam', age: 33, country: 'UK' });

    const link = paramo.link(types, { name: 'Adam', age: 33, country: 'UK' });
    t.is(link, '?name=Adam&age=33&country=UK');

    {
        const link = paramo.link(types, {
            name: 'Adam',
            age: null,
            country: null,
        });
        t.is(link, '?name=Adam');
    }
});

test('It should be able to parse into a model including superfluous params;', t => {
    const model = paramo.model(
        types,
        'name=Adam&age=33&country=UK',
        paramo.flag.STRICT,
    );
    t.deepEqual(model, { name: 'Adam', age: 33 });

    const link = paramo.link(types, { name: 'Adam', age: 33 });
    t.is(link, '?name=Adam&age=33');

    {
        // Remove a selection of the params and none of the defaults.
        const link = paramo.link(types, { name: null, age: 33 });
        t.is(link, '?age=33');
    }

    {
        // Remove all of the params and include none of the defaults.
        const link = paramo.link(types, { name: null, age: null });
        t.is(link, '');
    }
});

test('It should be able to parse into a model including default params;', t => {
    const model = paramo.model(
        types,
        'name=Adam&age=33&country=UK',
        paramo.flag.DEFAULTS,
    );
    t.deepEqual(model, { name: 'Adam', age: 33, telephone: '1234567890' });

    const link = paramo.link(types, { name: 'Adam' }, paramo.flag.DEFAULTS);
    t.is(link, '?name=Adam&age=33&telephone=1234567890');

    {
        // Remove the `age` param but also include any defaults.
        const link = paramo.link(
            types,
            { name: 'Adam', age: null },
            paramo.flag.DEFAULTS,
        );
        t.is(link, '?name=Adam&telephone=1234567890');
    }

    {
        // Remove both of the defined params but leave the defaults.
        const link = paramo.link(
            types,
            { name: null, age: null },
            paramo.flag.DEFAULTS,
        );
        t.is(link, '?telephone=1234567890');
    }
});

test.serial(
    'It should be able to setup interceptors to handle the key conversions;',
    t => {
        paramo.interceptor.toModel(humps.camelize);
        paramo.interceptor.toLink(humps.decamelize);

        const types = {
            isDeveloper: paramo.type.Bool(),
        };

        const model = paramo.model(types, 'is_developer=true');
        t.deepEqual(model, { isDeveloper: true });

        const link = paramo.link(types, { isDeveloper: true });
        t.is(link, '?is_developer=true');

        paramo.interceptor.toModel(a => a);
        paramo.interceptor.toLink(a => a);
    },
);
