// advanced map loader
"use strict";
function readAdvancedMap(obj) {
    if (obj == null) {
        return null;
    }
    var result = {};
    var stages = obj.stages;
    if (!Array.isArray(stages)) {
        throw new Error("Invalid value: 'advanced-map'.stages");
    }
    if (obj.stages.length === 0) {
        throw new Error("'advanced-map'.stages must have at least one element");
    }
    result.stages = obj.stages.map(function (stage, i) {
        if (stage.size == null || 'number' !== stage.size.x || 'number' !== stage.size.y) {
            throw new Error("Invalid value: 'advanced-map'.stages[" + i + "].size");
        }
        var size = {
            x: parseInt(stage.size.x),
            y: parseInt(stage.size.y),
        };
        if (!Array.isArray(stage.layers)) {
            throw new Error("Invalid value: 'advanced-map'.stages[" + i + "].layer");
        }
        var layers = stage.layers.map(function (layer, j) {
            if (layer.id != null && 'string' !== typeof layer.id) {
            }
        });
    });
}
exports.readAdvancedMap = readAdvancedMap;
