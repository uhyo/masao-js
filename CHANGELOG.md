# v0.2.0
- `playlog.parse` now takes `ArrayBuffer` instead of `Buffer`.
- Provides ESModule build via `module` field of `package.json`.

# v0.1.12
- Added `isFXOrLater` parameter to `param.minimizeMapData`.

# v0.1.11
- Fixed the bug that `format.sanitizeAdvancedMap` removed custom parts definitions.

# v0.1.10
- Added `customParts` module.

# v0.1.9
- Added `param.minimizeAdvancedData` function.
- `format.load` now allows minimized advanced-map data. Previously it was required that map and layer arrays have an exact width×height shape.

# v0.1.8
- Added `param.minimizeMapData` function.

# v0.1.7
- Changed some default param value to align with mc_canvas.

# v0.1.6
- Changed some default param value to align with mc_canvas.

# v0.1.5
- Fix the bug that `masao.load.html` could not handle the game whose option object is undefined.

# v0.1.4
- Reduced the size of module. (`b9ba646`)
