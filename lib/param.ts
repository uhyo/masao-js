//Canvas Masao Params
import * as extend from 'extend';

export type Params = Record<string, string>;

// paramを示すデータ
export interface BaseData{
    description: string;
    default: string;
    version?: Partial<Record<'2.8' | 'fx' | 'kani2', boolean | Array<string>>>;
    require?: Record<string, string>;
}
export interface EnumData extends BaseData{
    description: string;
    type: 'enum';
    enumValues: Array<{
        value: string;
        description: string;
    }>;
}
export interface BoolData extends BaseData{
    type: 'boolean' | 'boolean-reversed';
}
export interface IntegerData extends BaseData{
    type: 'integer';
    min?: number;
    max?: number;
}
export interface StringData extends BaseData{
    type: 'string';
}
export interface ResourceData extends BaseData{
    type: 'resource';
}
export interface MapData extends BaseData{
    type: 'map';
}
export interface LayerData extends BaseData{
    type: 'layer';
}
export interface ChizuData extends BaseData{
    type: 'chizu';
}

export type Data = EnumData | BoolData | IntegerData | StringData | ResourceData | MapData | LayerData | ChizuData;

export const data: Record<string, Data> = require('../data/params.json');

//マップ系を追加
let map_df="";
for(let i=0; i<60; i++){
    map_df += ".";
}
for (let h = 0; h < 4; h++) {
    const ssfx = ["", "-s", "-t", "-f"][h];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 30; j++) {
            const stg = h>0 ? "（ステージ"+(h+1)+"）" : "";
            data["map" + i + "-" + j + ssfx] = {
                description: "マップ"+i+"-"+j+stg,
                type: "map",
                default: map_df,
            };
        }
    }
}
for(let i=0; i<60; i++){
    map_df+=".";
}
for (let h = 0; h < 4; h++) {
    const ssfx = ["", "-s", "-t", "-f"][h];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 30; j++) {
            const stg = h>0 ? "（ステージ"+(h+1)+"）" : "";
            data["layer" + i + "-" + j + ssfx] = {
                description: "レイヤー"+i+"-"+j+stg,
                type: "layer",
                default: map_df,
                version: {
                    "2.8": false,
                },
            };
        }
    }
}
for (let i = 0; i < 9; i++) {
    data["chizu-"+i] = {
        description: "地図"+i,
        type: "chizu",
        default: "",
    };
}

export const paramKeys=Object.keys(data);

//リソース系paramの一覧
export const resourceKeys=[
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
export function getDefaultValue(key: string): string | null{
    const d=data[key];
    if(d==null){
        return null;
    }
    return d.default || "";
}

//validateparams
export interface ValidateParamsOption{
    version: string;
    maxLength: number;
    allowExtraneous: boolean;
    allowNulls: boolean;
}
export function validateParams(params: Params,opt: Partial<ValidateParamsOption>): boolean{
    const options: ValidateParamsOption = extend({
        version: 'kari2',
        maxLength: Infinity,
        allowExtraneous: true,
        allowNulls: true,
    }, opt || {});

    const vc=versionCategory(options.version);

    let pmcnt=0;
    for(let key in data){
        const v=params[key];
        if(v != null){
            if("string"!==typeof v){
                return false;
            }
            const vv = data[key];
            if(vv.version && vv.version[vc] === false){
                continue;
            }
            pmcnt++;

            if(vv.type === "integer"){
                if(!/^-?\d+$/.test(v)){
                    return false;
                }
                const vi = parseInt(v);
                if(vv.min!=null && vi<vv.min || vv.max!=null && vv.max<vi){
                    return false;
                }
            }else if(vv.type === "boolean"){
                if(v!=="1" && v!=="2"){
                    return false;
                }
            }else if(vv.type === "enum"){
                if(vv.enumValues.every(eo=> eo.value !== v)){
                    return false;
                }
            }else if(vv.type==="string"){
                if(v.length>options.maxLength){
                    return false;
                }
            }
        }else if(options.allowNulls === false){
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

export function cutDefaults(params: Params): Params{
    const result={};
    for(let key in params){
        if(key in data){
            if(params[key] !== data[key].default){
                result[key] = params[key];
            }
        }
    }
    return result;
}

export function addDefaults(params: Params, version?: string): Params{
    if(version == null){
        version = 'kani2';
    }else{
        version = versionCategory(version);
    }
    const result={};
    for(let key in params){
        result[key] = params[key];
    }
    for(let key in data){
        const dk=data[key];
        if(dk.version && dk.version[version]===false){
            continue;
        }
        if(!(key in result)){
            result[key] = dk.default || "";
        }
    }
    return result;
}

export function sanitize(params: Params, version?: string): Params{
    if(version == null){
        version = 'kani2';
    }else{
        version = versionCategory(version);
    }
    const result={};
    for(let key in data){
        const dk=data[key];
        if(dk.version && dk.version[version]===false){
            continue;
        }
        if(key in params){
            result[key] = params[key];
        }
    }
    return result;
}

function versionCategory(version: string): string{
    //version string -> version category
    if(version==="2.7" || version==="2.8" || version==="2.81"){
        return "2.8";
    }
    if(version==="kani" || version==="kani2"){
        return "kani2";
    }
    return "fx";
}

