import * as extend from 'extend';
import {
    Validator,
} from 'jsonschema';

import {
    checkAdvancedMap,
} from './format/advanced-map';

//format
const schema = require('./format-schema.json');

//load masao-json-format object and update to latest.
export function load(obj: any): MasaoJSONFormat{
    const validator = new Validator();
    const vresult = validator.validate(obj, schema);

    if (!vresult.valid){
        //JSON Schemaにあてはまらなくてだめ
        throw vresult.errors[0];
    }

    const version=formatVersionToNumber(obj["masao-json-format-version"]);
    if(version===-1){
        //unsupported version
        throw new Error("Unsupported masao-json-format version.");
    }
    const result = extend({}, obj);
    //support draft-4
    result["masao-json-format-version"]="draft-4";
    //version
    if(version < 2){
        //versionが未サポートなのでデフォルト値を
        result["version"] = "fx16";
    }else if(!isValidVersion(obj["version"])){
        //バージョンが書いてあるけどだめ
        throw new Error(`Unsupported masao version: "${obj["version"]}"`);
    }

    //script
    if(version < 3){
        result['script'] = null;
    }else if(obj['script'] == null){
        result['script'] = null;
    }

    // advanced-map
    if (version < 4){
        result['advanced-map'] = null;
    }else if(result['advanced-map'] == null){
        result['advanced-map'] = null;
    }else{
        checkAdvancedMap(result['advanced-map']);
    }
    return result;
}

//make masao-json-format object
export interface MasaoJSONFormat{
    'masao-json-format-version': 'draft-1' | 'draft-2' | 'draft-3' | 'draft-4';
    params: Record<string, string>;
    version: string;
    metadata?: {
        title?: string;
        author?: string;
        editor?: string;
    };
    script?: string;
    'advanced-map'?: {
        stages: Array<{
        }>;
        customParts: Record<string, {
            extends: string;
            properties: Record<string, any>;
        }>;
    };
}
export interface StageObject{
    size: {
        x: number;
        y: number;
    };
    layers: Array<LayerObject>
}
export interface LayerObject{
    id?: string;
    type: 'main' | 'mapchip';
    src?: string;
    map: Array<Array<number | string>>;
}
/*
 * options: {
 *   params: object,
 *   version?: string,
 *   metadata?: {
 *     title?: string,
 *     author?: string,
 *     editor?: string
 *   },
 *   script: string
 *   "advanced-map": {
 *     
 *   }
 * }   
 */
export interface MakeOptions{
    params: any;
    version: string;
    metadata?: {
        title?: string;
        author?: string;
        editor?: string;
    };
    script?: string;
}
export function make(options: MakeOptions): MasaoJSONFormat{
    //validate
    const result: any = {
        "masao-json-format-version": "draft-3",
    };
    if(options.params==null || "object"!==typeof options.params){
        throw new Error("Invalid value of params");
    }
    result.params = options.params;
    if(options.metadata != null){
        if("object"!==typeof options.metadata){
            throw new Error("Invalid value of metadata");
        }
        if(options.metadata.title!=null && "string"!==typeof options.metadata.title){
            throw new Error("Invalid value of metadata.title");
        }
        if(options.metadata.author!=null && "string"!==typeof options.metadata.author){
            throw new Error("Invalid value of metadata.title");
        }
        if(options.metadata.editor!=null && "string"!==typeof options.metadata.editor){
            throw new Error("Invalid value of metadata.title");
        }
        result.metadata=options.metadata;
    }
    if(!isValidVersion(options.version)){
        throw new Error("Invalid value of version");
    }
    result.version=options.version;
    if(options.script!=null && "string"!==typeof options.script){
        throw new Error("Invalid script");
    }
    result.script=options.script;
    return result;
}

//version
function isValidVersion(version: string): boolean{
    return ["2.7","2.8","2.9","3.0","3.11","3.12","fx","fx2","fx3","fx4","fx5","fx6","fx7","fx8","fx9","fx10","fx11","fx12","fx13","fx14","fx15","fx16","kani","kani2"].indexOf(version)>=0;
}

//formatのversionを数字に
function formatVersionToNumber(version: string): number{
    if(version==="draft-1"){
        return 1;
    }else if(version==="draft-2"){
        return 2;
    }else if(version==="draft-3"){
        return 3;
    }else if(version==="draft-4"){
        return 4;
    }
    return -1;
}

