import test from 'ava';
import moment from 'moment';
import { create, type } from '../../src';

const types = {
    name: type.String,
    birthDate: type.Date,
};

test.beforeEach(() => (moment.suppressDeprecationWarnings = true));
test.afterEach(() => (moment.suppressDeprecationWarnings = true));

test('It should be able to handle Date types;', t => {
    const instance = create(types, { dateFormat: 'YYYY-MM-DD' });
    const parsed = instance.parse('name=Adam&birthDate=1985-10-10');
    t.deepEqual(parsed, { name: 'Adam', birthDate: moment('1985-10-10').toDate() });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?birthDate=1985-10-10&name=Adam');
});

test('It should be able to handle Unix S Date types;', t => {
    const instance = create({ ...types, birthDate: type.Date.UnixSeconds }, { dateFormat: 'YYYY-MM-DD' });
    const parsed = instance.parse('name=Adam&birthDate=497746800000');
    t.deepEqual(parsed, { name: 'Adam', birthDate: moment('1985-10-10').toDate() });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?birthDate=1985-10-10&name=Adam');
});

test('It should be able to handle Unix MS Date types;', t => {
    const instance = create({ ...types, birthDate: type.Date.UnixMilliseconds }, { dateFormat: 'YYYY-MM-DD' });
    const parsed = instance.parse('name=Adam&birthDate=497746800');
    t.deepEqual(parsed, { name: 'Adam', birthDate: moment('1985-10-10').toDate() });
    const stringified = instance.stringify(parsed);
    t.is(stringified, '?birthDate=1985-10-10&name=Adam');
});

test('It should be able to sanitize Dates when the value is invalid;', t => {
    const instance = create(types);
    const parsed = instance.parse('name=Adam&birthDate=10th Oct 1985');
    t.deepEqual(parsed, { name: 'Adam' });
    t.is(instance.stringify({ name: 'Adam', birthDate: '10th Oct 1985' }), '?name=Adam');
});
