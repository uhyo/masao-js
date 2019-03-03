import { AdvancedMap } from './format';

//Canvas Masao Params
export type Params = Record<string, string>;

// paramを示すデータ
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

export type Data =
  | EnumData
  | BoolData
  | IntegerData
  | StringData
  | ResourceData
  | MapData
  | LayerData
  | ChizuData;

declare const require: any;

export const data: Record<string, Data> = require('../dist-data/params.json');

const athletics: {
  names: Array<string>;
  values: Array<{ value: string; description: string }>;
} = require('../dist-data/athletics.json');
// athletics関係
for (const n of athletics.names) {
  (data[n] as EnumData).enumValues.push(...athletics.values);
}

//マップ系を追加
for (let h = 0; h < 4; h++) {
  const ssfx = ['', '-s', '-t', '-f'][h];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 30; j++) {
      const stg = h > 0 ? '（ステージ' + (h + 1) + '）' : '';
      data['map' + i + '-' + j + ssfx] = {
        description: 'マップ' + i + '-' + j + stg,
        type: 'map',
        default: '.',
      };
    }
  }
}
let map_df = '';
for (let i = 0; i < 120; i++) {
  map_df += '.';
}
for (let h = 0; h < 4; h++) {
  const ssfx = ['', '-s', '-t', '-f'][h];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 30; j++) {
      const stg = h > 0 ? '（ステージ' + (h + 1) + '）' : '';
      data['layer' + i + '-' + j + ssfx] = {
        description: 'レイヤー' + i + '-' + j + stg,
        type: 'layer',
        default: map_df,
        version: {
          '2.8': false,
        },
      };
    }
  }
}
for (let i = 0; i < 9; i++) {
  data['chizu-' + i] = {
    description: '地図' + i,
    type: 'chizu',
    default: '',
  };
}

export const paramKeys = Object.keys(data);

//リソース系paramの一覧
export const resourceKeys = [
  'filename_chizu',
  'filename_ending',
  'filename_fx_bgm_boss',
  'filename_fx_bgm_chizu',
  'filename_fx_bgm_ending',
  'filename_fx_bgm_stage1',
  'filename_fx_bgm_stage2',
  'filename_fx_bgm_stage3',
  'filename_fx_bgm_stage4',
  'filename_fx_bgm_title',
  'filename_gameover',
  'filename_haikei',
  'filename_haikei2',
  'filename_haikei3',
  'filename_haikei4',
  'filename_mapchip',
  'filename_pattern',
  'filename_title',
  'filename_se_bomb',
  'filename_se_block',
  'filename_se_chizugamen',
  'filename_se_clear',
  'filename_se_coin',
  'filename_se_dengeki',
  'filename_se_dokan',
  'filename_se_dosun',
  'filename_se_fireball',
  'filename_se_fumu',
  'filename_se_gameover',
  'filename_se_get',
  'filename_se_grounder',
  'filename_se_happa',
  'filename_se_hinoko',
  'filename_se_item',
  'filename_se_jet',
  'filename_se_jump',
  'filename_se_kaiole',
  'filename_se_kiki',
  'filename_se_miss',
  'filename_se_mizu',
  'filename_se_mizudeppo',
  'filename_se_senkuuza',
  'filename_se_sjump',
  'filename_se_start',
  'filename_se_tobasu',
  'filename_second_haikei',
  'filename_second_haikei2',
  'filename_second_haikei3',
  'filename_second_haikei4',
  'filename_bgm_boss',
  'filename_bgm_chizu',
  'filename_bgm_ending',
  'filename_bgm_stage1',
  'filename_bgm_stage2',
  'filename_bgm_stage3',
  'filename_bgm_stage4',
  'filename_bgm_title',
];

//get default value
export function getDefaultValue(key: string): string | null {
  const d = data[key];
  if (d == null) {
    return null;
  }
  return d.default || '';
}

//validateparams
export interface ValidateParamsOption {
  version: string;
  maxLength: number;
  allowExtraneous: boolean;
  allowNulls: boolean;
}
export function validateParams(
  params: Params,
  opt: Partial<ValidateParamsOption>,
): boolean {
  const options: ValidateParamsOption = {
    version: 'kari2',
    maxLength: Infinity,
    allowExtraneous: true,
    allowNulls: true,
    ...(opt || {}),
  };

  const vc = versionCategory(options.version);

  let pmcnt = 0;
  for (let key in data) {
    const v = params[key];
    if (v != null) {
      if ('string' !== typeof v) {
        return false;
      }
      const vv = data[key];
      if (vv.version && vv.version[vc] === false) {
        continue;
      }
      pmcnt++;

      if (vv.type === 'integer') {
        if (!/^-?\d+$/.test(v)) {
          return false;
        }
        const vi = parseInt(v);
        if (
          (vv.min != null && vi < vv.min) ||
          (vv.max != null && vv.max < vi)
        ) {
          return false;
        }
      } else if (vv.type === 'boolean') {
        if (v !== '1' && v !== '2') {
          return false;
        }
      } else if (vv.type === 'enum') {
        if (vv.enumValues.every(eo => eo.value !== v)) {
          return false;
        }
      } else if (vv.type === 'string') {
        if (v.length > options.maxLength) {
          return false;
        }
      }
    } else if (options.allowNulls === false) {
      //required param is null
      return false;
    }
  }
  if (options.allowExtraneous === false && Object.keys(params).length > pmcnt) {
    //extraneous field
    return false;
  }
  return true;
}

export function cutDefaults(params: Params): Params {
  const result: Params = {};
  for (let key in params) {
    if (key in data) {
      if (params[key] !== data[key].default) {
        result[key] = params[key];
      }
    }
  }
  return result;
}

export interface addDefaultsOption {
  /**
   * バージョンを指定
   */
  version?: string;
  /**
   * マップは入れない
   */
  nomaps?: boolean;
  /**
   * リソースは入れない
   */
  noresources?: boolean;
}

export function addDefaults(
  params: Params,
  version?: addDefaultsOption | string,
): Params {
  let v: '2.8' | 'fx' | 'kani2';
  let opt: addDefaultsOption;
  if ('string' === typeof version) {
    // 後方互換性
    opt = {
      version,
    };
  } else if (version != null) {
    opt = version;
  } else {
    opt = {};
  }
  if (opt.version == null) {
    v = 'kani2';
  } else {
    v = versionCategory(opt.version);
  }
  const result: Params = {};
  for (let key in params) {
    result[key] = params[key];
  }
  for (let key in data) {
    const dk = data[key];
    if (dk.version && dk.version[v] === false) {
      continue;
    }
    if (opt.nomaps === true && (dk.type === 'map' || dk.type === 'layer')) {
      continue;
    }
    if (opt.noresources === true && dk.type === 'resource') {
      continue;
    }
    if (!(key in result)) {
      result[key] = dk.default || '';
    }
  }
  return result;
}

export function sanitize(params: Params, version?: string): Params {
  let v: '2.8' | 'fx' | 'kani2';
  if (version == null) {
    v = 'kani2';
  } else {
    v = versionCategory(version);
  }
  const result: Params = {};
  for (let key in data) {
    const dk = data[key];
    if (dk.version && dk.version[v] === false) {
      continue;
    }
    if (key in params) {
      result[key] = params[key];
    }
  }
  return result;
}

export function cutUnadvancedData(params: Params): Params {
  const result: Params = {};
  for (const key in params) {
    const pd = data[key];
    if (pd != null && (pd.type === 'map' || pd.type === 'layer')) {
      continue;
    }
    result[key] = params[key];
  }
  return result;
}

/**
 * Minimizes map params and returns a new params object.
 * @param params object
 * @param isFXOrLater whether this params are for FX or later. This enables additional minimization.
 */
export function minimizeMapData(
  params: Params,
  isFXOrLater: boolean = false,
): Params {
  const result: Params = {};
  // まず関係ないparamたちをコピー
  for (const key in params) {
    const pd = data[key];
    if (pd != null && (pd.type === 'map' || pd.type === 'layer')) {
      continue;
    }
    result[key] = params[key];
  }
  // ステージ1〜4に対してmapをチェック
  for (const prefix of ['', '-s', '-t', '-f']) {
    let emptyflg = true;
    for (let i = 0; i < 30; i++) {
      // マップを全部結合
      const allmap =
        (params[`map0-${i}${prefix}`] || '.') +
        (params[`map1-${i}${prefix}`] || '.') +
        (params[`map2-${i}${prefix}`] || '.');
      // 右側の.を取り除く
      let length = allmap.length;
      if (length > 180) {
        length = 180;
      }
      while (length > 0 && allmap[length - 1] === '.') {
        length--;
      }
      if (isFXOrLater) {
        if (length > 0) {
          // このマップは空白ではない
          emptyflg = false;
          // 書き込む
          if (length > 120) {
            result[`map0-${i}${prefix}`] = allmap.slice(0, 60);
            result[`map1-${i}${prefix}`] = allmap.slice(60, 120);
            result[`map2-${i}${prefix}`] = allmap.slice(120, length);
          } else if (length > 60) {
            result[`map0-${i}${prefix}`] = allmap.slice(0, 60);
            result[`map1-${i}${prefix}`] = allmap.slice(60, length);
          } else {
            result[`map0-${i}${prefix}`] = allmap.slice(0, length);
          }
        }
      } else {
        if (length > 120) {
          result[`map0-${i}${prefix}`] = allmap.slice(0, 60);
          result[`map1-${i}${prefix}`] = allmap.slice(60, 120);
          result[`map2-${i}${prefix}`] = allmap.slice(120, length);
        } else if (length > 60) {
          result[`map0-${i}${prefix}`] = allmap.slice(0, 60);
          result[`map1-${i}${prefix}`] = allmap.slice(60, length);
          result[`map2-${i}${prefix}`] = '';
        } else {
          result[`map0-${i}${prefix}`] = allmap.slice(0, length);
          result[`map1-${i}${prefix}`] = '';
          result[`map2-${i}${prefix}`] = '';
        }
      }
    }
    if (isFXOrLater && emptyflg && prefix === '') {
      // ステージ1が完全にemptyだとサンプルステージ1になってしまう
      result['map0-0'] = '..';
    }
    // レイヤー
    let layer_df = '';
    for (let i = 0; i < 120; i++) {
      layer_df += '.';
    }
    for (let i = 0; i < 30; i++) {
      const allmap =
        (params[`layer0-${i}${prefix}`] || layer_df) +
        (params[`layer1-${i}${prefix}`] || layer_df) +
        (params[`layer2-${i}${prefix}`] || layer_df);
      // 右側の.を取り除く
      let length = allmap.length;
      if (length > 360) {
        length = 360;
      }
      while (length > 0 && allmap[length - 1] === '.') {
        length--;
      }
      // 書き込む
      if (length > 240) {
        result[`layer0-${i}${prefix}`] = allmap.slice(0, 120);
        result[`layer1-${i}${prefix}`] = allmap.slice(120, 240);
        result[`layer2-${i}${prefix}`] = allmap.slice(240, length);
      } else if (length > 120) {
        result[`layer0-${i}${prefix}`] = allmap.slice(0, 120);
        result[`layer1-${i}${prefix}`] = allmap.slice(120, length);
      } else if (length > 0) {
        result[`layer0-${i}${prefix}`] = allmap.slice(0, length);
      }
    }
  }
  return result;
}

/**
 * Minimize advanced map data and return a new object.
 */
export function minimizeAdvancedData(data: AdvancedMap): AdvancedMap {
  const stages = data.stages.map(stage => {
    return {
      size: { ...stage.size },
      layers: stage.layers.map(layer => {
        return {
          id: layer.id,
          type: layer.type,
          src: layer.src,
          map: minimizeMapArray(layer.map),
        };
      }),
    };
  });
  const result: AdvancedMap = {
    stages,
  };
  if (data.customParts != null) {
    result.customParts = {};
    for (const key in data.customParts) {
      const obj = data.customParts[key];
      result.customParts[key] = {
        extends: obj.extends,
        properties: { ...obj.properties },
      };
    }
  }
  return result;
}

/**
 * Minimize a map represented as array.
 */
function minimizeMapArray(
  array: Array<Array<number | string>>,
): Array<Array<number | string>> {
  const result = [];
  for (const row of array) {
    let { length } = row;
    // 右端の0を消していく
    while (length > 0 && row[length - 1] === 0) {
      length--;
    }
    result.push(row.slice(0, length));
  }
  // 空の行を消していく
  let { length } = result;
  while (length > 0 && result[length - 1].length === 0) {
    length--;
  }
  result.length = length;
  return result;
}

function versionCategory(version: string): '2.8' | 'fx' | 'kani2' {
  //version string -> version category
  if (version === '2.7' || version === '2.8' || version === '2.81') {
    return '2.8';
  }
  if (version === 'kani' || version === 'kani2') {
    return 'kani2';
  }
  return 'fx';
}
