import test from 'ava';
import moment from 'moment';
import mockDate from 'mockdate';
import { create, type } from '../../src';

const types = {
    name: type.String,
    birthDate: type.Date,
};

test.before(() => {
    mockDate.set('10/10/2019', 1);
});

test.after(() => {
    mockDate.reset();
});

test.beforeEach(() => (moment.suppressDeprecationWarnings = true));

test.afterEach(() => (moment.suppressDeprecationWarnings = true));

test('It should be able to handle Date types;', (t) => {
    const instance = create(types, { dateFormat: 'YYYY-MM-DD' });
    const parsed = instance.parse('name=Adam&birthDate=1985-10-10');
    t.deepEqual(parsed, { name: 'Adam', birthDate: moment('1985-10-10').toDate() });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?birthDate=1985-10-10&name=Adam');
});

test('It should be able to handle Unix S Date types;', (t) => {
    const instance = create({ ...types, birthDate: type.Date.UnixSeconds }, { dateFormat: 'YYYY-MM-DD' });
    const parsed = instance.parse(`name=Adam&birthDate=${moment('1985-10-10').valueOf()}`);
    t.is(parsed.name, 'Adam');
    t.is(moment(parsed.birthDate).format('DD/MM/YYYY'), '10/10/1985');
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?birthDate=1985-10-10&name=Adam');
});

test('It should be able to handle Unix MS Date types;', (t) => {
    const instance = create({ ...types, birthDate: type.Date.UnixMilliseconds }, { dateFormat: 'YYYY-MM-DD' });
    const parsed = instance.parse(`name=Adam&birthDate=${moment('1985-10-10').unix()}`);
    t.is(parsed.name, 'Adam');
    t.is(moment(parsed.birthDate).format('DD/MM/YYYY'), '10/10/1985');
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?birthDate=1985-10-10&name=Adam');
});

test('It should be able to sanitize Dates when the value is invalid;', (t) => {
    const instance = create(types);
    const parsed = instance.parse('name=Adam&birthDate=10th Oct 1985');
    t.deepEqual(parsed, { name: 'Adam' });
    t.is(instance.stringify({ name: 'Adam', birthDate: '10th Oct 1985' }), '?name=Adam');
});

test('It should be able to handle dates with a default value defined as a function;', (t) => {
    const instance = create(
        { ...types, birthDate: [type.Date, () => moment('2020-10-10').toDate()] },
        { dateFormat: 'YYYY-MM-DD', includeDefaults: true },
    );
    const parsed = instance.parse('name=Adam');
    t.deepEqual(parsed, { name: 'Adam', birthDate: moment('2020-10-10').toDate() });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?name=Adam&birthDate=2020-10-10');
});
