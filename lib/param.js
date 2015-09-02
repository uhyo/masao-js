//Canvas Masao Params

var data=require('./params.json');

//マップ系を追加
for (var h = 0; h < 4; h++) {
    var ssfx = ["", "-s", "-t", "-f"][h];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 30; j++) {
            var stg = h>0 ? "（ステージ"+(h+1)+"）" : "";
            data["map" + i + "-" + j + ssfx] = {
                description: "マップ"+i+"-"+j+stg,
                type: "map",
                default: ""
            };
        }
    }
}
for (var i = 0; i < 9; i++) {
    data["chizu-"+i] = {
        description: "地図"+i,
        type: "chizu",
        default: ""
    };
}

var paramKeys=Object.keys(data);

//リソース系paramの一覧
var resourceKeys=[
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

//export
exports.data = data;
exports.paramKeys = paramKeys;
exports.resourceKeys = resourceKeys;

//get default value
function getDefaultValue(key){
    var d=data[key];
    if(d==null){
        return null;
    }
    return d.default || "";
}
exports.getDefaultValue = getDefaultValue;

//validateparams
function validateParams(params,options){
    if(options==null){
        options={};
    }
    if(options.maxLength==null){
        options.maxLength=Infinity;
    }
    if(options.allowExtraneous==null){
        options.allowExtraneous=true;
    }
    if(options.allowNulls==null){
        options.allowNulls=true;
    }

    var pmcnt=0;
    for(var key in data){
        var v=params[key];
        if(v!=null){
            pmcnt++;
            if("string"!==typeof v){
                return false;
            }
            var vv=data[key];
            if(vv.type==="integer"){
                if(!/^-?\d+$/.test(vv)){
                    return false;
                }
                var vi=parseInt(v);
                if(vv.min!=null && vi<vv.min || vv.max!=null && vv.max<vi){
                    return false;
                }
            }else if(vv.type==="boolean"){
                if(v!=="1" && v!=="2"){
                    return false;
                }
            }else if(vv.type==="enum"){
                if(vv.enumValues.every(function(eo){
                    return eo.value!==v;
                })){
                    return false;
                }
            }else if(vv.type==="string"){
                if(v.length>options.maxLength){
                    return false;
                }
            }
        }else if(options.allowNulls===false){
            //required param is null
            return false;
        }
    }
    if(options.allowExtraneous===false && Object.keys(params).length>pmcnt){
        //extraneous field
        return false;
    }
    return true;
}
exports.validateParams = validateParams;

function cutDefaults(params){
    var result={};
    for(var key in params){
        if(key in data){
            if(params[key]!==data[key].default){
                result[key]=params[key];
            }
        }
    }
    return result;
}
exports.cutDefaults = cutDefaults;

function addDefaults(params){
    var result={};
    for(var key in params){
        result[key]=params[key];
    }
    for(var key in data){
        if(!(key in result)){
            result[key]=data[key].default || "";
        }
    }
    return result;
}
exports.addDefaults = addDefaults;
