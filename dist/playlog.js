'use strict';
//parse masao-playlog-format
function parse(buf) {
    if (!(buf instanceof Buffer)) {
        throw new Error("This is not a Buffer");
    }
    var length = buf.length;
    //metadata sectionを読む
    if (length < 12) {
        //サイズが足りないぞ
        throw new Error("Invalid data.");
    }
    //マジックナンバーを読む
    var magic = buf.readUInt32BE(0);
    if (magic !== 0x4D0E500A) {
        throw new Error("Invalid data.");
    }
    var version = buf.readUInt32BE(4);
    if (version !== 2) {
        //version 2のみ読める
        throw new Error("Unsupported version of MPF.");
    }
    //順番に読んで最終的なスコアを求める
    var head_idx = 12, score = 0, stage = 0;
    //stage: 最終到達ステージ
    while (head_idx < length) {
        //スコアを読む
        var nscore = buf.readUInt32BE(head_idx + 8);
        if (score < nscore) {
            score = nscore;
        }
        var status_1 = buf[head_idx + 5];
        if (status_1 & 1) {
            //クリアした
            stage = buf[head_idx + 4];
        }
        //次のHEADERに進む（HEADERは16バイト）
        head_idx += 16 + buf.readUInt32BE(head_idx + 12);
    }
    //結果を返す
    return {
        score: score,
        stage: stage
    };
}
exports.parse = parse;
