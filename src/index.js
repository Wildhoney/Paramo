import parse from './parse';
import stringify from './stringify';

export function create(types, options = defaultOptions) {
    return {
        parse: parse(types, { ...defaultOptions, ...options }),
        stringify: stringify(types, { ...defaultOptions, ...options }),
    };
}

const defaultOptions = {
    includeDefaults: false,
    stripDefaults: false,
    arrayFormat: null,
    arrayFormatSeparator: ',',
    stripPrefix: false,
    stripRedundant: false,
    booleanStrings: ['true', 'false'],
    dateFormat: 'YYYY-MM-DD',
    keyFormat: null,
    splitKeys: null,
    processKeys: null,
    encodeParams: true,
    decodeParams: true,
    sortParams: false,
    plainObject: false,
};

export const option = {
    arrayFormat: {
        bracket: Symbol('bracket'),
        separator: Symbol('separator'),
        index: Symbol('index'),
        comma: Symbol('comma'),
        none: Symbol('none'),
    },
    keyFormat: {
        snake: Symbol('_'),
        kebab: Symbol('-'),
        pascal: Symbol('pascal'),
    },
};

export { default as Type } from './types/Custom';

export * as type from './types';
