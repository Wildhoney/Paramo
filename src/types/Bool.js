export default {
    toType: ({ booleanStrings }) => value => {
        const type = (() => {
            switch (value) {
                case '1':
                case 'yes':
                case 'true':
                case booleanStrings[0]:
                    return true;
                case '0':
                case 'no':
                case 'false':
                case booleanStrings[1]:
                    return false;
            }
        })();
        if (typeof type !== 'boolean') throw new Error('Invalid type.Bool');
        return type;
    },
    toString: ({ booleanStrings }) => value =>
        value === true ? booleanStrings[0] : booleanStrings[1],
};
