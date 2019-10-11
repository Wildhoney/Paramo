import moment from 'moment';
import { TypeError } from '../utils';

const Type = {
    toType: () => value => {
        const typedValue = moment.isMoment(value) ? value.toDate() : moment(value).toDate();
        if (Number.isNaN(typedValue.getTime())) throw new TypeError('Invalid t.Date');
        return typedValue;
    },
    toString: ({ dateFormat }) => value => moment(value).format(dateFormat),
};

Type.UnixSeconds = {
    toType: () => value => {
        const typedValue = moment(Number(value));
        return Type.toType()(typedValue);
    },
    toString: Type.toString,
};

Type.UnixMilliseconds = {
    toType: () => value => {
        const typedValue = moment.unix(Number(value));
        return Type.toType()(typedValue);
    },
    toString: Type.toString,
};

export default Type;
