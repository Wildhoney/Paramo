import test from 'ava';
import { type, option } from '../src';
import * as utils from '../src/utils';

test('It should be able to determine if the search params can be read;', t => {
    global.location = {
        search: '?name=Adam&age=34',
    };
    t.is(utils.getDefaultParams(), '?name=Adam&age=34');
    delete global.location;
    t.is(utils.getDefaultParams(), null);
});

test('It should be able to handle the yielding of the type functions;', t => {
    const int = utils.getType(type.Int);
    t.is(int.defaultValue, null);
    t.is(typeof int.toType, 'function');
    t.is(typeof int.toString, 'function');
    t.is(typeof int.isSame, 'function');
});

test('It should be able to handle the handle yielding default values;', t => {
    const string = utils.getType([type.String, 'Adam']);
    t.is(string.defaultValue, 'Adam');
});

test('It should be able to determine when strings are equal;', t => {
    const string = utils.getType(type.String);
    t.true(string.isSame('Adam', 'Adam'));
    t.false(string.isSame('Adam', 'Maria'));
});

test('It should be able to determine when ints are equal;', t => {
    const int = utils.getType(type.Int);
    t.true(int.isSame(1, 1));
    t.false(int.isSame(1, 2));
});

test('It should be able to determine when arrays are equal;', t => {
    const bool = utils.getType(type.Array(type.Int));
    t.true(bool.isSame([1, 2, 3], [1, 2, 3]));
    t.true(bool.isSame([1, 2, 3], [3, 2, 1]));
    t.false(bool.isSame([1, 2, 3], [3, 2, 1, 4]));
});

test('It should be able to determine when sequenced arrays are equal;', t => {
    const bool = utils.getType(type.Array.Sequence(type.Int));
    t.true(bool.isSame([1, 2, 3], [1, 2, 3]));
    t.false(bool.isSame([1, 2, 3], [3, 2, 1]));
    t.false(bool.isSame([1, 2, 3], [3, 2, 1, 4]));
});

test('It should be able to decamelize objects based on the key format;', t => {
    const defaultTransform = utils.getKeyFormat({ keyFormat: null });
    t.deepEqual(defaultTransform.decamelize({ birthDate: '1985-10-10' }), { birthDate: '1985-10-10' });
    const kebabTransform = utils.getKeyFormat({ keyFormat: option.keyFormat.kebab });
    t.deepEqual(kebabTransform.decamelize({ birthDate: '1985-10-10' }), { 'birth-date': '1985-10-10' });
    const snakeTransform = utils.getKeyFormat({ keyFormat: option.keyFormat.snake });
    t.deepEqual(snakeTransform.decamelize({ birthDate: '1985-10-10' }), { birth_date: '1985-10-10' });
});

test('It should be able to camelize objects based on the key format;', t => {
    const defaultTransform = utils.getKeyFormat({ keyFormat: null });
    t.deepEqual(defaultTransform.camelize({ birthDate: '1985-10-10' }), { birthDate: '1985-10-10' });
    const kebabTransform = utils.getKeyFormat({ keyFormat: option.keyFormat.kebab });
    t.deepEqual(kebabTransform.camelize({ 'birth-date': '1985-10-10' }), { birthDate: '1985-10-10' });
    const snakeTransform = utils.getKeyFormat({ keyFormat: option.keyFormat.snake });
    t.deepEqual(snakeTransform.camelize({ birth_date: '1985-10-10' }), { birthDate: '1985-10-10' });
});

test("It should be able to obtain the array format from the Symbol's description;", t => {
    t.is(utils.getArrayFormat({ arrayFormat: option.arrayFormat.index }), 'index');
    t.is(utils.getArrayFormat({ arrayFormat: option.arrayFormat.bracket }), 'bracket');
    t.is(utils.getArrayFormat({ arrayFormat: option.arrayFormat.comma }), 'comma');
    t.is(utils.getArrayFormat({ arrayFormat: option.arrayFormat.none }), 'none');
});
