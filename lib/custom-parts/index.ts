import { CustomPartsProperties, CustomPartsPropertySet } from './def';

import {
  walk_speed,
  fall_speed,
  jump_vy,
  interval,
  period,
  distance,
  speed,
  accel,
} from './props';

// predefined things.
const pikachieProperties: CustomPartsPropertySet = {
  jump_vy: jump_vy(-14),
  search_range: {
    type: 'integer',
    unit: 'px',
    description: '索敵範囲',
    default: 240,
  },
  interval: interval(30),
};
const chikorinProperties: CustomPartsPropertySet = {
  period: period(86),
  attack_timing: {
    type: 'timing',
    values: [1, 2],
    description: '葉っぱを投げるタイミング',
    default: {
      2: 2,
      10: 1,
      18: 1,
      26: 1,
    },
  },
};
const chikorinThrowerProperties: CustomPartsPropertySet = {
  interval: interval(40),
};
const mizutaroProperties: CustomPartsPropertySet = {
  walk_speed: walk_speed(3),
};
const airmsProperties: CustomPartsPropertySet = {
  speed: speed(4, '飛行速度'),
  interval: interval(26),
};
const territoryProperties: CustomPartsPropertySet = {
  speed_x: speed(3, '移動速度（横方向）'),
  speed_y: speed(2, '移動速度（縦方向）'),
};
const taikingRotateProperties: CustomPartsPropertySet = {
  speed: {
    type: 'integer',
    unit: 'deg/f',
    description: '角速度',
    default: 5,
  },
  radius: {
    type: 'integer',
    unit: 'px',
    description: '回転半径',
    default: 64,
  },
};

// Generate custom parts data.
const customPartsProperties: CustomPartsProperties = {
  // 亀
  5100: {
    walk_speed: walk_speed(3),
  },
  5110: {
    walk_speed: walk_speed(3),
    fall_speed: fall_speed(5),
  },
  5150: {
    walk_speed: walk_speed(3),
    fall_speed: fall_speed(5),
  },
  // ピカチー
  5200: pikachieProperties,
  5201: pikachieProperties,
  5202: pikachieProperties,
  5203: pikachieProperties,
  // チコリン
  5300: chikorinProperties,
  5301: chikorinProperties,
  5310: chikorinThrowerProperties,
  5311: chikorinThrowerProperties,
  5312: chikorinThrowerProperties,
  5313: chikorinThrowerProperties,
  5320: {},
  5330: {
    interval: interval(120),
  },
  5335: {
    interval: interval(120),
  },
  // ヒノララシ
  5400: {
    walk_speed: walk_speed(4),
  },
  5450: {
    walk_speed: walk_speed(4),
  },
  // ポッピー
  5500: {
    speed: speed(4, '飛行速度'),
    accel: accel(1, '折り返し時の加速度'),
  },
  5510: {
    speed: speed(3, '飛行速度'),
  },
  5520: {
    interval: interval(40),
  },
  5530: {},
  5540: {
    interval: interval(40),
  },
  5550: {
    interval: interval(80),
  },
  // マリリ
  5600: {
    speed: speed(5, '横方向の移動速度'),
    jump_vy: jump_vy(-17),
  },
  5601: {
    speed: speed(5, '横方向の移動速度'),
    jump_vy: jump_vy(-22),
  },
  5602: {
    speed: speed(5, '横方向の移動速度'),
    jump_vy: jump_vy(-17),
  },
  5650: {
    speed: speed(5, '横方向の移動速度'),
    jump_vy: jump_vy(-28),
  },
  5660: {
    speed: speed(8, '移動速度'),
    distance: distance(128, '移動距離'),
    interval: interval(20),
  },
  5670: {
    attack_speed: speed(10, '体当たりの速度'),
    return_speed: speed(4, '戻る速度'),
  },
  5700: {
    interval: interval(40),
  },
  5701: {},
  5702: {
    interval: interval(52),
  },
  5703: {
    interval: interval(52),
  },
  5704: {
    interval: interval(40),
  },
  5710: {
    interval: interval(35),
  },
  5711: {
    interval: interval(35),
  },
  5720: {
    interval: interval(80),
  },
  5725: {
    interval: interval(80),
  },
  // ミズタロウ
  5800: mizutaroProperties,
  5801: mizutaroProperties,
  5802: mizutaroProperties,
  5803: mizutaroProperties,
  5804: mizutaroProperties,
  // エアームズ
  5900: airmsProperties,
  5920: {
    interval: interval(30),
  },
  5921: {
    interval: interval(30),
  },
  5930: {
    speed: speed(4, '飛行速度'),
  },
  5950: airmsProperties,
  // タイキング
  6000: {
    speed: speed(3, '移動速度'),
  },
  6050: {
    jump_vy: jump_vy(-26),
    interval: interval(10),
  },
  6060: territoryProperties,
  6070: taikingRotateProperties,
  6080: taikingRotateProperties,
  // クラゲッソ
  6100: {
    interval: interval(77),
  },
  6150: {
    init_vy: speed(2, '落下の初速'),
  },
  6160: territoryProperties,
  6170: taikingRotateProperties,
  6180: taikingRotateProperties,
  6200: {
    walk_speed: walk_speed(4),
  },
  6400: {
    speed: speed(4, '移動速度'),
  },
};

export { customPartsProperties };
export * from './def';
