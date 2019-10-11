# Paramo

> Swiss-army knife of stringifying, parsing and manipulating URL parameters by applying types to the parameters.

```javascript
import { create, type } from 'paramo';

const types = {
    name: [type.String, 'Adam'],
    age: [type.Int, 33],
};

const userParams = create(types, options);
userParams.parse('name=Adam&age=33');
userParams.stringify({ name: 'Adam', age: 33 });
```

## Options

| Option            | Default             | Description                                                                                               |
| ----------------- | ------------------- | --------------------------------------------------------------------------------------------------------- |
| `includeDefaults` | `true`              | Include default parameters set in the types.                                                              |
| `stripRedundant`  | `false`             | Exclude parameters which are not included in the types.                                                   |
| `booleanStrings`  | `['true', 'false']` | Tuple of custom boolean types: `['yup', 'nup']`.                                                          |
| `arrayFormat`     | `null`              | [https://github.com/sindresorhus/query-string](`query-string`) option for representing arrays as strings. |
| `stripDefaults`   | `false`             | Whether default values are stipped when stringifying.                                                     |
| `dateFormat`      | `yyyy-mm-dd`        | [https://date-fns.org](`date-dns`) formatting for dates.                                                  |
| `keyFormat`       | `null`              | Applying snakecase and kebabcase to the parameters.                                                       |
