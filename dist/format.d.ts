export declare function load(obj: any): any;
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
export declare function make(options: MakeOptions): any;
