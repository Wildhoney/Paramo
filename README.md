# Paramo

> Standard URLSearchParams with transformations to and from JavaScript types.

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

| Option            | Default             | Description                                             |
| ----------------- | ------------------- | ------------------------------------------------------- |
| `includeDefaults` | `true`              | Include default parameters set in the types.            |
| `stripRedundant`  | `false`             | Exclude parameters which are not included in the types. |
| `booleanStrings`  | `['true', 'false']` | Tuple of custom boolean types: `['yup', 'nup']`         |
