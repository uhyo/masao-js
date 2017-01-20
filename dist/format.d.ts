export declare function load(obj: any): MasaoJSONFormat;
export interface MasaoJSONFormat {
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
        stages: Array<{}>;
        customParts: Record<string, {
            extends: string;
            properties: Record<string, any>;
        }>;
    };
}
export interface StageObject {
    size: {
        x: number;
        y: number;
    };
    layers: Array<LayerObject>;
}
export interface LayerObject {
    id?: string;
    type: 'main' | 'mapchip';
    src?: string;
    map: Array<Array<number | string>>;
}
export interface MakeOptions {
    params: any;
    version: string;
    metadata?: {
        title?: string;
        author?: string;
        editor?: string;
    };
    script?: string;
}
export declare function make(options: MakeOptions): MasaoJSONFormat;
