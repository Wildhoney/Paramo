import * as utils from './utils';

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
    String: {
        toType: () => String,
        toString: () => String,
    },
    Int: {
        toType: () => Number,
        toString: () => String,
    },
    Bool: {
        toType: ({ booleanStrings }) => value =>
            ['1', 'yes', 'true', booleanStrings[0]].includes(value),
        toString: ({ booleanStrings }) => value =>
            value === true ? booleanStrings[0] : booleanStrings[1],
    },
    Array: type => ({
        toType: options => values =>
            values.map(value => type.toType(options)(value)),
        toString: options => values =>
            values.map(value => type.toString(options)(value)),
    }),
    Tuple: (...types) => ({
        toType: options => values =>
            values.map((value, index) => types[index].toType(options)(value)),
        toString: options => values =>
            values.map((value, index) => types[index].toString(options)(value)),
    }),
};
