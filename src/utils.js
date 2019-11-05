import humps from 'humps';
import { equals } from 'ramda';
import { option } from './';

export class TypeError extends Error {}

export function getDefaultParams() {
    const isAvailable = typeof global.location !== 'undefined';
    return isAvailable ? global.location.search : null;
}

function getSymbolDescription(symbol) {
    return symbol.description ?? symbol.toString().replace(/(?:Symbol|[()])/g, '');
}

export function getType(type, options) {
    const [typer, defaultValue = typer.defaultValue ?? null] = [].concat(type);
    const toType = typer.toType(options);
    const toString = typer.toString(options);
    const isSame = typer.isSame ?? equals;

    return { toType, toString, defaultValue, isSame };
}

export function getKeyFormat(options) {
    const isSet = Object.values(option.keyFormat).includes(options.keyFormat);
    const separator = isSet ? getSymbolDescription(options.keyFormat) : null;

    return !options.keyFormat
        ? { camelize: a => a, decamelize: a => a }
        : {
              camelize: a => {
                  const args = { process: options.processKeys };
                  if (options.keyFormat === option.keyFormat.pascal) return humps.camelizeKeys(a, args);
                  return humps.camelizeKeys(a, { ...args, separator });
              },
              decamelize: a => {
                  const args = { split: options.splitKeys, process: options.processKeys };
                  if (options.keyFormat === option.keyFormat.pascal) return humps.pascalizeKeys(a, args);
                  return humps.decamelizeKeys(a, { ...args, separator });
              },
          };
}

export function getArrayFormat(options) {
    const isSet = Object.values(option.arrayFormat).includes(options.arrayFormat);
    return isSet ? getSymbolDescription(options.arrayFormat) : null;
}
