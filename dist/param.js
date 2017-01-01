"use strict";
//Canvas Masao Params
var extend = require("extend");
exports.data = require('../data/params.json');
//マップ系を追加
var map_df = "";
for (var i = 0; i < 60; i++) {
    map_df += ".";
}
for (var h = 0; h < 4; h++) {
    var ssfx = ["", "-s", "-t", "-f"][h];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 30; j++) {
            var stg = h > 0 ? "（ステージ" + (h + 1) + "）" : "";
            exports.data["map" + i + "-" + j + ssfx] = {
                description: "マップ" + i + "-" + j + stg,
                type: "map",
                default: map_df,
            };
        }
    }
}
for (var i = 0; i < 60; i++) {
    map_df += ".";
}
for (var h = 0; h < 4; h++) {
    var ssfx = ["", "-s", "-t", "-f"][h];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 30; j++) {
            var stg = h > 0 ? "（ステージ" + (h + 1) + "）" : "";
            exports.data["layer" + i + "-" + j + ssfx] = {
                description: "レイヤー" + i + "-" + j + stg,
                type: "layer",
                default: map_df,
                version: {
                    "2.8": false,
                },
            };
        }
    }
}
for (var i = 0; i < 9; i++) {
    exports.data["chizu-" + i] = {
        description: "地図" + i,
        type: "chizu",
        default: "",
    };
}
exports.paramKeys = Object.keys(exports.data);
//リソース系paramの一覧
exports.resourceKeys = [
    "filename_chizu",
    "filename_ending",
    "filename_fx_bgm_boss",
    "filename_fx_bgm_chizu",
    "filename_fx_bgm_ending",
    "filename_fx_bgm_stage1",
    "filename_fx_bgm_stage2",
    "filename_fx_bgm_stage3",
    "filename_fx_bgm_stage4",
    "filename_fx_bgm_title",
    "filename_gameover",
    "filename_haikei",
    "filename_haikei2",
    "filename_haikei3",
    "filename_haikei4",
    "filename_mapchip",
    "filename_pattern",
    "filename_title",
    "filename_se_bomb",
    "filename_se_block",
    "filename_se_chizugamen",
    "filename_se_clear",
    "filename_se_coin",
    "filename_se_dengeki",
    "filename_se_dokan",
    "filename_se_dosun",
    "filename_se_fireball",
    "filename_se_fumu",
    "filename_se_gameover",
    "filename_se_get",
    "filename_se_grounder",
    "filename_se_happa",
    "filename_se_hinoko",
    "filename_se_item",
    "filename_se_jet",
    "filename_se_jump",
    "filename_se_kaiole",
    "filename_se_kiki",
    "filename_se_miss",
    "filename_se_mizu",
    "filename_se_mizudeppo",
    "filename_se_senkuuza",
    "filename_se_sjump",
    "filename_se_start",
    "filename_se_tobasu",
    "filename_second_haikei",
    "filename_second_haikei2",
    "filename_second_haikei3",
    "filename_second_haikei4",
    "filename_bgm_boss",
    "filename_bgm_chizu",
    "filename_bgm_ending",
    "filename_bgm_stage1",
    "filename_bgm_stage2",
    "filename_bgm_stage3",
    "filename_bgm_stage4",
    "filename_bgm_title"
];
//get default value
function getDefaultValue(key) {
    var d = exports.data[key];
    if (d == null) {
        return null;
    }
    return d.default || "";
}
exports.getDefaultValue = getDefaultValue;
function validateParams(params, opt) {
    var options = extend({
        version: 'kari2',
        maxLength: Infinity,
        allowExtraneous: true,
        allowNulls: true,
    }, opt || {});
    var vc = versionCategory(options.version);
    var pmcnt = 0;
    var _loop_1 = function (key) {
        var v = params[key];
        if (v != null) {
            if ("string" !== typeof v) {
                return { value: false };
            }
            var vv = exports.data[key];
            if (vv.version && vv.version[vc] === false) {
                return "continue";
            }
            pmcnt++;
            if (vv.type === "integer") {
                if (!/^-?\d+$/.test(v)) {
                    return { value: false };
                }
                var vi = parseInt(v);
                if (vv.min != null && vi < vv.min || vv.max != null && vv.max < vi) {
                    return { value: false };
                }
            }
            else if (vv.type === "boolean") {
                if (v !== "1" && v !== "2") {
                    return { value: false };
                }
            }
            else if (vv.type === "enum") {
                if (vv.enumValues.every(function (eo) { return eo.value !== v; })) {
                    return { value: false };
                }
            }
            else if (vv.type === "string") {
                if (v.length > options.maxLength) {
                    return { value: false };
                }
            }
        }
        else if (options.allowNulls === false) {
            return { value: false };
        }
    };
    for (var key in exports.data) {
        var state_1 = _loop_1(key);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    if (options.allowExtraneous === false && Object.keys(params).length > pmcnt) {
        //extraneous field
        return false;
    }
    return true;
}
exports.validateParams = validateParams;
function cutDefaults(params) {
    var result = {};
    for (var key in params) {
        if (key in exports.data) {
            if (params[key] !== exports.data[key].default) {
                result[key] = params[key];
            }
        }
    }
    return result;
}
exports.cutDefaults = cutDefaults;
function addDefaults(params, version) {
    if (version == null) {
        version = 'kani2';
    }
    else {
        version = versionCategory(version);
    }
    var result = {};
    for (var key in params) {
        result[key] = params[key];
    }
    for (var key in exports.data) {
        var dk = exports.data[key];
        if (dk.version && dk.version[version] === false) {
            continue;
        }
        if (!(key in result)) {
            result[key] = dk.default || "";
        }
    }
    return result;
}
exports.addDefaults = addDefaults;
function sanitize(params, version) {
    if (version == null) {
        version = 'kani2';
    }
    else {
        version = versionCategory(version);
    }
    var result = {};
    for (var key in exports.data) {
        var dk = exports.data[key];
        if (dk.version && dk.version[version] === false) {
            continue;
        }
        if (key in params) {
            result[key] = params[key];
        }
    }
    return result;
}
exports.sanitize = sanitize;
function versionCategory(version) {
    //version string -> version category
    if (version === "2.7" || version === "2.8" || version === "2.81") {
        return "2.8";
    }
    if (version === "kani" || version === "kani2") {
        return "kani2";
    }
    return "fx";
}
