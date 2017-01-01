import * as extend from 'extend';
//format

//load masao-json-format object and update to latest.
export function load(obj: any): any{
    const version=formatVersionToNumber(obj["masao-json-format-version"]);
    if(version===-1){
        //unsupported version
        throw new Error("Unsupported masao-json-format version.");
    }
    const result = extend({}, obj);
    //support draft-3
    result["masao-json-format-version"]="draft-3";
    //version
    if(version < 2){
        //versionが未サポートなのでデフォルト値を
        result["version"] = "fx16";
    }else if(!isValidVersion(obj["version"])){
        //バージョンが書いてあるけどだめ
        throw new Error("Unsupported masao version: \""+obj["version"]+"\"");
    }
    //metadata
    if(obj["metadata"] != null){
        //metadataのチェック
        if("object"!==typeof obj["metadata"]){
            throw new Error("Invalid value: metadata");
        }
        const subs = ["title","author","editor"];
        for(let i=0; i<3; i++){
            const k = subs[i];
            if(obj.metadata[k]!=null && "string"!==typeof obj.metadata[k]){
                throw new Error(`Invalid value: metadata.${k}`);
            }
        }
    }
    //script
    if(version < 3){
        result["script"] = null;
    }else if(obj["script"] == null){
        result["script"] = null;
    }else if("string" !== typeof obj["script"]){
        throw new Error("Invalid script value");
    }
    return result;
}

//make masao-json-format object
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
export function make(options: MakeOptions){
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
    }
    return -1;
}

