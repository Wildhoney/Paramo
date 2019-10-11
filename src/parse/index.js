import qs from 'query-string';
import * as utils from '../utils';

export default function parse(types, options) {
    const keyFormat = utils.getKeyFormat(options);
    const arrayFormat = utils.getArrayFormat(options);

    return (params = utils.getDefaultParams()) => {
        const parsedParams = keyFormat.camelize(qs.parse(params, { arrayFormat }));

        // Including defaults should take from both the types and the parameters.
        const keys = options.includeDefaults ? Object.keys({ ...types, ...parsedParams }) : Object.keys(parsedParams);

        return keys.reduce((model, key) => {
            const type = types[key];
            const value = parsedParams[key];

            if (!type)
                // Determine whether to include redundant types, as the current value
                // has not been found
                return options.stripRedundant ? model : { ...model, [key]: value };

            // Parse the type into its type, unless it is a null value in which case
            // we'll use the default value.
            const { toType, defaultValue } = utils.getType(type, options);

            try {
                const parsedValue = value != null ? toType(value) : defaultValue;
                return { ...model, [key]: parsedValue };
            } catch (error) {
                if (error instanceof utils.TypeError) return model;
                throw error;
            }
        }, {});
    };
}