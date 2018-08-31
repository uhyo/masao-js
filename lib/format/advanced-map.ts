import {
  AdvancedMap,
  MasaoJSONFormatVersion,
  StageObject,
  LayerObject,
  CustomPartsData,
  formatVersionToNumber,
} from './data';

export function checkAdvancedMap(map: AdvancedMap): void {
  // advanced-mapが変だったらthrowする
  let { customParts } = map;
  if (customParts == null) {
    customParts = {};
  }
  for (const { size, layers } of map.stages) {
    // 各ステージ
    let main_flg = false;
    for (const { type, map } of layers) {
      if (type === 'main') {
        // メインレイヤーは1つだけ
        if (main_flg === true) {
          throw new Error('More than one main layer is included');
        }
        main_flg = true;
      }
      // マップサイズが大きすぎるのはだめ
      // （最小化のため小さいのは許す）
      if (map.length > size.y) {
        throw new Error('Invalid map size');
      }
      for (const row of map) {
        if (row.length > size.x) {
          throw new Error('Invalid map size');
        }
        if (type === 'mapchip') {
          for (const chip of row) {
            if ('number' !== typeof chip) {
              throw new Error('Invalid map chip');
            }
          }
        } else {
          for (const chip of row) {
            if ('string' === typeof chip && customParts[chip] == null) {
              throw new Error('Undefined custom parts');
            }
          }
        }
      }
    }
  }
}

export interface SanitizeAdvancedMapOptions {
  /**
   * stage number.
   */
  stageNumber: number;
  /**
   * number of 'mapchip' layers.
   * defaults to 1.
   */
  layerNumber?: number;
  /**
   * Maximum string length.
   * defaults to 1000.
   */
  maxStringLength?: number;
}
/**
 * advanced-mapをsanitizeする
 * validなadvanced-mapであることは前提
 */
export function sanitizeAdvancedMap(
  versionstring: MasaoJSONFormatVersion,
  obj: AdvancedMap,
  options: SanitizeAdvancedMapOptions,
): AdvancedMap | undefined {
  const stageNumber = options.stageNumber;
  const layerNumber = options.layerNumber || 1;
  const maxStringLength = options.maxStringLength || 1000;

  const version = formatVersionToNumber(versionstring);
  if (version < 4) {
    // Advanced Mapに対応していないバージョン
    return void 0;
  }
  // いらないものは消していく
  const stages = obj.stages.slice(0, stageNumber).map(stage => {
    const size = {
      x: stage.size.x,
      y: stage.size.y,
    };
    const layers: Array<LayerObject> = [];
    let layer_count = 0;
    for (const { id, type, src, map } of stage.layers) {
      if (type === 'mapchip') {
        if (++layer_count > layerNumber) {
          // レイヤーが複数あるので飛ばす
          continue;
        }
      }
      const src2 = 'string' === typeof src ? src.slice(0, maxStringLength) : '';
      layers.push({
        id,
        type,
        src: src2,
        map,
      });
    }
    return {
      size,
      layers,
    };
  });
  // まだ何もない

  return {
    stages,
    customParts: makeCustomPartsData(stages, obj.customParts),
  };
}

/**
 * カスタムパーツ定義のうち使用されているもの名前を列挙
 */
function filterCustomPartsName(
  stages: Array<StageObject>,
  customParts: Record<string, CustomPartsData>,
): Set<string> {
  const usedSet = new Set();

  for (const { layers } of stages) {
    for (const { type, map } of layers) {
      if (type !== 'main') {
        continue;
      }
      // メインレイヤーを探索
      for (const row of map) {
        for (const chip of row) {
          if ('string' === typeof chip) {
            // カスタムパーツだ
            usedSet.add(chip);
          }
        }
      }
    }
  }
  // 使用されていないが他のベースになっているものも残す
  let queue = Array.from(usedSet);
  while (queue.length > 0) {
    const newQueue: string[] = [];
    for (const key of queue) {
      const ext = customParts[key].extends;
      if ('string' === typeof ext) {
        if (!usedSet.has(ext)) {
          // this is new.
          usedSet.add(ext);
          newQueue.push(ext);
        }
      }
    }
    queue = newQueue;
  }
  return usedSet;
}

/**
 * Make custom parts data.
 */
function makeCustomPartsData(
  stages: Array<StageObject>,
  customParts: Record<string, CustomPartsData> | undefined,
): Record<string, CustomPartsData> | undefined {
  if (customParts == null) {
    return undefined;
  }
  const usedCustomPartsKeys = filterCustomPartsName(stages, customParts);
  const customPartsKeys = Object.keys(customParts).filter(k =>
    usedCustomPartsKeys.has(k),
  );
  if (customPartsKeys.length === 0) {
    // empty!
    return undefined;
  }
  const result: Record<string, CustomPartsData> = {};
  for (const k of customPartsKeys) {
    result[k] = customParts[k];
  }

  return result;
}
