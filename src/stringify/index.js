import qs from 'query-string';
import * as utils from '../utils';

export default function stringify(types, options) {
    const keyFormat = utils.getKeyFormat(options);
    const arrayFormat = utils.getArrayFormat(options);

    return params => {
        const keys = options.includeDefaults ? Object.keys({ ...params, ...types }) : Object.keys(params);

        const parsedParams = keys.reduce((model, key) => {
            const type = types[key];
            const value = params[key];

            if (!type)
                // Determine whether to include redundant types, as the current value
                // has not been found
                return options.stripRedundant ? model : { ...model, [key]: value };

            // Parse the type into its type, unless it is a null value in which case
            // we'll use the default value.
            const { toString, defaultValue, isSame } = utils.getType(type, options);

            // Check whether we should be ignoring types that are the default values.
            if (options.stripDefaults && isSame(defaultValue, value)) return model;

            const parsedValue = value != null ? toString(value) : options.includeDefaults ? defaultValue : null;

            // Omit null values in the links.
            if (value === null || parsedValue == null) return model;

            return { ...model, [key]: parsedValue };
        }, {});

        const isEmpty = Object.keys(parsedParams).length === 0;

        return isEmpty
            ? ''
            : `?${qs.stringify(keyFormat.decamelize(parsedParams), {
                  sort: false,
                  arrayFormat,
              })}`;
    };
}