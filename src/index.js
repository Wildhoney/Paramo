import parse from './parse';
import stringify from './stringify';

export function create(types, options = defaultOptions) {
    return {
        parse: parse(types, { ...defaultOptions, ...options }),
        stringify: stringify(types, { ...defaultOptions, ...options }),
    };
}

const defaultOptions = {
    arrayFormat: null,
    includeDefaults: false,
    stripDefaults: false,
    stripRedundant: false,
    booleanStrings: ['true', 'false'],
    dateFormat: 'YYYY-MM-DD',
    keyFormat: null,
    pascaliseKeys: false,
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

export { default as Type } from './types/Custom';

export * as type from './types';
