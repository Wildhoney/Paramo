import humps from 'humps';
import { equals } from 'ramda';
import { option } from './';

export class TypeError extends Error {}

export function getDefaultParams() {
    const isAvailable = typeof global.location !== 'undefined';
    return isAvailable ? global.location.search : null;
}

export function getType(type, options) {
    const [typer, defaultValue = typer.defaultValue || null] = [].concat(type);
    const toType = typer.toType(options);
    const toString = typer.toString(options);
    const isSame = typer.isSame || equals;

    return { toType, toString, defaultValue, isSame };
}

export function getKeyFormat(options) {
    const isSet = Object.values(option.keyFormat).includes(options.keyFormat);
    const separator = isSet ? options.keyFormat.description : null;

    return !options.keyFormat
        ? { camelize: a => a, decamelize: a => a }
        : {
              camelize: a => humps.camelizeKeys(a, { separator, process: options.processKeys }),
              decamelize: a =>
                  humps.decamelizeKeys(a, { separator, split: options.splitKeys, process: options.processKeys }),
          };
}

export function getArrayFormat(options) {
    const isSet = Object.values(option.arrayFormat).includes(options.arrayFormat);
    return isSet ? options.arrayFormat.description : null;
}
