import * as utils from './utils';

export function create(types, options = defaultOptions) {
    return {
        parse: utils.parse(types, { ...defaultOptions, ...options }),
        stringify: utils.stringify(types, { ...defaultOptions, ...options }),
    };
}

const defaultOptions = {
    arrayFormat: null,
    includeDefaults: false,
    stripRedundant: true,
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
