# masao v0.0.8

```sh
npm install masao
```

`masao` is a utility package for handling the Canvas Masao params.

`masao.format` api can handle masao-json-format up to version: *draft-3*.

# API
## masao.param.getDefaultValue(key)
Returns the default value for param `key`.

## masao.param.validateParam(params[, options])
Validates a param object `params`. Returns boolean value.

* options.version (string; valid version string; default: `"kani2"`) Version of Masao.
* options.maxLength (number; default: `Infinity`) Restricts length of a string value.
* options.allowExtraneous (boolean; default: `true`) Allows `params` to have an extraneous field.
* options.allowNulls (boolean; default: `true`) Allows some params to be null.

## masao.param.cutDefault(params)
Returns a new object where any field is the same, except the case that its value is the default value.

## masao.param.addDefaults(params[, version])
Returns a new object with omitted default params attached.

## masao.param.sanitize(params[, version])
Returns a new object where extraneous fields are cut off.

## masao.format.load(obj)
Load masao-json-format object and returns new object that is upgraded to *draft-3*.

Throws when it reads invalidly formatted object.

## masao.format.make(options)
Makes masao-json-format object.

## masao.playlog.parse(buf)
Parses Buffer as a masao-playlog-format object and returns an object in the following form:

    {
      score: 100, //eventual score
      stage: 1   //the last stage that is passed
    }

Throws if the data is invalid.

# License
MIT
