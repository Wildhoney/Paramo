<img src="media/logo.png" alt="Paramo" width="300" />

> Swiss-army knife of stringifying, parsing and manipulating URL parameters by applying types to the parameters.

![Travis](http://img.shields.io/travis/Wildhoney/Paramo.svg?style=for-the-badge)
&nbsp;
![npm](http://img.shields.io/npm/v/paramo.svg?style=for-the-badge)
&nbsp;
![License MIT](http://img.shields.io/badge/license-mit-lightgrey.svg?style=for-the-badge)
&nbsp;
![Coveralls](https://img.shields.io/coveralls/Wildhoney/Paramo.svg?style=for-the-badge)
&nbsp;
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge)](https://github.com/prettier/prettier)

**npm**: `npm install paramo`

**yarn**: `yarn add paramo`

---

## Getting Started

`Paramo` takes the very useful [query-string]() library and applies the concept of types as an added layer. Although `query-string` provides some typecasting of values, it's far from ideal. Using the example below we can setup a type system to transform URL parameters back and forth between string representations.

```javascript
import { create, type } from 'paramo';

const types = {
    name: type.String,
    age: type.Int,
};

const user = create(types);

// { name: 'Adam', age: 34 }
user.parse('name=Adam&age=34');

// name=Adam&age=34
user.stringify({ name: 'Adam', age: 34 });
```

The `String` and `Int` types are probably the most simple types. Using the `Bool` type takes a little more configuration if the default isn't sufficient, as booleans can be represented as strings in many various ways. With that in mind, you can provide a second argument to the `create` function which overrides the defaults &ndash; in our case to modify the string representations of boolean values to be the pirate-esque `yar` and `naw`.

```javascript
import { create, type } from 'paramo';

const types = {
    name: type.String,
    age: type.Int,
    developer: type.Bool,
};

const user = create(types, {
    booleanStrings: ['yar', 'naw'],
});

// { name: 'Adam', age, 34: developer: true }
user.parse('name=Adam&age=34&developer=yar');

// name=Adam&age=34&developer=yar
user.stringify({ name: 'Adam', age: 34, developer: true });
```

We can then introduce the concept of arrays which uses [the `query-string` API](https://github.com/sindresorhus/query-string#api) for specifying how lists are represented &ndash; by default as duplicate keys.

```javascript
import { create, type, option } from 'paramo';

const types = {
    name: type.String,
    age: type.Int,
    developer: type.Bool,
    languages: type.Array(type.String),
};

const user = create(types, {
    booleanStrings: ['yar', 'naw'],
    arrayFormat: option.arrayFormat.comma,
});

// { name: 'Adam', age, 34: developer: true, languages: ['JavaScript', 'Ruby', 'Haskell'] }
user.parse('name=Adam&age=34&developer=yar&languages=JavaScript,Ruby,Haskell');

// name=Adam&age=34&developer=yar&languages=JavaScript,Ruby,Haskell
user.stringify({
    name: 'Adam',
    age: 34,
    developer: true,
    languages: ['Javascript', 'Ruby', 'Haskell'],
});
```

## Default Values

You can set defaults for the parameters by using the array notation. For example if by default all users are developers, then you can bake that into your types.

```javascript
const types = {
    name: type.String,
    age: type.Int,
    developer: [type.Bool, true],
    languages: type.Array(type.String),
};
```

When you `user.stringify` all parameters are still set, but in some cases you may wish for the default values to be omitted, as the default values may not matter if they are also baked into the back-end. For these instances you can set the `stripDefaults` option when creating the type instance.

```javascript
const user = create(types, {
    booleanStrings: ['yar', 'naw'],
    stripDefaults: true,
});
```

Furthermore when dealing with defaults you may wish for defaults to appear in `user.parse` unless they're defined in the URL parameters &ndash; you can use the `includeDefaults` option. You can use the same option for `user.stringify` if you don't set the aforementioned `stripDefaults` option.

## Configurable Options

| Option            | Default             | Description                                                                                                                  |
| ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `includeDefaults` | `true`              | Include default parameters set in the types.                                                                                 |
| `stripRedundant`  | `false`             | Exclude parameters which are not included in the types.                                                                      |
| `booleanStrings`  | `['true', 'false']` | Tuple of custom boolean types: `['yup', 'nup']`.                                                                             |
| `arrayFormat`     | `null`              | [`query-string`](https://github.com/sindresorhus/query-string) option for representing arrays as strings.                    |
| `stripDefaults`   | `false`             | Whether default values are stripped when stringifying.                                                                       |
| `dateFormat`      | `YYYY-MM-DD`        | [`moment`](https://momentjs.com/docs/) formatting for dates.                                                                 |
| `keyFormat`       | `null`              | Applying snakecase and kebabcase to the parameters.                                                                          |
| `splitKeys`       | `null`              | Allows the [custom splitting of keys](https://github.com/domchristie/humps#humpsdecamelizestring-options) when decamelising. |
| `processKeys`     | `null`              | Allows the setting up of a [key processing function](https://github.com/domchristie/humps#converting-object-keys).           |
