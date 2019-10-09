export default {
    toType: ({ booleanStrings: [truthy, falsy] }) => value => {
        const typedValue = (() => {
            switch (value) {
                case '1':
                case 'yes':
                case 'true':
                case truthy:
                    return true;
                case '0':
                case 'no':
                case 'false':
                case falsy:
                    return false;
            }
        })();
        if (typeof typedValue !== 'boolean')
            throw new Error('Invalid type.Bool');
        return typedValue;
    },
    toString: ({ booleanStrings: [truthy, falsy] }) => value =>
        value === true ? truthy : falsy,
};
