import * as utils from './utils';

// @TODO:
// - Test ignore defaults when using lists.
// - Allow list to ignore order when comparing defaults.

export function create(types, options = defaultOptions) {
    return {
        parse: utils.parse(types, { ...defaultOptions, ...options }),
        stringify: utils.stringify(types, { ...defaultOptions, ...options }),
    };
}

const defaultOptions = {
    arrayFormat: null,
    includeDefaults: false,
    stripRedundant: false,
    booleanStrings: ['true', 'false'],
    dateFormat: 'YYYY-MM-DD',
    keyFormat: null,
};

export const option = {
    arrayFormat: {
        bracket: Symbol('bracket'),
        index: Symbol('index'),
        comma: Symbol('comma'),
        none: Symbol('none'),
    },
    keyFormat: {
        snake: Symbol('_'),
        kebab: Symbol('-'),
    },
};

export * as type from './types';
