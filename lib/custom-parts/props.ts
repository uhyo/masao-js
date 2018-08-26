// Pre-defined properties.

import { IntegerProperty } from './def';

export const walk_speed = (def: number): IntegerProperty => ({
  type: 'integer',
  unit: 'px/f',
  description: '歩く速度',
  default: def,
});

export const fall_speed = (def: number): IntegerProperty => ({
  type: 'integer',
  unit: 'px/f',
  description: '落ちる速度',
  default: def,
});

export const jump_vy = (def: number): IntegerProperty => ({
  type: 'integer',
  unit: 'px/f',
  description: 'ジャンプの初速',
  default: def,
});

export const distance = (
  def: number,
  description = '距離',
): IntegerProperty => ({
  type: 'integer',
  unit: 'px',
  description,
  default: def,
});

export const speed = (def: number, description = '速度'): IntegerProperty => ({
  type: 'integer',
  unit: 'px/f',
  description,
  default: def,
});

export const accel = (
  def: number,
  description = '加速度',
): IntegerProperty => ({
  type: 'integer',
  unit: 'px/f/f',
  description,
  default: def,
});

export const interval = (def: number): IntegerProperty => ({
  type: 'integer',
  unit: 'f',
  description: '行動間隔',
  default: def,
});

export const period = (def: number): IntegerProperty => ({
  type: 'integer',
  unit: 'f',
  description: '行動周期',
  default: def,
});
