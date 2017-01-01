'use strict';
//playlog

export interface Playlog{
    score: number;
    stage: number;
}

//parse masao-playlog-format
export function parse(buf: Buffer): Playlog{
    if(!(buf instanceof Buffer)){
        throw new Error("This is not a Buffer");
    }
    const length=buf.length;
    //metadata sectionを読む
    if(length < 12){
        //サイズが足りないぞ
        throw new Error("Invalid data.");
    }
    //マジックナンバーを読む
    const magic = buf.readUInt32BE(0);
    if(magic !== 0x4D0E500A){
        throw new Error("Invalid data.");
    }
    const version = buf.readUInt32BE(4);
    if(version!==2){
        //version 2のみ読める
        throw new Error("Unsupported version of MPF.");
    }
    //順番に読んで最終的なスコアを求める
    let head_idx=12, score=0, stage=0;
    //stage: 最終到達ステージ
    while(head_idx < length){
        //スコアを読む
        const nscore=buf.readUInt32BE(head_idx+8);
        if(score<nscore){
            score=nscore;
        }
        const status=buf[head_idx+5];
        if(status & 1){
            //クリアした
            stage = buf[head_idx+4];
        }
        //次のHEADERに進む（HEADERは16バイト）
        head_idx += 16+buf.readUInt32BE(head_idx+12);
    }
    //結果を返す
    return {
        score: score,
        stage: stage
    };
}
