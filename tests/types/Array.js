import test from 'ava';
import { create, type, option } from '../../src';

const types = {
    name: type.String,
    countries: [type.Array(type.String), ['UK', 'RU']],
};

test('It should be able to handle comma separated arrays;', (t) => {
    const instance = create(types, {
        arrayFormat: option.arrayFormat.comma,
    });
    const parsed = instance.parse('name=Adam&countries=UK,RU');
    t.deepEqual(parsed, { name: 'Adam', countries: ['UK', 'RU'] });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?countries=UK,RU&name=Adam');
});

test('It should be able to omit the array item if it is empty;', (t) => {
    const instance = create(types, {
        arrayFormat: option.arrayFormat.comma,
    });
    const stringified = instance.stringify({ name: 'Adam', countries: [] });
    t.is(stringified, '?name=Adam');
    {
        const stringified = instance.stringify({ countries: [] });
        t.is(stringified, '');
    }
});

test('It should be able to handle comma separated arrays with a single value;', (t) => {
    const instance = create(types, {
        arrayFormat: option.arrayFormat.comma,
    });
    const parsed = instance.parse('name=Adam&countries=UK');
    t.deepEqual(parsed, { name: 'Adam', countries: ['UK'] });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?countries=UK&name=Adam');
});

test('It should be able to handle indexed arrays;', (t) => {
    const instance = create(types, {
        arrayFormat: option.arrayFormat.index,
    });
    const parsed = instance.parse('name=Adam&countries[0]=UK&countries[1]=RU');
    t.deepEqual(parsed, { name: 'Adam', countries: ['UK', 'RU'] });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?countries[0]=UK&countries[1]=RU&name=Adam');
});

test('It should be able to handle bracketed arrays;', (t) => {
    const instance = create(types, {
        arrayFormat: option.arrayFormat.bracket,
    });
    const parsed = instance.parse('name=Adam&countries[]=UK&countries[]=RU');
    t.deepEqual(parsed, { name: 'Adam', countries: ['UK', 'RU'] });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?countries[]=UK&countries[]=RU&name=Adam');
});

test('It should be able to handle duplicate key arrays;', (t) => {
    const instance = create(types, {
        arrayFormat: option.arrayFormat.none,
    });
    const parsed = instance.parse('name=Adam&countries=UK&countries=RU');
    t.deepEqual(parsed, { name: 'Adam', countries: ['UK', 'RU'] });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?countries=UK&countries=RU&name=Adam');
});

test('It should be able to handle duplicate key arrays with a single value;', (t) => {
    const instance = create(types, {
        arrayFormat: option.arrayFormat.none,
    });
    const parsed = instance.parse('name=Adam&countries=RU');
    t.deepEqual(parsed, { name: 'Adam', countries: ['RU'] });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?countries=RU&name=Adam');
});

test('It should be able to handle the skipping of the defaults;', (t) => {
    const instance = create(types, {
        arrayFormat: option.arrayFormat.comma,
        stripDefaults: true,
    });
    t.is(instance.stringify({ name: 'Adam', countries: ['UK', 'RU'] }), '?name=Adam');
    t.is(instance.stringify({ name: 'Adam', countries: ['UK'] }), '?name=Adam&countries=UK');
    t.is(instance.stringify({ name: 'Adam', countries: ['RU', 'UK'] }), '?name=Adam');
});

test('It should be able to handle the skipping of the defaults for sequences;', (t) => {
    const instance = create(
        { ...types, countries: [type.Array.Sequence(type.String), ['UK', 'RU']] },
        {
            arrayFormat: option.arrayFormat.comma,
            stripDefaults: true,
        },
    );
    t.is(instance.stringify({ name: 'Adam', countries: ['UK', 'RU'] }), '?name=Adam');
    t.is(instance.stringify({ name: 'Adam', countries: ['UK'] }), '?name=Adam&countries=UK');
    t.is(instance.stringify({ name: 'Adam', countries: ['RU', 'UK'] }), '?name=Adam&countries=RU,UK');
});

test('It should be able to sanitize arrays when its values are invalid;', (t) => {
    const instance = create({ ...types, countries: type.Array(type.Int) }, { arrayFormat: option.arrayFormat.comma });
    const parsed = instance.parse('name=Adam&countries=UK,RU');
    t.deepEqual(parsed, { name: 'Adam' });
    t.is(instance.stringify({ name: 'Adam', countries: 'UK' }), '?name=Adam');
});

test('It should be able to default to an empty array instead of null when not specified;', (t) => {
    const instance = create(
        { ...types, countries: type.Array(type.String) },
        {
            arrayFormat: option.arrayFormat.comma,
            includeDefaults: true,
        },
    );
    const parsed = instance.parse('name=Adam');
    t.deepEqual(parsed, { name: 'Adam', countries: [] });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?name=Adam');
});

test('It should be able to handle the defaults;', (t) => {
    const types = { name: type.String, ratings: [type.Array(type.Int), [1, 2, 3]] };

    const instance = create(types, {
        stripDefaults: false,
        includeDefaults: true,
        keyFormat: option.keyFormat.kebab,
    });
    const stringified = instance.stringify({
        name: 'Adam',
    });

    t.is(stringified, '?name=Adam&ratings=1&ratings=2&ratings=3');

    {
        const instance = create(types, {
            stripDefaults: true,
            includeDefaults: true,
            keyFormat: option.keyFormat.kebab,
        });
        const stringified = instance.stringify({
            name: 'Adam',
        });

        t.is(stringified, '?name=Adam');
    }
});

test('It should be able to handle custom separated arrays with a single value;', (t) => {
    const instance = create(types, {
        arrayFormat: option.arrayFormat.separator,
        arrayFormatSeparator: '|',
    });
    const parsed = instance.parse('name=Adam&countries=UK');
    t.deepEqual(parsed, { name: 'Adam', countries: ['UK'] });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?countries=UK&name=Adam');
});

test('It should be able to handle custom separated arrays with multiple values;', (t) => {
    const instance = create(types, {
        arrayFormat: option.arrayFormat.separator,
        arrayFormatSeparator: '|',
    });
    const parsed = instance.parse('name=Adam&countries=UK|RU|NZ');
    t.deepEqual(parsed, { name: 'Adam', countries: ['UK', 'RU', 'NZ'] });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?countries=UK|RU|NZ&name=Adam');
});

test('It should be able to handle an array with defaults;', (t) => {
    const types = {
        ids: [type.Array(type.Int), [1, 2]],
    };
    const instance = create(types, {
        stripDefaults: true,
        keyFormat: option.keyFormat.snake,
        arrayFormat: option.arrayFormat.comma,
        splitKeys: /(?=[A-Z0-9])/,
    });

    const parsed = instance.parse('ids=1,2,3');
    t.deepEqual(parsed, { ids: [1, 2, 3] });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?ids=1,2,3');
});
