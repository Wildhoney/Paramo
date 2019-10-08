import qs from 'query-string';

function getDefaultParams() {
    const locationAvailable = typeof global.location === 'undefined';
    return locationAvailable ? global.location.search : null;
}

function getType(type, options) {
    const [typer, defaultValue = null] = [].concat(type);
    const toType = typer.toType(options);
    const toString = typer.toString(options);

    return { toType, toString, defaultValue };
}

export function parse(types, { arrayFormat, ...options }) {
    return (params = getDefaultParams()) => {
        const parsedParams = qs.parse(params, { arrayFormat });

        // Including defaults should take from both the types and the parameters.
        const keys = options.includeDefaults
            ? Object.keys({ ...types, ...parsedParams })
            : Object.keys(parsedParams);

        return keys.reduce((model, key) => {
            const type = types[key];
            const value = parsedParams[key];

            if (!type)
                // Determine whether to include redundant types, as the current value
                // has not been found
                return options.stripRedundant
                    ? model
                    : { ...model, [key]: value };

            // Parse the type into its type, unless it is a null value in which case
            // we'll use the default value.
            const { toType, defaultValue } = getType(type, options);

            try {
                const parsedValue =
                    value != null ? toType(value) : defaultValue;
                return { ...model, [key]: parsedValue };
            } catch {
                return model;
            }
        }, {});
    };
}

export function stringify(types, { arrayFormat, ...options }) {
    return params => {
        const keys = options.includeDefaults
            ? Object.keys({ ...params, ...types })
            : Object.keys(params);

        const parsedParams = keys.reduce((model, key) => {
            const type = types[key];
            const value = params[key];

            // Parse the type into its type, unless it is a null value in which case
            // we'll use the default value.
            const { toString, defaultValue } = getType(type, options);
            const parsedValue =
                value != null
                    ? toString(value)
                    : options.includeDefaults
                    ? defaultValue
                    : null;

            // Omit null values in the links.
            if (value == null || parsedValue == null) return model;

            return { ...model, [key]: parsedValue };
        }, {});

        const isEmpty = Object.keys(parsedParams).length === 0;
        return isEmpty
            ? ''
            : `?${qs.stringify(parsedParams, { sort: false, arrayFormat })}`;
    };
}
