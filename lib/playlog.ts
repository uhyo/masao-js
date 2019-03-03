'use strict';
//playlog

export interface Playlog {
  score: number;
  stage: number;
}

/**
 * parse masao-playlog-format given as an ArrayBuffer.
 */
export function parse(buf: ArrayBuffer): Playlog {
  if (!(buf instanceof ArrayBuffer)) {
    throw new Error('This is not an ArrayBuffer');
  }
  const length = buf.byteLength;
  //metadata sectionを読む
  if (length < 12) {
    //サイズが足りないぞ
    throw new Error('Invalid data.');
  }
  const dv = new DataView(buf);
  //マジックナンバーを読む
  const magic = dv.getUint32(0, false);
  if (magic !== 0x4d0e500a) {
    throw new Error('Invalid data.');
  }
  const version = dv.getUint32(4, false);
  if (version !== 2) {
    //version 2のみ読める
    throw new Error('Unsupported version of MPF.');
  }
  //順番に読んで最終的なスコアを求める
  let head_idx = 12,
    score = 0,
    stage = 0;
  //stage: 最終到達ステージ
  while (head_idx < length) {
    //スコアを読む
    const nscore = dv.getUint32(head_idx + 8, false);
    if (score < nscore) {
      score = nscore;
    }
    const status = dv.getUint8(head_idx + 5);
    if (status & 1) {
      //クリアした
      stage = dv.getUint8(head_idx + 4);
    }
    //次のHEADERに進む（HEADERは16バイト）
    head_idx += 16 + dv.getUint32(head_idx + 12, false);
  }
  //結果を返す
  return {
    score: score,
    stage: stage,
  };
}
