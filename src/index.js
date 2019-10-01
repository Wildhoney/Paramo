import * as utils from './utils';

const interceptors = new Map(Object.entries({ model: a => a, link: a => a }));

export function model(types, link = utils.getDefaultLink(), flags = flag.BASE) {
    const search = new URLSearchParams(link);

    const toModel = interceptors.get('model');
    const toLink = interceptors.get('link');

    const isStrict = Boolean(flags & flag.STRICT);
    const hasDefaults = Boolean(flags & flag.DEFAULTS);

    // Whether to include default values if they're not present in the URL
    // params.
    const keys = hasDefaults
        ? Object.keys(types)
        : [...search.keys()].map(toModel);

    return keys.reduce((accum, key) => {
        const type = types[key];
        const value = search.get(toLink(key));

        // In strict mode only the types that have been defined will be included in
        // the yielded model.
        if (!type) return isStrict ? accum : { ...accum, [key]: value };

        const typedValue = value != null ? type.asType(value) : type.def;
        return { ...accum, [key]: typedValue };
    }, {});
}

export function link(types, model, flags = flag.BASE) {
    const search = new URLSearchParams();

    const toLink = interceptors.get('link');

    const isStrict = Boolean(flags & flag.STRICT);
    const hasDefaults = Boolean(flags & flag.DEFAULTS);

    const keys = hasDefaults
        ? Object.keys({ ...model, ...types })
        : Object.keys(model);

    keys.forEach(key => {
        const type = types[key];
        const value = model[key];

        // In strict mode only the types that have been defined will be included in
        // the yielded model.
        if (!type)
            return isStrict
                ? null
                : void (value != null && search.set(toLink(key), value));

        const typedValue = value != null ? type.asStr(value) : type.def;

        // Omit null values in the links.
        if (value === null || typedValue == null) return;

        search.set(toLink(key), typedValue);
    });

    const isEmpty = [...search.keys()].length === 0;
    return isEmpty ? '' : `?${search.toString()}`;
}

export const interceptor = {
    toModel: fn => interceptors.set('model', fn),
    toLink: fn => interceptors.set('link', fn),
};

export const flag = {
    BASE: 0,
    STRICT: 1,
    DEFAULTS: 2,
};

export const type = {
    String: (def = null) => ({
        def,
        asType: String,
        asStr: String,
    }),
    Int: (def = null) => ({
        def,
        asType: Number,
        asStr: String,
    }),
    Bool: (def = null) => ({
        def,
        asType: value => ['1', 'yes', 'true'].includes(value),
        asStr: value => (value === true ? 'true' : 'false'),
    }),
};
