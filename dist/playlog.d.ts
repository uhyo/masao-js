/// <reference types="node" />
export interface Playlog {
    score: number;
    stage: number;
}
export declare function parse(buf: Buffer): Playlog;
