"use strict";
function checkAdvancedMap(map) {
    // advanced-mapが変だったらthrowする
    for (var _i = 0, _a = map.stages; _i < _a.length; _i++) {
        var _b = _a[_i], size = _b.size, layers = _b.layers;
        // 各ステージ
        var main_flg = false;
        for (var _c = 0, layers_1 = layers; _c < layers_1.length; _c++) {
            var _d = layers_1[_c], type = _d.type, map_1 = _d.map;
            if (type === 'main') {
                // メインレイヤーは1つだけ
                if (main_flg === true) {
                    throw new Error('More than one main layer is included');
                }
                main_flg = true;
            }
            if (map_1.length !== size.y) {
                throw new Error('Invalid map size');
            }
            for (var _e = 0, map_2 = map_1; _e < map_2.length; _e++) {
                var row = map_2[_e];
                if (row.length !== size.x) {
                    throw new Error('Invalid map size');
                }
                if (type === 'mapchip') {
                    for (var _f = 0, row_1 = row; _f < row_1.length; _f++) {
                        var chip = row_1[_f];
                        if ('number' !== typeof chip) {
                            throw new Error('Invalid map chip');
                        }
                    }
                }
            }
        }
    }
}
exports.checkAdvancedMap = checkAdvancedMap;
