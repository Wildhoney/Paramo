import { TypeError } from '../utils';

const raise = (message) => {
    throw new TypeError(message);
};

export default class Type {
    constructor() {
        this.parser = ({ value }) => value;
        this.stringifier = ({ value }) => value;
    }

    toType(options) {
        return (value) => this.parser({ value, options, raise });
    }

    toString(options) {
        return (value) => this.stringifier({ value, options, raise });
    }

    setParse(fn) {
        this.parser = fn;
    }

    setStringify(fn) {
        this.stringifier = fn;
    }
}
