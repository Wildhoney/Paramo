import test from 'ava';
import { create, type, option } from '../src';

test('It should be able to export the required interface;', (t) => {
    t.is(typeof create, 'function');
    t.is(typeof type, 'object');
    t.is(typeof option, 'object');
});
