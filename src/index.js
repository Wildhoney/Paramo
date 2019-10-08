import * as utils from './utils';
import * as t from './types';

const defaultOptions = {
    includeDefaults: false,
    stripRedundant: true,
    booleanStrings: ['true', 'false'],
    parseInterceptor: a => a,
    stringifyInterceptor: a => a,
};

// arrayFormat: 'bracket',
// includeDefaults: true,
// stripRedundant: true,
// booleanStrings: ['true', 'false'],
// parseInterceptor: humps.decamelize,
// stringifyInterceptor: humps.camelize,

export function create(types, options = defaultOptions) {
    return {
        parse: utils.parse(types, { ...defaultOptions, ...options }),
        stringify: utils.stringify(types, { ...defaultOptions, ...options }),
    };
}

export const type = {
    String: t.String,
    Int: t.Int,
    Bool: t.Bool,
    Array: t.Array,
    Tuple: t.Tuple,
};
