import { TypeError } from '../utils';

export default {
    toType: ({ booleanStrings: [truthy, falsy] }) => value => {
        const typedValue = (() => {
            switch (value) {
                case '1':
                case 'true':
                case 'yes':
                case 'on':
                case String(truthy):
                    return true;
                case '0':
                case 'false':
                case 'no':
                case 'off':
                case String(falsy):
                    return false;
            }
        })();
        if (typeof typedValue !== 'boolean') throw new TypeError('Invalid type.Bool');
        return typedValue;
    },
    toString: ({ booleanStrings: [truthy, falsy] }) => value => (value === true ? truthy : falsy),
};
