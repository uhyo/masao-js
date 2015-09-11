# masao v0.0.5

```sh
npm install masao
```

`masao` is a utility package for handling the Canvas Masao params.

# API
## masao.param.getDefaultValue(key)
Returns the default value for param `key`.

## masao.param.validateParam(params[, options])
Validates a param object `params`. Returns boolean value.

* options.maxLength (number; default: `Infinity`) Restricts length of a string value.
* options.allowExtraneous (boolean; default: `true`) Allows `params` to have an extraneous field.
* options.allowNulls (boolean; default: `true`) Allows some params to be null.

## masao.param.cutDefault(params)
Returns a new object where any field is the same, except the case that its value is the default value.

## masao.param.addDefaults(params)
Returns a new object with omitted default params attached.

# License
MIT
