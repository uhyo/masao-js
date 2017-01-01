export declare type Params = Record<string, string>;
export interface BaseData {
    description: string;
    default: string;
    version?: Partial<Record<'2.8' | 'fx' | 'kani2', boolean | Array<string>>>;
    require?: Record<string, string>;
}
export interface EnumData extends BaseData {
    description: string;
    type: 'enum';
    enumValues: Array<{
        value: string;
        description: string;
    }>;
}
export interface BoolData extends BaseData {
    type: 'boolean' | 'boolean-reversed';
}
export interface IntegerData extends BaseData {
    type: 'integer';
    min?: number;
    max?: number;
}
export interface StringData extends BaseData {
    type: 'string';
}
export interface ResourceData extends BaseData {
    type: 'resource';
}
export interface MapData extends BaseData {
    type: 'map';
}
export interface LayerData extends BaseData {
    type: 'layer';
}
export interface ChizuData extends BaseData {
    type: 'chizu';
}
export declare type Data = EnumData | BoolData | IntegerData | StringData | ResourceData | MapData | LayerData | ChizuData;
export declare const data: Record<string, Data>;
export declare const paramKeys: string[];
export declare const resourceKeys: string[];
export declare function getDefaultValue(key: string): string | null;
export interface ValidateParamsOption {
    version: string;
    maxLength: number;
    allowExtraneous: boolean;
    allowNulls: boolean;
}
export declare function validateParams(params: Params, opt: Partial<ValidateParamsOption>): boolean;
export declare function cutDefaults(params: Params): Params;
export declare function addDefaults(params: Params, version?: string): Params;
export declare function sanitize(params: Params, version?: string): Params;
