import * as date from 'date-fns';

export default {
    toType: () => value => {
        const typedValue = new Date(Date.parse(value));
        if (Number.isNaN(typedValue.getTime()))
            throw new Error('Invalid t.Date');
        return typedValue;
    },
    toString: ({ dateFormat }) => value => date.format(value, dateFormat),
};
